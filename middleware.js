import { clerkMiddleware,createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([ // these are the routes that are protected and require the user to be logged in
  "/dashboard(.*)",
  "/resume(.*)",
  "/interview(.*)",
  "/ai-cover-letter(.*)",
  "/onboarding(.*)",
]);

export default clerkMiddleware(async (auth, req) => { // this middleware runs on every request and recieves the auth object and request
    // auth object contains userId, sessionId, and other auth related info and req is the request object i.e. the incoming request to the server 
    // i.e. the URL, headers, body, etc.
  const { userId } = await auth(); // from the auth object, we get the userId which is the id of the user who is logged in

  if (!userId && isProtectedRoute(req)) { // if there is no userId and the request is for a protected route, we redirect to the sign in page
    const { redirectToSignIn } = await auth(); // this function is provided by Clerk via the auth object 
    return redirectToSignIn(); // it redirects the user to the sign in page
  }

  return NextResponse.next(); // if the user is logged in or the request is not for a protected route, we continue with the request that is we allow to acess the requested resource
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};