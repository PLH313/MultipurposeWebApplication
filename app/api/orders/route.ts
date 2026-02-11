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
        const order = await prisma.$transaction(async (tx) => {
            
            for (const item of items) {
                const product = await tx.product.findUnique({
                    where: { id: item.id }
                })

                if (!product || product.stock < item.quantity) {
                    throw new Error(`Sản phẩm "${item.title}" không đủ hàng (Còn: ${product?.stock || 0})`)
                }

                await tx.product.update({
                    where: { id: item.id },
                    data: {
                        stock: {
                            decrement: item.quantity
                        }
                    }
                })
            }

            const newOrder = await tx.order.create({
                data: {
                    userId: session.user.id,
                    items: items, 
                    total: total,
                }
            })

            return newOrder
        })

        return NextResponse.json(order)

    } catch (error) {
        console.error("Order Error:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create order' },
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
