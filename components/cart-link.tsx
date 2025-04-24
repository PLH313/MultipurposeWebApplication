// app/components/cart-link.tsx
'use client'

import Link from 'next/link'
import { useCartStore } from '@/lib/cart-store'

export default function CartLink() {
    const { cart } = useCartStore()

    return (
        <Link href="/cart" className="flex items-center gap-2">
            🛒 Cart
            {cart.length > 0 && (
                <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
          {cart.reduce((sum, item) => sum + item.quantity, 0)}
        </span>
            )}
        </Link>
    )
}