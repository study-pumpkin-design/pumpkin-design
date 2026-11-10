import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    if (pathname.startsWith("/_next/") || pathname.includes(".")) {
      return NextResponse.next();
    }

    const PRIVATE_ROUTES = ["/admin-dashboard", "/admin-dashboard/courses"];
    const PUBLIC_ROUTES = ["/login"];
    if (PUBLIC_ROUTES.includes(pathname)) {
      return NextResponse.next();
    }

    const token = request.cookies.get("token")?.value;

    if (PRIVATE_ROUTES.includes(pathname) && token) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/login", request.url));
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/:path*"],
};
