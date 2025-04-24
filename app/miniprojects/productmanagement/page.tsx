'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { getProducts, deleteProduct } from './actions'
import { formatVND } from '@/utils/format'
import Image from 'next/image'
import { ProductList } from '@/types/product'

export default function ProductManagementPage() {
    const [products, setProducts] = useState<ProductList[]>([])
    const [loading, setLoading] = useState(true)

    const loadProducts = useCallback(async () => {
        try {
            const data = await getProducts()
            setProducts(data)
        } catch (error) {
            console.error('Failed to load products:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadProducts()
    }, [loadProducts])

    const handleDelete = async (productId: string) => {
        if (!window.confirm('Delete this product permanently?')) return
        try {
            await deleteProduct(productId)
            await loadProducts()
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Delete failed')
        }
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Product Management</h1>
                <Link
                    href="/miniprojects/productmanagement/new"
                    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600 transition-colors"
                >
                    <PlusCircle size={18} />
                    Add Product
                </Link>
            </div>

            {loading ? (
                <div className="text-center">Loading products...</div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-black">Image</th>
                            <th className="px-6 py-3 text-left text-black">Title</th>
                            <th className="px-6 py-3 text-left text-black">Author</th>
                            <th className="px-6 py-3 text-right text-black">Price</th>
                            <th className="px-6 py-3 text-right text-black">Stock</th>
                            <th className="px-6 py-3 text-left text-black">Category</th>
                            <th className="px-6 py-3 text-right text-black">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr
                                key={product.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    {product.imageUrl && (
                                        <div className="relative w-16 h-16">
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.title}
                                                fill
                                                className="object-cover rounded"
                                                sizes="(max-width: 768px) 64px, 64px"
                                            />
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-black">{product.title}</td>
                                <td className="px-6 py-4 text-black">{product.author}</td>
                                <td className="px-6 py-4 text-right text-black">{formatVND(product.price)}</td>
                                <td className="px-6 py-4 text-right text-black">{product.stock}</td>
                                <td className="px-6 py-4 text-black">{product.category.name}</td>
                                <td className="px-6 py-4 text-right text-black space-x-4">
                                    <Link
                                        href={`/miniprojects/productmanagement/${product.id}/edit`}
                                        className="text-blue-500 hover:text-blue-700"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDelete(product.id)
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}