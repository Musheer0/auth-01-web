import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const auth_routes = ["/sign-in", "/sign-up", "/twofa"];
const public_routes = ["/reset-password"];
const protected_routes = ["/dashboard"]
export function middleware(req: NextRequest) {
  const session_id = req.cookies.get("session")?.value;
  const { pathname } = req.nextUrl;

  // ✅ If user has session but is visiting auth routes → send to dashboard
  if (session_id && auth_routes.includes(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // ❌ If no session and visiting protected routes → send to sign-in
  if (!session_id && protected_routes.includes(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  // otherwise, continue
  return NextResponse.next();
}

// Optional: apply middleware only to certain paths
export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};
