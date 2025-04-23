import Link from 'next/link'
import { getPosts } from './actions'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { redirect } from 'next/navigation'

export default async function BlogPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        redirect('/auth/signin')
    }

    const posts = await getPosts(session.user.id)
    return (
        <div>
            <div className="flex justify-end mb-8">
                <Link
                    href="/miniprojects/blog/new"
                    className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                    ✍️ Create New Post
                </Link>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map(post => (
                    <article
                        key={post.id}
                        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-indigo-400"
                    >
                        <Link href={`/miniprojects/blog/${post.slug}`}>
                            <div className="p-6">
                                <h2 className="text-xl font-bold mb-3 text-gray-800 hover:text-indigo-600 transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-sm text-indigo-500 mb-4">
                                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                                <p className="text-gray-600 line-clamp-3">
                                    {post.content}
                                </p>
                                <div className="mt-4">
                  <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                    Read More →
                  </span>
                                </div>
                            </div>
                        </Link>
                    </article>
                ))}
            </div>
        </div>
    )
}