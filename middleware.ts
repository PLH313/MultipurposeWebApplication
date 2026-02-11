// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    if (token && pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/miniprojects', req.url))
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/signin", 
    },
  }
)

export const config = {
  matcher: [
    "/miniprojects/:path*", 
    "/api/projects/:path*", 
  ]
}
