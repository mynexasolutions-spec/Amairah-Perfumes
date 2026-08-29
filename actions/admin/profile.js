"use server";

import { cookies } from "next/headers";
import { verifyAdminSessionToken, COOKIE_NAME as ADMIN_COOKIE_NAME } from "@/lib/adminSession";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function getAdminProfile() {
  // 1. Check custom admin session cookie first
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (adminToken) {
    const adminSession = await verifyAdminSessionToken(adminToken);
    if (adminSession) {
      const adminClient = createAdminClient();
      const { data: profile } = await adminClient
        .from("profiles")
        .select("full_name, email")
        .eq("email", adminSession.email)
        .maybeSingle();

      return profile || { full_name: "Admin", email: adminSession.email };
    }
  }

  // 2. Fallback to Supabase auth
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("full_name, email").eq("id", user.id).maybeSingle();
  return profile;
}

export async function updateAdminProfile(_prevState, formData) {
  // 1. Check custom admin session cookie first
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  let adminEmail = null;

  if (adminToken) {
    const adminSession = await verifyAdminSessionToken(adminToken);
    if (adminSession) {
      adminEmail = adminSession.email;
    }
  }

  const fullName = formData.get("full_name");
  const newPassword = formData.get("new_password");

  if (adminEmail) {
    if (newPassword) {
      return { error: "To change the administrator password, please update ADMIN_PASSWORD in the .env file." };
    }

    const adminClient = createAdminClient();
    const { error: profileError } = await adminClient
      .from("profiles")
      .update({ full_name: fullName })
      .eq("email", adminEmail);

    if (profileError) return { error: profileError.message };

    revalidatePath("/admin/settings/profile");
    return { success: true };
  }

  // 2. Fallback to Supabase auth
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error: profileError } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id);
  if (profileError) return { error: profileError.message };

  if (newPassword) {
    if (newPassword.length < 6) return { error: "New password must be at least 6 characters." };
    const { error: passwordError } = await supabase.auth.updateUser({ password: newPassword });
    if (passwordError) return { error: passwordError.message };
  }

  revalidatePath("/admin/settings/profile");
  return { success: true };
}
