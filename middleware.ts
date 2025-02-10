import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    "/signin",
    "/sighup",
    "/",
    "/home",
])

const isPublicApiRoute = createRouteMatcher([
    "/api/videos",
])



export default clerkMiddleware(async (auth, req) => {
     
    const {userId} = auth();
     const currentURL = new URL(req.url);
     const isAccessingHomePage = currentURL.pathname === "/home"
     const isApiRequest = currentURL.pathname.startsWith('/api')
    
     if(userId && isPublicRoute(req) && !isAccessingHomePage){
        return NextResponse.redirect(new URL("/home", req.url));
}



export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}