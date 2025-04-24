import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import AuthStatus from '@/components/AuthStatus'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    return (
        <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
        <Providers session={session}>
            <NavBar session={session} />
            <main className="container mx-auto p-4">
                {children}
            </main>

            {/* Add Toaster here */}
            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: '#3b82f6',
                        color: '#fff',
                    },
                    iconTheme: {
                        primary: '#fff',
                        secondary: '#3b82f6',
                    }
                }}
            />
        </Providers>
        </body>
        </html>
    )
}

function NavBar({ session }: { session: any }) {
    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                {/* <Link href="/" className="text-xl font-bold">My App</Link> */}
                <Link href="/miniprojects" className="hover:text-gray-300 text-xl font-bold">
                    Dashboard
                </Link>
                <div className="w-full flex justify-end">
                    {session ? (
                        <>
                            <AuthStatus />
                        </>
                    ) : (
                        <Link href="/auth/signin" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}