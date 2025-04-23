// app/auth/verify/page.tsx
'use client'
import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function VerifyPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    useEffect(() => {
        const verifyToken = async () => {
            try {
                // 1. Validate token exists in URL
                if (!token) {
                    throw new Error('Verification link is invalid')
                }

                // 2. Make API request
                const response = await fetch(`/api/auth/verify?token=${token}`)

                // 3. Check response content type
                const contentType = response.headers.get('content-type')
                if (!contentType?.includes('application/json')) {
                    // Log the actual response for debugging
                    const text = await response.text()
                    console.error('Non-JSON response:', text)
                    throw new Error('Server returned invalid response')
                }

                // 4. Parse JSON response
                const data = await response.json()

                // 5. Handle response
                if (!response.ok || !data.success) {
                    throw new Error(data.error || 'Verification failed')
                }

                // 6. Redirect on success
                window.location.href = data.redirectTo || '/auth/signin?verified=1'

            } catch (error) {
                console.error('Verification error:', error)
                router.push(
                    `/auth/signin?error=${
                        encodeURIComponent(
                            error instanceof Error ? error.message : 'Verification failed'
                        )
                    }`
                )
            }
        }

        verifyToken()
    }, [token, router])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
            <p className="text-lg font-medium">Verifying your email...</p>
            <p className="text-sm text-gray-500">
                Please wait while we confirm your email address
            </p>
        </div>
    )
}