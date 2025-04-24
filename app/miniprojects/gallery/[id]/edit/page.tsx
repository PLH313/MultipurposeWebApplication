//app/miniprojects/gallery/[id]/edit/page.tsx
'use client'

import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getImageById, updateImage } from '../../actions'

export default function EditImagePage() {
    const { id } = useParams()
    const router = useRouter()
    const { data: session } = useSession()
    const [caption, setCaption] = useState('')
    const [file, setFile] = useState<File | undefined>(undefined) // Changed from null to undefined
    const [preview, setPreview] = useState<string | null>(null)
    const [currentImage, setCurrentImage] = useState<string | null>(null)

    useEffect(() => {
        const loadImage = async () => {
            if (session?.user?.id) {
                const image = await getImageById(id as string)
                if (image) {
                    setCaption(image.caption)
                    setCurrentImage(image.url)
                }
            }
        }
        loadImage()
    }, [id, session?.user?.id])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFile(file)
            setPreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!session?.user?.id) return

        try {
            await updateImage(id as string, {
                caption,
                file,
                userId: session.user.id
            })
            router.push('/miniprojects/gallery')
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Update failed')
        }
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-black">Edit Image</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block mb-2 font-medium text-black">Current Image</label>
                    {currentImage && (
                        <div className="relative w-full h-48 mb-4">
                            <Image
                                src={currentImage}
                                alt="Current"
                                fill
                                className="object-cover rounded"
                            />
                        </div>
                    )}
                </div>

                <div>
                    <label className="block mb-2 font-medium text-black">New Image (optional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="border p-2 w-full rounded text-black"
                    />
                    {preview && (
                        <div className="relative w-48 h-48 mt-4">
                            <Image
                                src={preview}
                                alt="Preview"
                                fill
                                className="object-cover rounded"
                            />
                        </div>
                    )}
                </div>

                <div>
                    <label className="block mb-2 font-medium text-black">Caption</label>
                    <input
                        type="text"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="border p-2 w-full rounded text-black"
                        required
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                    >
                        Update Image
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}