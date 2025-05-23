import { NextRequest, NextResponse } from "next/server";
import {
  fetchSessionFromServer,
  fetchUserFromServer,
} from "./utils/server-utils";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const parsedURL = new URL(request.url);
  const path = parsedURL.pathname;

  console.log("🔍 [MIDDLEWARE] Running for path:", path);
  console.log("🔍 [MIDDLEWARE] Request URL:", request.url);

  try {
    // Check if user is coming from TOTP confirmation (AWS Cognito hosted UI)
    const referer = request.headers.get("referer");
    const isFromCognitoHostedUI =
      referer && referer.includes("auth.eu-west-1.amazoncognito.com");

    if (isFromCognitoHostedUI) {
      console.log(
        "🔍 [MIDDLEWARE] ✅ Coming from Cognito hosted UI, allowing access"
      );
      return response;
    }

    // Check for authentication cookies first (immediate after auth)
    const cookies = request.cookies;
    const hasAuthCookies =
      cookies.get(
        "CognitoIdentityServiceProvider.14de4luql4dgp3k7kos516ji4n.LastAuthUser"
      ) ||
      cookies.get(
        "CognitoIdentityServiceProvider.14de4luql4dgp3k7kos516ji4n.idToken"
      ) ||
      cookies
        .getAll()
        .some((cookie) =>
          cookie.name.includes("CognitoIdentityServiceProvider")
        );

    console.log("🔍 [MIDDLEWARE] Auth cookies present:", !!hasAuthCookies);

    if (hasAuthCookies) {
      // If auth cookies exist, assume user is authenticated/authenticating
      console.log("🔍 [MIDDLEWARE] ✅ Auth cookies found, allowing access");
      return response;
    }

    // Only do the expensive user fetch if no auth cookies
    console.log("🔍 [MIDDLEWARE] No auth cookies, checking user session...");
    const currentUser = await fetchUserFromServer();
    console.log("🔍 [MIDDLEWARE] User fetch result:", currentUser);
    console.log("🔍 [MIDDLEWARE] User ID:", currentUser?.userId);
    const authenticated = !!currentUser?.userId;

    if (authenticated) {
      console.log("🔍 [MIDDLEWARE] ✅ User authenticated, allowing access");
      return response;
    }

    console.log(
      "🔍 [MIDDLEWARE] ❌ User not authenticated, redirecting to login"
    );
    console.log("🔍 [MIDDLEWARE] Redirect URL:", `/login?origin=${path}`);

    return NextResponse.redirect(new URL(`/login?origin=${path}`, request.url));
  } catch (error) {
    console.error("🔍 [MIDDLEWARE] ❌ Error in middleware:", error);
    return NextResponse.redirect(new URL(`/login?origin=${path}`, request.url));
    //return NextResponse.redirect(new URL(`/`, request.url));
  }
}

export const config = {
  // matcher: [
  //   /*
  //    * Match all request paths except for the ones starting with:
  //    * - api (API routes)
  //    * - _next/static (static files)
  //    * - _next/image (image optimization files)
  //    * - favicon.ico (favicon file)
  //    */
  //   // "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
  //   "/((?!api|_next/static|_next/image|favicon.ico|login|events|profile).*)",
  // ],
  // PUT MORE paths to protect to this array
  matcher: [
    "/home", // Re-added with race condition fix
    "/user-search",
    "/create-post",
    "/publish-post",
    "/side-hustle",
  ],
};
