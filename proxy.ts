import { clerkMiddleware } from "@clerk/nextjs/server";

const isDashboardRoute = (pathname: string) =>
  pathname === "/dashboard" || pathname.startsWith("/dashboard/");

export default clerkMiddleware(
  async (auth, req) => {
    if (!isDashboardRoute(req.nextUrl.pathname)) return;

    const { userId, redirectToSignIn } = await auth();
    if (!userId) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
  },
  { signInUrl: "/sign-in", signUpUrl: "/sign-up" },
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for Clerk's auto-proxy path
    "/__clerk/:path*",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
