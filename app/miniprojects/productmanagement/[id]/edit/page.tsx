'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getProductById, updateProduct } from '../../actions'
import ProductForm from '../../ProductForm'
import { ProductDetail } from '@/types/product' // Import shared type

export default function EditProductPage() {
    const { id } = useParams()
    const router = useRouter()
    const [product, setProduct] = useState<ProductDetail | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const data = await getProductById(id as string)
                setProduct(data || null)
            } catch (error) {
                console.error('Failed to load product:', error)
                router.push('/miniprojects/productmanagement')
            } finally {
                setLoading(false)
            }
        }

        if (id) loadProduct()
    }, [id, router])

    const handleSubmit = async (formData: FormData) => {
        try {
            await updateProduct(id as string, formData)
            router.push('/miniprojects/productmanagement')
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Update failed')
        }
    }

    if (loading) return <div className="text-black p-4">Loading product details...</div>
    if (!product) return <div className="text-black p-4">Product not found</div>

    return (
        <div className="max-w-6xl mx-auto p-4 text-black bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <ProductForm
                    product={{
                        ...product,
                        imageUrl: product.imageUrl ?? undefined // Convert null to undefined
                    }}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    )
}