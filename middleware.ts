import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET 
    })

    const { pathname } = request.nextUrl


    if (token && pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    if (!token && !pathname.startsWith('/auth')) {
        const url = new URL('/auth/signin', request.url)
        url.searchParams.set('callbackUrl', encodeURI(request.url))
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
