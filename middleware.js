import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const isAdminPath = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAccountPath = pathname.startsWith("/account") || pathname.startsWith("/checkout");

  if (!isAdminPath && !isAccountPath) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAdminPath && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (isAccountPath && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isAdminPath && user) {
    let role = user.user_metadata?.role;
    let fullName = user.user_metadata?.full_name;

    // Fallback to database query if metadata is missing
    if (!role) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .maybeSingle();
      
      role = profile?.role;
      fullName = profile?.full_name;
    }

    if (role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    // Pass identity through so the admin layout doesn't have to re-verify
    // the session with another Supabase round trip. Encoded since header
    // values must be ASCII-safe and full_name may contain other characters.
    response.headers.set("x-admin-name", encodeURIComponent(fullName || "Admin"));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/checkout/:path*"],
};
