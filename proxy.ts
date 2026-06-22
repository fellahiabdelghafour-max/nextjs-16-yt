import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

 console.log("PROXY RUNNING");
export async function proxy(request: NextRequest) {
    console.log('hello')
	const sessionCookie = getSessionCookie(request);

    // THIS IS NOT SECURE!
    // This is the recommended approach to optimistically redirect users
    // We recommend handling auth checks in each page/route
	if (!sessionCookie) {
		return NextResponse.redirect(new URL("/auth/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
  matcher: ['/blog/:path*', '/Create/:path*'],
}