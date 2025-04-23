import { notFound, redirect } from 'next/navigation'
import { getPostBySlug} from '../actions'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import Link from 'next/link'
import DeleteButton from '@/components/DeleteButton'
export default async function PostPage({ params }: { params: { slug: string } }) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        redirect('/auth/signin')
    }
    const { slug } = await params;

    const post = await getPostBySlug(slug, session.user.id)

    if (!post) {
        notFound()
    }

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg overflow-hidden">
            <Link
                href="/miniprojects/blog"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition-colors"
            >
                <span className="mr-2">←</span> Back to all posts
            </Link>

            <article>
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {post.title}
                    </h1>
                    <p className="text-indigo-500">
                        Published on {new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                    </p>
                </div>

                <div className="prose lg:prose-xl max-w-none text-gray-700">
                    {post.content.split('\n').map((paragraph, i) => (
                        <p key={i} className="mb-4 break-words">
                            {paragraph}
                        </p>
                    ))}
                </div>
            </article>

            <div className="mt-12 pt-6 border-t border-indigo-100">
                {/* <Link
                    href="/miniprojects/blog"
                    className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-600 px-6 py-3 rounded-lg inline-block hover:shadow-md transition-all"
                >
                    ← Back to all posts
                </Link> */}
                <Link
                    href={`/miniprojects/blog/${post.slug}/edit`}
                    className="inline-flex items-center justify-center min-w-[140px] bg-gradient-to-r from-green-100 to-blue-100 text-green-600 px-6 py-3 rounded-lg hover:shadow-md transition-all"                >
                    ✏️ Edit Post
                </Link>
                <DeleteButton postId={post.id} />
            </div>
        </div>
    )
}