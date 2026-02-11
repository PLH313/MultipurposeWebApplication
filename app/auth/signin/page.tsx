'use client'

import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function SignInPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/'
    const [verified, setVerifiedMessage] = useState(searchParams.get('verified'))
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setVerifiedMessage(null)
        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
                callbackUrl
            })

            if (result?.error) {
                setError(result.error)
            } else {
                window.location.href = '/miniprojects'
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-black">Welcome</h1>
                    <p className="mt-2 text-black">Sign in to your account</p>
                </div>

                {verified && (
                    <div className="bg-green-100 text-green-800 p-4 mb-4">
                        Email verified successfully! Please sign in.
                    </div>
                )}

                {error && (
                    <div className="p-4 text-sm text-black bg-red-100 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-black">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-black"
                                placeholder="your@email.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-black">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-black"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-200"
                        >
                            Sign in
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <p className="text-sm text-black">
                        Don't have an account?{' '}
                        <Link
                            href="/auth/signup"
                            className="font-medium text-black hover:text-gray-700 underline"
                        >
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
