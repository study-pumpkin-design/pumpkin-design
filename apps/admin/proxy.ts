import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const PRIVATE_ROUTES = ["/admin-dashboard"];
    const PUBLIC_ROUTES = ["/login"];
    if (PUBLIC_ROUTES.includes(pathname)) {
      return NextResponse.next();
    }

    const token = request.cookies.get("token")?.value;
    console.log("login token", token);
    if (!token && PRIVATE_ROUTES.includes(pathname))
      return NextResponse.redirect(new URL("/login", request.url));

    return NextResponse.redirect(new URL("/login", request.url));
  } catch (error: any) {
    console.log(error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/:path*"],
};
