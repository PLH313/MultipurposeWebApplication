'use client'

import { useState, useEffect } from 'react'
import { createCategory, getCategories } from '../actions'

interface Category {
    id: string
    name: string
    slug: string
    createdAt: Date
    updatedAt: Date
}

export default function CategoryPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [newCategory, setNewCategory] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await getCategories()
                setCategories(data)
            } catch (error) {
                console.error('Failed to load categories:', error)
            }
        }
        loadCategories()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newCategory.trim()) return

        setLoading(true)
        try {
            const slug = newCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            const category = await createCategory(newCategory, slug)
            setCategories([...categories, category])
            setNewCategory('')
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to create category')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Book Categories</h1>

            <form onSubmit={handleSubmit} className="mb-8 flex gap-2">
                <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name"
                    className="flex-1 p-2 border rounded"
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add Category'}
                </button>
            </form>

            <div className="grid grid-cols-2 gap-4">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow"
                    >
                        <h3 className="font-semibold mb-1">{category.name}</h3>
                        <p className="text-sm text-gray-500">{category.slug}</p>
                        <p className="text-xs text-gray-400 mt-2">
                            Created: {new Date(category.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}