import {clerkMiddleware ,createRouteMatcher} from "@clerk/nextjs/server";


const isProtectedRoute = createRouteMatcher([
  '/',
]);
const isWebhookRoute = createRouteMatcher([
  '/api/webhook'
])

export default clerkMiddleware((auth, req) => {
  if (isWebhookRoute(req)) {
    return;
  }
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};