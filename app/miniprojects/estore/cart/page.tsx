'use client'

import { useCartStore } from '@/lib/cart-store'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { formatVND } from '@/utils/format'

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, checkout } = useCartStore()
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const router = useRouter()

    const handleCheckout = async () => {
        try {
            await toast.promise(
                checkout(),
                {
                    loading: 'Processing your order...',
                    success: 'Order placed successfully!',
                    error: 'Failed to place order. Please try again.'
                },
                {
                    style: {
                        minWidth: '250px',
                    },
                    success: {
                        duration: 5000,
                        icon: '🎉',
                        style: {
                            background: '#4BB543',
                            color: '#fff',
                        },
                    },
                    error: {
                        duration: 4000,
                        icon: '❌',
                        style: {
                            background: '#ff4444',
                            color: '#fff',
                        },
                    },
                }
            )

            // Redirect to orders page after successful checkout
            // router.push('/miniprojects/estore/orders')
        } catch (error) {
            console.error('Checkout error:', error)
        }
    }

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

                {/* Cart Content */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold mb-8 text-black">Your Cart</h1>

                    {cart.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-black">Your cart is empty</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-200">
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
                                            <p>{formatVND(item.price)} x {item.quantity}</p>
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

                            <div className="mt-2 pt-4">
                            <div className="flex justify-between items-center mb-4">
                                    <span className="text-xl font-bold">Total:</span>
                                    <span className="text-xl">{formatVND(total)}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Checkout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}