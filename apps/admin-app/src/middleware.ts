import { NextRequest, NextResponse } from "next/server";
import {
  fetchSessionFromServer,
  fetchUserFromServer,
} from "./utils/server-utils";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const parsedURL = new URL(request.url);
  const path = parsedURL.pathname;

  try {
    // const session = await fetchSessionFromServer();
    // console.log("🚀 ~ middleware ~ session:", session);
    const currentUser = await fetchUserFromServer();
    console.log("🚀 ~ middleware ~ currentUser:", currentUser);
    const authenticated = !!currentUser?.userId;

    if (authenticated) {
      console.log("authenticated go to ", response);
      return response;
    }

    console.log("mdw not autenticated redirect to ", `/login?origin=${path}`);

    return NextResponse.redirect(new URL(`/login?origin=${path}`, request.url));
  } catch (error) {
    console.log("middleware", error);
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
    "/home",
    "/user-search",
    "/create-post",
    "/publish-post",
    "/side-hustle",
  ],
};
