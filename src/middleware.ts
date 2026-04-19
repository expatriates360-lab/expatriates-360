import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Routes that are accessible without authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/about(.*)",
  "/jobs(.*)",
  "/candidates(.*)",
  "/market(.*)",
  "/education(.*)",
  "/contact(.*)",
  "/privacy(.*)",
  "/terms(.*)",
  "/sign-in(.*)",
  "/register(.*)",
  "/api/webhooks(.*)", // Clerk webhook must be public
  "/api/cron(.*)",    // Cron jobs use CRON_SECRET bearer token, not Clerk session
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
