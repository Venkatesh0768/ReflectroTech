import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Edge Middleware — Server-side route protection.
 *
 * Blocks unauthenticated users from accessing protected routes.
 * Protected routes: /dashboard, /profile, /admin, /erp/*
 *
 * Redirect behaviour:
 * - No refreshToken cookie → redirect to /login?redirect=<original path>
 * - Authenticated users are NOT redirected away from /login/register;
 *   AuthContext handles that client-side after a successful token refresh.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasRefreshToken = request.cookies.has("refreshToken");

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/erp");

  if (isProtectedRoute && !hasRefreshToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/erp/:path*",
  ],
};
