"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import crypto from "crypto";
import { sendBrevoEmail, otpEmailHtml, resetPasswordEmailHtml } from "@/lib/brevo";
import { createAdminSessionToken, COOKIE_NAME as ADMIN_COOKIE_NAME, MAX_AGE_SECONDS as ADMIN_COOKIE_MAX_AGE } from "@/lib/adminSession";

function safeRedirect(target) {
  return target && target.startsWith("/") ? target : "/";
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function login(_prevState, formData) {
  const supabase = await createClient();
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Invalid email or password." };

  revalidatePath("/", "layout");
  redirect(safeRedirect(formData.get("redirect_to")));
}

export async function requestSignupOtp(_prevState, formData) {
  const fullName = formData.get("full_name");
  const email = formData.get("email");
  const password = formData.get("password");
  const phone = formData.get("phone");

  if (!fullName || !email || !password) {
    return { error: "Full name, email, and password are required." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const admin = createAdminClient();

  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (existingProfile) {
    return { error: "An account with this email already exists." };
  }

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  const { error: dbError } = await admin
    .from("signup_otps")
    .upsert({ email, otp, full_name: fullName, phone: phone || null, expires_at: expiresAt }, { onConflict: "email" });
  if (dbError) {
    console.error("Signup OTP save error:", dbError);
    return { error: "Failed to start verification. Please try again." };
  }

  const emailResult = await sendBrevoEmail({
    to: email,
    subject: "Your Amairah Perfumes Verification Code",
    html: otpEmailHtml(otp),
  });
  if (emailResult.error) return { error: emailResult.error };

  return { success: true };
}

export async function verifySignupOtp(_prevState, formData) {
  const email = formData.get("email");
  const otp = formData.get("otp");
  const fullName = formData.get("full_name");
  const phone = formData.get("phone");
  const password = formData.get("password");

  if (!email || !otp || !password) {
    return { error: "Missing verification details. Please start over." };
  }

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const admin = createAdminClient();

  const { data: record } = await admin
    .from("signup_otps")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (!record) {
    return { error: "No verification code found for this email. Please request a new one." };
  }
  if (record.otp !== otp.trim()) {
    return { error: "Invalid verification code." };
  }
  if (new Date(record.expires_at) < new Date()) {
    await admin.from("signup_otps").delete().eq("email", email);
    return { error: "This code has expired. Please request a new one." };
  }

  await admin.from("signup_otps").delete().eq("email", email);

  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, phone: phone || "", role: "customer" },
  });

  if (createError) {
    if (createError.message.toLowerCase().includes("already been registered")) {
      return { error: "An account with this email already exists." };
    }
    return { error: createError.message };
  }

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) {
    return { error: "Account created — please log in." };
  }

  revalidatePath("/", "layout");
  redirect(safeRedirect(formData.get("redirect_to")));
}

export async function requestPasswordReset(_prevState, formData) {
  const email = formData.get("email");
  if (!email) return { error: "Email is required." };

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const admin = createAdminClient();

  const { data: profile } = await admin.from("profiles").select("id").eq("email", email).maybeSingle();
  if (!profile) return { error: "No account found with this email." };

  const successState = { success: true, message: "A reset link has been sent to your email." };

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  await admin.from("password_reset_tokens").delete().eq("email", email);
  const { error: dbError } = await admin.from("password_reset_tokens").insert({ token, email, expires_at: expiresAt });
  if (dbError) {
    console.error("Password reset token save error:", dbError);
    return { error: "Failed to start password reset. Please try again." };
  }

  const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`;
  const emailResult = await sendBrevoEmail({
    to: email,
    subject: "Reset your Amairah Perfumes password",
    html: resetPasswordEmailHtml(resetLink),
  });
  if (emailResult.error) return { error: emailResult.error };

  return successState;
}

export async function resetPassword(_prevState, formData) {
  const token = formData.get("token");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirm_password");

  if (!token) return { error: "Missing or invalid reset link." };
  if (!password || password.length < 6) return { error: "Password must be at least 6 characters." };
  if (password !== confirmPassword) return { error: "Passwords do not match." };

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const admin = createAdminClient();

  const { data: record } = await admin.from("password_reset_tokens").select("*").eq("token", token).maybeSingle();
  if (!record) return { error: "This reset link is invalid or has already been used." };
  if (new Date(record.expires_at) < new Date()) {
    await admin.from("password_reset_tokens").delete().eq("token", token);
    return { error: "This reset link has expired. Please request a new one." };
  }

  const { data: profile } = await admin.from("profiles").select("id").eq("email", record.email).maybeSingle();
  if (!profile) return { error: "Account not found." };

  const { error: updateError } = await admin.auth.admin.updateUserById(profile.id, { password });
  if (updateError) return { error: updateError.message };

  await admin.from("password_reset_tokens").delete().eq("token", token);

  return { success: true };
}

async function setAdminSessionCookie(email) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, await createAdminSessionToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ADMIN_COOKIE_MAX_AGE,
    path: "/",
  });
}

// Supabase Auth (GoTrue) has been hanging for minutes at a time on this
// project, so admin login no longer goes through it at all — it checks
// straight against ADMIN_EMAIL/ADMIN_PASSWORD and issues our own signed
// cookie (lib/adminSession.js). middleware.js verifies that same cookie on
// every /admin request instead of calling supabase.auth.getUser().
export async function adminLogin(_prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const isValid = adminEmail && adminPassword && email.toLowerCase() === adminEmail.toLowerCase() && password === adminPassword;

  if (!isValid) {
    return { error: "Invalid credentials." };
  }

  await setAdminSessionCookie(email);
  revalidatePath("/admin", "layout");
  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  revalidatePath("/admin", "layout");
  redirect("/admin/login");
}
