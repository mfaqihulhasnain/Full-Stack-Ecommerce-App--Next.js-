// Middleware using Clerk for authentication
import { clerkMiddleware } from '@clerk/nextjs/server';

// Export the Clerk middleware with minimal configuration
export default clerkMiddleware();

// Configure the matcher for paths that should trigger the middleware
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}; 