'use client'

import { useRouter } from 'next/navigation'
import { startTransition } from 'react'
import { deletePost } from '@/app/miniprojects/blog/actions'

export default function DeleteButton({ postId }: { postId: string }) {
    const router = useRouter()

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return

        try {
            await deletePost(postId)
            startTransition(() => {
                router.push('/miniprojects/blog')
                router.refresh()
            })
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to delete post')
        }
    }

    return (
        <button
            onClick={handleDelete}
            className="ml-4 inline-flex items-center justify-center min-w-[140px] bg-gradient-to-r from-red-100 to-pink-100 text-red-600 px-6 py-3 rounded-lg hover:shadow-md transition-all"        >
            🗑️ Delete Post
        </button>
    )
}