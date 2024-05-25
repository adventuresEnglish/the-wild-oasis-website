import { auth } from "@/app/_lib/auth";

export const middleware = auth;

export const config = {
  matcher: ["/account"],
};

//import { NextResponse } from "next/server";

// we use the matcher property to specify the routes we want to apply the middleware to in this case we are redirecting the user to the about page if they visit the account or cabins page
// export function middleware(request: Request) {
//   return NextResponse.redirect(new URL("/about", request.url));
// }
// export const config = {
//   matcher: ["/account", "/cabins"],
// };

// import { NextResponse } from "next/server";

// export function middleware(request: Request) {
//   const requestHeaders = new Headers(request.headers);
//   requestHeaders.set("x-url", request.url);

//   return NextResponse.next({
//     request: {
//       headers: requestHeaders,
//     },
//   });
// }
