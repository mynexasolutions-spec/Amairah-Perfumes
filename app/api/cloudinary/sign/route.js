import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@/lib/supabase/server";

import { cookies } from "next/headers";
import { verifyAdminSessionToken, COOKIE_NAME as ADMIN_COOKIE_NAME } from "@/lib/adminSession";

export async function POST(request) {
  // Only signed-in admins may request an upload signature.
  let isAuthorizedAdmin = false;

  // 1. Check custom admin session cookie first
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (adminToken) {
    const adminSession = await verifyAdminSessionToken(adminToken);
    if (adminSession) {
      isAuthorizedAdmin = true;
    }
  }

  // 2. Fallback to Supabase auth
  if (!isAuthorizedAdmin) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
      if (profile?.role === "admin") {
        isAuthorizedAdmin = true;
      }
    }
  }

  if (!isAuthorizedAdmin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { paramsToSign } = body;

  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

  return Response.json({ signature });
}
