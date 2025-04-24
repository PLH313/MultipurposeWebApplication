// lib/cart-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
    id: string
    title: string
    price: number
    quantity: number
    imageUrl?: string
}

interface CartStore {
    cart: CartItem[]
    addToCart: (product: CartItem) => void
    removeFromCart: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    checkout: () => Promise<void>
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            cart: [],

            addToCart: (product) => {
                const existingItem = get().cart.find(item => item.id === product.id)

                if (existingItem) {
                    set({
                        cart: get().cart.map(item =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + product.quantity }
                                : item
                        )
                    })
                } else {
                    set({ cart: [...get().cart, product] })
                }
            },

            removeFromCart: (productId) => {
                set({ cart: get().cart.filter(item => item.id !== productId) })
            },

            updateQuantity: (productId, quantity) => {
                if (quantity < 1) return

                set({
                    cart: get().cart.map(item =>
                        item.id === productId ? { ...item, quantity } : item
                    )
                })
            },

            checkout: async () => {
                try {
                    const { cart } = get()
                    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

                    const response = await fetch('/api/orders', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ items: cart, total })
                    })

                    if (!response.ok) throw new Error('Checkout failed')

                    set({ cart: [] })
                } catch (error) {
                    console.error('Checkout failed:', error)
                    throw error
                }
            }
        }),
        {
            name: 'cart-storage',
            storage: {
                getItem: (name) => {
                    const item = localStorage.getItem(name)
                    return item ? JSON.parse(item) : null
                },
                setItem: (name, value) => {
                    localStorage.setItem(name, JSON.stringify(value))
                },
                removeItem: (name) => {
                    localStorage.removeItem(name)
                }
            },
        }
    )
)