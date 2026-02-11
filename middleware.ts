import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    const cookieName = process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token' 
        : 'next-auth.session-token'

    const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET,
        cookieName: cookieName 
    })
    
    if (token && pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/miniprojects', request.url))
    }

    if (!token && !pathname.startsWith('/auth') && !pathname.startsWith('/api')) {
        const signInUrl = new URL('/auth/signin', request.url)
        signInUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(signInUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/miniprojects/:path*', '/dashboard/:path*', '/auth/:path*']
}
