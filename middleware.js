import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { verifyAdminSessionToken, COOKIE_NAME as ADMIN_COOKIE_NAME } from "@/lib/adminSession";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const isAdminPath = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAccountPath = pathname.startsWith("/account") || pathname.startsWith("/checkout");

  // Admin auth no longer touches Supabase at all — Supabase Auth (GoTrue)
  // was hanging for minutes at a time on this project. adminLogin (actions/auth.js)
  // issues a self-signed cookie instead; this just verifies it.
  if (isAdminPath) {
    const adminSession = await verifyAdminSessionToken(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
    if (!adminSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    const response = NextResponse.next({ request });
    response.headers.set("x-admin-name", encodeURIComponent("Admin"));
    return response;
  }

  if (!isAccountPath) {
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

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/checkout/:path*"],
};
