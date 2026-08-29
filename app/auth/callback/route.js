import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeRedirect(target) {
  return target && target.startsWith("/") ? target : "/";
}

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeRedirect(requestUrl.searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  return NextResponse.redirect(new URL("/login?error=google", requestUrl.origin));
}
