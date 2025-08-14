import { auth } from "@/server/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  
  // Allow access to home and landing pages without authentication
  if (req.nextUrl.pathname === "/" || req.nextUrl.pathname === "/home") {
    return NextResponse.next()
  }
  
  // For all other pages, require authentication
  if (!isLoggedIn) {
    const signInUrl = new URL("/api/auth/signin", req.url)
    signInUrl.searchParams.set("callbackUrl", req.url)
    return NextResponse.redirect(signInUrl)
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match specific protected routes:
     * - /ask
     * - /profile  
     * - /post/[slug]
     */
    "/ask",
    "/profile",
    "/post/:path*",
  ],
}
