'use client'

import { useState } from 'react'
import { put } from '@vercel/blob'

export default function ImageUpload({
                                        initialUrl = '',
                                        onUploadComplete
                                    }: {
    initialUrl?: string
    onUploadComplete: (url: string) => void
}) {
    const [preview, setPreview] = useState(initialUrl)
    const [loading, setLoading] = useState(false)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setLoading(true)
        try {
            const { url } = await put(file.name, file, {
                access: 'public',
                contentType: file.type
            })
            setPreview(url)
            onUploadComplete(url)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-2">
            <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
                id="image-upload"
            />
            <label
                htmlFor="image-upload"
                className="block border-2 border-dashed rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
            >
                {loading ? (
                    'Uploading...'
                ) : preview ? (
                    <img
                        src={preview}
                        alt="Preview"
                        className="max-h-48 mx-auto object-contain"
                    />
                ) : (
                    'Click to upload product image'
                )}
            </label>
        </div>
    )
}