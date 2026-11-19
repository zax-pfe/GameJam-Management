import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/supabase/config";

const PUBLIC_PATHS = [
  "/login",
  "/auth/callback",
  // Dev-only design reference (404 in production), uses fake data.
  ...(process.env.NODE_ENV === "production" ? [] : ["/styleguide"]),
];

/**
 * Refreshes the Supabase session on every navigation and keeps every page
 * behind the Google login. Membership (email whitelist) is checked in the
 * OAuth callback and enforced in the database by RLS.
 */
export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!isSupabaseConfigured) {
    return isPublic ? NextResponse.next() : redirectTo(request, "/login");
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet, headers) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // Verifies the JWT (do not trust getSession() on the server).
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims?.sub);

  if (!signedIn && !isPublic) {
    return redirectTo(request, "/login", response);
  }
  if (signedIn && pathname === "/login" && !request.nextUrl.searchParams.has("error")) {
    return redirectTo(request, "/", response);
  }
  return response;
}

function redirectTo(request, pathname, from) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  const redirect = NextResponse.redirect(url);
  // Keep refreshed auth cookies on the redirect.
  from?.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
