'use client'

import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { getPostBySlug, updatePost } from '../../actions'

export default function EditPostPage() {
    const router = useRouter()
    const { data: session } = useSession()
    const params = useParams<{ slug: string }>()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadPost() {
            if (!session?.user?.id || !params.slug) return

            const post = await getPostBySlug(params.slug, session.user.id)
            if (post) {
                setTitle(post.title)
                setContent(post.content)
                setLoading(false)
            } else {
                router.push('/miniprojects/blog')
            }
        }
        loadPost()
    }, [session, params.slug, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim() || !content.trim() || !session?.user?.id || !params.slug) return

        try {
            const post = await getPostBySlug(params.slug, session.user.id)
            if (!post) return

            const { slug: updatedSlug } = await updatePost(
                post.id,
                title,
                content,
                session.user.id
            )
            router.push(`/miniprojects/blog/${updatedSlug}`)
            router.refresh()
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to update post')
        }
    }

    if (loading) {
        return <div className="text-center p-8">Loading...</div>
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                Edit Post
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
                        className="bg-gradient-to-r from-blue-400 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-blue-500 hover:to-purple-600 transition-all shadow-md"
                    >
                        Update Post
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