import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/",
    "/home",
])

const isPublicApiRoute = createRouteMatcher([
    "/api/video",
])

export default clerkMiddleware(async (auth, req) => {
     
     const authData = await auth();
     const {userId} = authData;
     const currentURL = new URL(req.url);
     const isAccessingHomePage = currentURL.pathname === "/home"
     const isApiRequest = currentURL.pathname.startsWith('/api')

     console.log("userId",userId);
    
     if(userId && isPublicRoute(req) && !isAccessingHomePage){
        return NextResponse.redirect(new URL("/home", req.url));
     }
     if(!userId){
       
      if(currentURL.pathname === "/"){
        return NextResponse.redirect(new URL("/sign-in",req.url));
      }
       
       if(!isPublicRoute(req) && !isPublicApiRoute(req)){
        return NextResponse.redirect(new URL("/sign-in", req.url));
        }
       if(isApiRequest && !isPublicApiRoute(req)){
        return NextResponse.redirect(new URL("/sign-in", req.url));
       }
      }
      return NextResponse.next();
    })
  
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}