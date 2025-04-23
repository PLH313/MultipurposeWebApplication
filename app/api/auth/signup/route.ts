import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/mail'

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json()

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            )
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "Email already in use" },
                { status: 409 }
            )
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password
            }
        })

        const verificationToken = await generateVerificationToken(email)
        await sendVerificationEmail(
            email,
            `${process.env.NEXTAUTH_URL}/api/verify?token=${verificationToken.token}`,
            name
        )

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })

    } catch (error) {
        console.error("Signup error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}