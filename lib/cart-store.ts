// lib/cart-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Order {
    id: string
    items: CartItem[]
    total: number
    createdAt: Date
}
interface CartItem {
    id: string
    title: string
    price: number
    quantity: number
    imageUrl?: string
}

interface CartStore {
    cart: CartItem[]
    orders: Order[]
    addToCart: (product: CartItem) => void
    removeFromCart: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    checkout: () => Promise<void>
}


export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            cart: [],
            orders: [],  // Initialize orders array

            addToCart: (product) => set((state) => {
                const existing = state.cart.find(item => item.id === product.id)
                if (existing) {
                    return {
                        cart: state.cart.map(item =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        )
                    }
                }
                return { cart: [...state.cart, { ...product, quantity: 1 }] }
            }),

            removeFromCart: (productId) => set((state) => ({
                cart: state.cart.filter(item => item.id !== productId)
            })),

            updateQuantity: (productId, quantity) => set((state) => ({
                cart: state.cart.map(item =>
                    item.id === productId ? { ...item, quantity } : item
                )
            })),

            checkout: async () => {
                try {
                    const { cart } = useCartStore.getState()
                    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

                    const response = await fetch('/api/orders', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ items: cart, total })
                    })

                    if (!response.ok) throw new Error('Checkout failed')

                    // Add to orders history
                    set((state) => ({
                        cart: [],
                        orders: [...state.orders, {
                            id: Date.now().toString(),
                            items: cart,
                            total,
                            createdAt: new Date()
                        }]
                    }))
                } catch (error) {
                    console.error('Checkout error:', error)
                    throw error
                }
            }
        }),
        {
            name: 'cart-storage',
            getStorage: () => localStorage
        }
    )
)