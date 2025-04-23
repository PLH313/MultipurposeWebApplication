import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    try {
        if (!token) {
            return NextResponse.json(
                { error: "Token is required" },
                { status: 400 }
            )
        }

        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token }
        })

        if (!verificationToken) {
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 404 }
            )
        }

        if (verificationToken.expires < new Date()) {
            return NextResponse.json(
                { error: "Token expired" },
                { status: 410 }
            )
        }

        await prisma.$transaction([
            prisma.user.update({
                where: { email: verificationToken.identifier },
                data: { emailVerified: new Date() }
            }),
            prisma.verificationToken.delete({
                where: { id: verificationToken.id }
            })
        ])

        return NextResponse.redirect(
            new URL('/auth/signin?verified=1', request.url)
        )

    } catch (error) {
        console.error("Verification error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}