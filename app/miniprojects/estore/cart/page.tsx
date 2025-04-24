// app/cart/page.tsx
'use client'

import { useCartStore } from '@/lib/cart-store'
import Image from 'next/image'
import Link from 'next/link'

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, checkout } = useCartStore()
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

                {cart.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">Your cart is empty</p>
                        <Link href="/estore" className="text-blue-600 hover:underline">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {cart.map(item => (
                                <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                                    {item.imageUrl && (
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.title}
                                            width={80}
                                            height={80}
                                            className="rounded-lg"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{item.title}</h3>
                                        <p>${item.price} x {item.quantity}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.id, Math.max(1, parseInt(e.target.value)))}
                                            className="w-16 px-2 py-1 border rounded"
                                        />
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-4 border-t">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xl font-bold">Total:</span>
                                <span className="text-xl">${total.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={checkout}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                            >
                                Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}