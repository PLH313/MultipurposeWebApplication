//gallery/page.tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { uploadImage, getImages, deleteImage } from './actions'

interface Image {
    id: string
    url: string
    caption: string
    createdAt: Date
}

export default function GalleryPage() {
    const { data: session } = useSession()
    const [images, setImages] = useState<Image[]>([])
    const [preview, setPreview] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [selectedImage, setSelectedImage] = useState<Image | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (session?.user?.id) {
            getImages(session.user.id).then(setImages)
        }
    }, [session?.user?.id])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                if (e.target?.result) {
                    setPreview(e.target.result as string)
                }
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!session?.user?.id) return

        const formData = new FormData(e.currentTarget as HTMLFormElement)
        const file = fileInputRef.current?.files?.[0]

        if (!file || !formData.get('caption')) return

        setIsUploading(true)
        try {
            await uploadImage(formData)
            const updatedImages = await getImages(session.user.id)
            setImages(updatedImages)

            // Reset form and preview
            setPreview(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
            ;(e.target as HTMLFormElement).reset()
        } finally {
            setIsUploading(false)
        }
    }

    const handleDelete = async (imageId: string) => {
        if (!window.confirm('Delete this image permanently?')) return
        await deleteImage(imageId)
        setImages(images.filter(img => img.id !== imageId))
    }

    const ImageModal = () => {
        if (!selectedImage) return null

        return (
            <div
                className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                onClick={() => setSelectedImage(null)}
            >
                <div className="relative max-w-3xl w-full max-h-[80vh]">
                    <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
                        <Image
                            src={selectedImage.url}
                            alt={selectedImage.caption}
                            width={1200}
                            height={800}
                            className="w-full h-auto max-h-[60vh] object-contain"
                        />
                        <div className="p-4 bg-gray-100">
                            <p className="text-center text-gray-700">{selectedImage.caption}</p>
                        </div>
                    </div>
                    <button
                        className="absolute -top-20 -right-20 text-white hover:text-gray-200 text-3xl transition-all duration-200 cursor-pointer hover:scale-125"
                        onClick={() => setSelectedImage(null)}
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <ImageModal />

            <h1 className="text-3xl font-bold mb-6 text-black">Gallery</h1>

            {/* Upload Form */}
            <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-white p-6 rounded-lg shadow">
                <div>
                    <label className="block mb-2 font-medium text-black">Image</label>
                    <div className="space-y-4">
                        <div>
                            <input
                                ref={fileInputRef}
                                id="file"
                                name="file"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="border p-2 w-full rounded text-black"
                                required
                            />
                        </div>

                        {preview && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                <div className="relative w-full h-60 mb-4">
                                    <Image
                                        src={preview}
                                        alt="Preview"
                                        fill
                                        className="object-contain mx-auto bg-gray-100 rounded"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'contain'
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
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

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                    <div
                        key={image.id}
                        className="relative group bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setSelectedImage(image)}
                    >
                        <Image
                            src={image.url}
                            alt={image.caption}
                            width={400}
                            height={300}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-3">
                            <p className="text-sm mb-2 text-black">{image.caption}</p>
                            <div className="flex gap-3">
                                <Link
                                    href={`/miniprojects/gallery/${image.id}/edit`}
                                    className="text-blue-500 hover:text-blue-700 text-xs"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDelete(image.id)
                                    }}
                                    className="text-red-500 hover:text-red-700 text-xs"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}