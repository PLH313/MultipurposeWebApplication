// components/AuthStatus.tsx
'use client'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function AuthStatus() {
    const { data: session, status } = useSession()

    if (status === 'loading') return null
    return (
        <div className="flex items-center gap-5">
            {session ? (
                <>
                    <span className="text-XL">Welcome, {session.user?.name} </span>
                    <button
                        onClick={async () => {
                            await signOut({ redirect: false })
                            window.location.href = '/auth/signin'
                        }}
                        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
                    >
                        Sign Out
                    </button>
                </>
            ) : (
                <Link
                    href="/auth/signin"
                    className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm"
                >
                    Sign In
                </Link>
            )}
        </div>
    )
}
