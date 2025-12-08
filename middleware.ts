import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define which routes need protection
const isProtectedRoute = createRouteMatcher([
  "/main(.*)", // Protects all routes starting with /main
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect(); // Changed from auth().protect()
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
