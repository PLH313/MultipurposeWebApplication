import NextAuth, { type NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import type { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
    interface Session extends DefaultSession {
        user?: {
            id: string
        } & DefaultSession["user"]
    }

    interface User extends DefaultUser {
        id: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
    }
}

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
                    throw new Error('Email and password are required')
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })
                if (!user) {
                    throw new Error('User not found')
                }
                if (user.password !== credentials.password) {
                    throw new Error('Incorrect password')
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
        async session({ session, token }) {
            // Send user ID to client
            if (session.user && token.sub) {
                session.user.id = token.sub
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id
            }
            return token
        }
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