'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatVND } from '@/utils/format'

interface Order {
    id: string
    items: Array<{
        id: string
        title: string
        price: number
        quantity: number
        imageUrl?: string
    }>
    total: number
    createdAt: string
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/orders')
                if (!response.ok) throw new Error('Failed to fetch orders')
                const data = await response.json()
                setOrders(data)
            } catch (error) {
                console.error('Error fetching orders:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [])

    if (loading) return <div className="text-center p-8">Loading orders...</div>

    return (
        <div className="min-h-screen bg-gray-50 p-8 text-black">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <div className="mb-8">
                    <Link
                        href="/miniprojects/estore"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                    >
                        ← Back to Store
                    </Link>
                </div>

                {/* Orders Content */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold mb-8 text-black">Order History</h1>

                    {orders.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 mb-4 text-black">No orders yet</p>
                            <Link href="/miniprojects/estore" className="text-blue-600 hover:underline">
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map(order => (
                                <div key={order.id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="font-semibold">
                                            Order #{order.id} - {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="text-lg font-bold">
                                            {formatVND(order.total)}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {order.items.map(item => (
                                            <div key={item.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    {item.imageUrl && (
                                                        <img
                                                            src={item.imageUrl}
                                                            alt={item.title}
                                                            className="w-12 h-12 rounded"
                                                        />
                                                    )}
                                                    <span>{item.title}</span>
                                                </div>
                                                <span>
                                                    {item.quantity} x {formatVND(item.price)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}