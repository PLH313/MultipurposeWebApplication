'use client'

import { useRouter } from 'next/navigation'
import { createPost } from '../actions'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function NewPostPage() {
    const router = useRouter()
    const { data: session } = useSession()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim() || !content.trim() || !session?.user?.id) return

        await createPost(title, content, session.user.id)
        router.push('/miniprojects/blog')
    }
    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                Create New Post
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block mb-2 font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 border-2 border-indigo-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block mb-2 font-medium text-gray-700">
                        Content
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-3 border-2 border-indigo-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[200px] text-black"
                        required
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-green-500 hover:to-blue-600 transition-all shadow-md"
                    >
                        Publish Post
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/miniprojects/blog')}
                        className="bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 px-6 py-3 rounded-lg hover:from-gray-400 hover:to-gray-500 transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}