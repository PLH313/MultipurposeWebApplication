import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import Link from 'next/link'

export default async function Home() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return (
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-6 text-gray-900">Welcome to My App</h1>
                <p className="mb-6 text-gray-600">Please sign in to access your mini projects</p>
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

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-blue-50 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6 text-blue-800">Welcome to your space!</h1>
            <p className="mb-6 text-blue-700">You are signed in as {session.user?.email}</p>
            <Link
                href="/miniprojects"
                className="bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700"
            >
                Go to Dashboard
            </Link>
        </div>
    )

}
