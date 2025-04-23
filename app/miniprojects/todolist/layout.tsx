import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'

export default async function TodoLayout({
                                             children,
                                         }: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)
    if (!session) redirect('/auth/signin?callbackUrl=/miniprojects/todolist')

    return <>{children}</>
}