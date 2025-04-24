// app/api/orders/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { items, total } = await request.json()

    try {
        const order = await prisma.order.create({
            data: {
                userId: session.user.id,
                items,
                total,
            }
        })

        return NextResponse.json(order)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        )
    }
}

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const orders = await prisma.order.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(orders)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        )
    }
}