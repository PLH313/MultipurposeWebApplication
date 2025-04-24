// app/estore/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatVND } from '@/utils/format'
import { getProducts } from '../../miniprojects/productmanagement/actions'

export default function EStorePage() {
    const [products, setProducts] = useState<any[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [categories, setCategories] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await getProducts()
                setProducts(data)

                // Extract unique categories
                const uniqueCategories = Array.from(new Set(
                    data.map(p => p.category.name)
                ))
                setCategories(['all', ...uniqueCategories])
            } finally {
                setLoading(false)
            }
        }
        loadProducts()
    }, [])

    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(p => p.category.name === selectedCategory)

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Store Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
                    <h1 className="text-3xl font-bold text-gray-900">Book Store</h1>

                    {/* Category Filter */}
                    <div className="flex gap-2 flex-wrap">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full ${
                                    selectedCategory === category
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 shadow-sm hover:bg-gray-50'
                                }`}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                                <div className="h-48 bg-gray-200" />
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <Link href={`/estore/${product.id}`} className="block">
                                    <div className="relative h-48">
                                        <Image
                                            src={product.imageUrl || '/placeholder-book.jpg'}
                                            alt={product.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.title}</h3>
                                        <p className="text-sm text-gray-500 mb-3">{product.author}</p>
                                        <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-blue-600">
                        {formatVND(product.price)}
                      </span>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    // Add to cart logic here
                                                }}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No products found in this category</p>
                    </div>
                )}
            </div>
        </div>
    )
}