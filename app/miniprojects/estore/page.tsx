'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatVND } from '@/utils/format'
import { getProducts, getTotalProductsCount } from '../../miniprojects/productmanagement/actions'
import { useDebounce } from 'use-debounce'
import type { ProductList } from '@/types/product'
import { useCartStore } from '@/lib/cart-store'

export default function EStorePage() {
    const [products, setProducts] = useState<ProductList[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [categories, setCategories] = useState<string[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearch] = useDebounce(searchQuery, 500)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const itemsPerPage = 12
    const {cart} = useCartStore()
    //const [showCart, setShowCart] = useState(false)

    useEffect(() => {
        const loadProducts = async () => {
            try {
                // Get products with pagination and filters
                const productsData = await getProducts({
                    category: selectedCategory !== 'all' ? selectedCategory : undefined,
                    search: debouncedSearch,
                    page: currentPage,
                    limit: itemsPerPage
                })

                // Get total count for pagination
                const total = await getTotalProductsCount({
                    category: selectedCategory !== 'all' ? selectedCategory : undefined,
                    search: debouncedSearch
                })

                setProducts(productsData)
                setTotalPages(Math.ceil(total / itemsPerPage))

                // Extract unique categories
                const uniqueCategories = Array.from(new Set(
                    productsData.map(p => p.category.name)
                ))
                setCategories(['all', ...uniqueCategories])
            } finally {
                setLoading(false)
            }
        }
        loadProducts()
    }, [selectedCategory, debouncedSearch, currentPage])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
        setCurrentPage(1)
    }

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return
        setCurrentPage(newPage)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header with Navigation */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Book Store</h1>
                    <div className="flex gap-4">
                        <Link
                            href="/miniprojects/estore/cart"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <span>Cart</span>
                            <span
                                className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                            {cart.reduce((total, item) => total + item.quantity, 0)}
                        </span>
                        </Link>
                        <Link
                            href="/miniprojects/estore/orders"
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Order History
                        </Link>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="mb-8 space-y-4 text-black">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search books..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => {
                                    setSelectedCategory(category)
                                    setCurrentPage(1)
                                }}
                                className={`px-4 py-2 rounded-full text-sm ${
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
                                <div className="h-48 bg-gray-200"/>
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"/>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"/>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                            <div key={product.id}
                                 className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <Link href={`/miniprojects/estore/${String(product.id).trim()}`} className="block">
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
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                <div className="mt-8 flex justify-center items-center gap-4 text-black">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <span className="text-gray-600">
                    Page {currentPage} of {totalPages}
                </span>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>

                {/* Empty State */}
                {!loading && products.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No products found</p>
                    </div>
                )}
            </div>
        </div>
    )
}