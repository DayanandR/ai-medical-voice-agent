import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)", "/api/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect all other routes
  await auth.protect();

  // Admin-only enforcement
  if (isAdminRoute(req)) {
    const { sessionClaims } = await auth();

    // Check role with proper type assertion
    const userRole = (sessionClaims?.metadata as { role?: string })?.role;
    const userEmail = (sessionClaims as any)?.email;

    // Admin whitelist (fallback)
    const adminEmails = ["dayarathod2001@gmail.com", "admin@yourapp.com"];
    const isAdmin =
      userRole === "admin" || adminEmails.includes(userEmail || "");

    if (!isAdmin) {
      return NextResponse.redirect(
        new URL("/dashboard?error=admin_required", req.url)
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
