import { NextResponse } from "next/server";

export function proxy(request) {
    const { pathname } = request.nextUrl;

    // 🔓 Public routes
    if (
        pathname.startsWith("/login") ||
        pathname.startsWith("/register") ||
        pathname.startsWith("/api")
    ) {
        return NextResponse.next();
    }

    const token = request.cookies.get("token")?.value;

    if (pathname.startsWith("/patient") && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/patient/:path*"],
};
