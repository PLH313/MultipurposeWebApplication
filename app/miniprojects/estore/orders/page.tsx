// app/orders/page.tsx
'use client'

import { useCartStore } from '@/lib/cart-store'
import Link from 'next/link'

export default function OrdersPage() {
    const { orders } = useCartStore()

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold mb-8">Order History</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">No orders yet</p>
                        <Link href="/estore" className="text-blue-600 hover:underline">
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
                                    <span className="text-lg font-bold">${order.total.toFixed(2)}</span>
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
                        {item.quantity} x ${item.price.toFixed(2)}
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
    )
}