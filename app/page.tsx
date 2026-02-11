// app/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import Link from 'next/link'
import { redirect } from 'next/navigation' // Import hàm redirect

export default async function Home() {
    // 1. Lấy session
    const session = await getServerSession(authOptions)

    // 2. NẾU ĐÃ ĐĂNG NHẬP: Đá sang trang Dashboard ngay lập tức
    if (session) {
        redirect('/miniprojects')
    }

    // 3. NẾU CHƯA ĐĂNG NHẬP: Hiện giao diện chào mừng (Return duy nhất ở đây)
    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">Welcome to My App</h1>
            <p className="mb-6">Please sign in to access your mini projects</p>
            
            <div className="flex flex-col space-y-4">
                <Link
                    href="/auth/signin"
                    className="bg-blue-500 text-white text-center py-2 px-4 rounded hover:bg-blue-600"
                >
                    Sign In
                </Link>
                <Link
                    href="/auth/signup"
                    className="bg-gray-200 text-gray-800 text-center py-2 px-4 rounded hover:bg-gray-300"
                >
                    Create Account
                </Link>
            </div>
        </div>
    )
}
