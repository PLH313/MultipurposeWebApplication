'use client'

import ProductForm from '../ProductForm'
import { useRouter } from 'next/navigation'
import { createProduct } from '../actions'

export default function NewProductPage() {
    const router = useRouter()

    const handleSubmit = async (formData: FormData) => {
        try {
            await createProduct(formData)
            router.push('/miniprojects/productmanagement')
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to create product')
        }
    }

    return (
        <div className="max-w-6xl mx-auto p-4 text-black bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <ProductForm onSubmit={handleSubmit} />
            </div>
        </div>
    )
}