// app/estore/[id]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { getProductById } from '../../../miniprojects/productmanagement/actions'
import { useEffect, useState } from 'react'

export default function ProductDetailsPage() {
    const { id } = useParams()
    const [product, setProduct] = useState<any>(null)

    useEffect(() => {
        const loadProduct = async () => {
            const data = await getProductById(id as string)
            setProduct(data)
        }
        if (id) loadProduct()
    }, [id])

    if (!product) return <div>Loading...</div>

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Product details implementation */}
        </div>
    )
}