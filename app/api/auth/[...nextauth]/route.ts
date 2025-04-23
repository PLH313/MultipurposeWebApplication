// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (!user || user.password !== credentials.password) {
                    return null
                }

                if (!user.emailVerified) {
                    throw new Error('Please verify your email first')
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            }
        })
    ],
    callbacks: {
        session: ({ session, token }) => ({
            ...session,
            user: {
                ...session.user,
                id: token.sub
            }
        })
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/signin"
    },
    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }