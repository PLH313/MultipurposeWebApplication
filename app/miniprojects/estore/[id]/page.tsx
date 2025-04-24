// app/estore/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { formatVND } from '@/utils/format'
import { getProductById, getProducts } from '../../../miniprojects/productmanagement/actions'
import Link from 'next/link'
import { ProductDetail } from '@/types/product'

export default function ProductDetailPage() {
    const [product, setProduct] = useState<ProductDetail | null>(null)
    const { id } = useParams()
    const router = useRouter()
    const [relatedProducts, setRelatedProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                // Load main product
                const productData = await getProductById(id as string)
                if (!productData) {
                    router.push('/estore')
                    return
                }
                setProduct(productData)

                // Load related products
                const related = await getProducts({
                    category: productData.category.name,
                    limit: 4,
                    exclude: productData.id
                })
                setRelatedProducts(related)
            } catch (error) {
                console.error('Failed to load product:', error)
                router.push('/estore')
            } finally {
                setLoading(false)
            }
        }

        if (id) loadData()
    }, [id, router])

    if (loading) return <div className="text-center p-8">Loading product...</div>
    if (!product) return <div className="text-center p-8">Product not found</div>

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-8 text-blue-600 hover:text-blue-800 flex items-center"
                >
                    ← Back to Store
                </button>

                {/* Product Main Content */}
                <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Product Image */}
                        <div className="relative h-96 rounded-lg overflow-hidden">
                            <Image
                                src={product.imageUrl || '/placeholder-book.jpg'}
                                alt={product.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>

                        {/* Product Details */}
                        <div className="space-y-6">
                            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                            <p className="text-xl text-gray-600">{product.author}</p>
                            <div className="text-2xl font-bold text-blue-600">
                                {formatVND(product.price)}
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-black">Description</h2>
                                <p className="text-gray-600 whitespace-pre-line">
                                    {product.description}
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg">
                                    Add to Cart
                                </button>
                                <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors text-lg">
                                    Buy Now
                                </button>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <dl className="grid grid-cols-2 gap-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Category</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {product.category.name}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Stock</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {product.stock} available
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold mb-8">Related Books</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map(product => (
                                <Link
                                    key={product.id}
                                    href={`/estore/${product.id}`}
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                >
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
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {product.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-3">{product.author}</p>
                                        <div className="text-lg font-bold text-blue-600">
                                            {formatVND(product.price)}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}