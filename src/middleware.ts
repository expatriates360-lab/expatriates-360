import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Routes that are accessible without authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/about(.*)",
  "/jobs(.*)",
  "/candidates(.*)",
  "/market(.*)",
  "/education(.*)",
  "/search(.*)",
   "/post(.*)",
  "/contact(.*)",
  "/privacy(.*)",
  "/terms(.*)",
  "/sign-in(.*)",
  "/register(.*)",
  "/create(.*)",        // ✅ ADD THIS LINE
  "/api/webhooks(.*)",
  "/api/cron(.*)",
  "/api/maps(.*)",
  "/ads.txt",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

