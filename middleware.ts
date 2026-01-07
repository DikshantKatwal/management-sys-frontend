import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read cookies
  const accessToken = request.cookies.get("access")?.value;
  const refreshToken = request.cookies.get("refresh")?.value;

  const isAuthenticated = Boolean(accessToken || refreshToken);

  // If authenticated and not already on /admin, redirect
  if (isAuthenticated && !pathname.startsWith("/admin")) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

/**
 * Apply middleware only to public pages
 * (avoid /admin to prevent redirect loop)
 */
export const config = {
  matcher: [
    "/", // home
    "/login", // login page
    "/register", // register page
  ],
};
