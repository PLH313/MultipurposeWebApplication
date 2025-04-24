'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProduct, getCategories } from './actions'
import Image from 'next/image'
import { uploadProductFile } from '@/lib/blob'

interface ProductFormProps {
    product?: {
        id: string
        title: string
        author: string
        description: string
        price: number
        stock: number
        categoryId: string
        imageUrl?: string
    }
    onSubmit: (formData: FormData) => Promise<void>
}

export default function ProductForm({ product, onSubmit }: ProductFormProps) {
    const [categories, setCategories] = useState<Awaited<ReturnType<typeof getCategories>>>([])
    const [imageUrl, setImageUrl] = useState(product?.imageUrl || '')
    const router = useRouter()

    useEffect(() => {
        getCategories().then(setCategories)
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget as HTMLFormElement)
        formData.set('imageUrl', imageUrl)
        await onSubmit(formData)
    }

    const handleImageUpload = async (file: File) => {
        try {
            const { url } = await uploadProductFile(file)
            setImageUrl(url)
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Image upload failed')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-4 text-black">
            <input
                type="hidden"
                name="imageUrl"
                value={imageUrl}
            />

            <div>
                <label className="block mb-2 font-medium">Book Title</label>
                <input
                    name="title"
                    defaultValue={product?.title || ''}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <div>
                <label className="block mb-2 font-medium">Author</label>
                <input
                    name="author"
                    defaultValue={product?.author || ''}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <div>
                <label className="block mb-2 font-medium">Description</label>
                <textarea
                    name="description"
                    defaultValue={product?.description || ''}
                    className="w-full p-2 border rounded h-32"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block mb-2 font-medium">Giá (VND)</label>
                    <input
                        type="number"
                        name="price"
                        defaultValue={product?.price || 0}
                        min="0"
                        step="1"
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">Stock</label>
                    <input
                        type="number"
                        name="stock"
                        defaultValue={product?.stock || 0}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block mb-2 font-medium">Category</label>
                <select
                    name="categoryId"
                    defaultValue={product?.categoryId || ''}
                    className="w-full p-2 border rounded"
                    required
                >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block mb-2 font-medium">Book Cover</label>
                <input
                    type="file"
                    name="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file)
                    }}
                    className="border p-2 w-full rounded"
                    required={!product}
                />
                {imageUrl && (
                    <div className="mt-2 relative w-32 h-32">
                        <Image
                            src={imageUrl}
                            alt="Preview"
                            fill
                            className="object-cover rounded"
                            sizes="(max-width: 768px) 100vw, 128px"
                        />
                    </div>
                )}
            </div>

            <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
                {product ? 'Update Product' : 'Add Product'}
            </button>
            <button
                type="button"
                onClick={() => router.push('/miniprojects/productmanagement')}
                className="ml-4 bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
                Cancel
            </button>
        </form>
    )
}