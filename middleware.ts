import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // QUAN TRỌNG: Truyền secret trực tiếp vào đây để giải mã Token trên Vercel
    const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET 
    })

    // Debug: Bật F12 -> Application -> Cookies xem có cookie nào không?
    // Nếu token null nghĩa là Secret sai hoặc URL sai.

    // 1. Đã Login (Có token) mà cố vào trang Auth (Signin/Signup) -> Đẩy về Home
    if (token && pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // 2. Chưa Login (Token null) mà cố vào trang bảo mật -> Đẩy về Signin
    // Lưu ý: Không chặn '/api' để tránh lỗi auth flow
    if (!token && !pathname.startsWith('/auth') && !pathname.startsWith('/api')) {
        // Tạo URL login có kèm callback để đăng nhập xong quay lại đúng chỗ
        const signInUrl = new URL('/auth/signin', request.url)
        signInUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(signInUrl)
    }

    return NextResponse.next()
}

export const config = {
    // Matcher chỉ quét các trang cần kiểm tra, bỏ qua file tĩnh
    matcher: ['/miniprojects/:path*', '/dashboard/:path*', '/auth/:path*']
}
