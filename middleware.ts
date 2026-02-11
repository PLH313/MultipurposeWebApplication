    import { NextResponse } from 'next/server'
    import type { NextRequest } from 'next/server'
    import { getToken } from 'next-auth/jwt'

    export async function middleware(request: NextRequest) {
        const token = await getToken({ req: request })
        const { pathname } = request.nextUrl

        if (pathname.startsWith('/auth') || pathname.startsWith('/api')) {
            return NextResponse.next()
        }
        return NextResponse.next()
    }

    export const config = {
        matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
    }
