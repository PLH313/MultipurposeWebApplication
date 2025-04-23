// app/miniprojects/gallery/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { uploadImage, getImages, deleteImage } from './actions'
import Image from 'next/image'

interface Image {
    id: string
    url: string
    caption: string
    createdAt: Date
}

export default function GalleryPage() {
    const { data: session } = useSession()
    const [images, setImages] = useState<Image[]>([])
    const [isUploading, setIsUploading] = useState(false)

    useEffect(() => {
        if (session?.user?.id) {
            getImages(session.user.id).then(setImages)
        }
    }, [session?.user?.id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!session?.user?.id) return

        const formData = new FormData(e.currentTarget as HTMLFormElement)
        const fileInput = document.getElementById('file') as HTMLInputElement
        const file = fileInput.files?.[0]

        if (!file || !formData.get('caption')) return

        setIsUploading(true)
        try {
            await uploadImage(formData)
            const updatedImages = await getImages(session.user.id)
            setImages(updatedImages)
        } finally {
            setIsUploading(false)
            // Reset form
            ;(e.target as HTMLFormElement).reset()
        }
    }

    const handleDelete = async (imageId: string) => {
        if (!window.confirm('Delete this image permanently?')) return
        await deleteImage(imageId)
        setImages(images.filter(img => img.id !== imageId))
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Gallery</h1>

            <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-white p-6 rounded-lg shadow">
                <div>
                    <label className="block mb-2 font-medium text-black">Image</label>
                    <input
                        id="file"
                        name="file"
                        type="file"
                        accept="image/*"
                        className="border p-2 w-full rounded text-black"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2 font-medium text-black">Caption</label>
                    <input
                        name="caption"
                        type="text"
                        className="border p-2 w-full rounded text-black"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isUploading}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                    <div key={image.id} className="relative group bg-white rounded-lg shadow-md overflow-hidden">
                        <Image
                            src={image.url}
                            alt={image.caption}
                            width={400}
                            height={300}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-3">
                            <p className="text-sm mb-2">{image.caption}</p>
                            <button
                                onClick={() => handleDelete(image.id)}
                                className="text-red-500 hover:text-red-700 text-xs"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}