import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export default async function middleware(req: NextRequest) {
    const cookieStore = await cookies(); 
    const token = cookieStore.get("authtoken")?.value;
    let userId: string | null = null;

    if (token) {
        try {
            const verified = await jwtVerify(
                token,
                new TextEncoder().encode(process.env.NEXT_SECRET_TOKEN_KEY as string)
            );
            userId = verified.payload.userid as string;
        } catch (error) {
            console.error("JWT verification failed:", error);
        }
    }

    const isAuthRoute = ["/login", "/signup"].includes(req.nextUrl.pathname);
    const isAllowedRoute = req.nextUrl.pathname.startsWith("/emailverify") || 
                           req.nextUrl.pathname.startsWith("/forgotpassword/");

    if (token && userId && isAuthRoute) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (!token && !userId && !isAuthRoute && !isAllowedRoute) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|emailverify|forgotpassword/.*).*)"],
};
