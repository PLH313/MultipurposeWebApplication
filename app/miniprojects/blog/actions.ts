'use server'

import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
export async function createPost(title: string, content: string, userId: string) {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    return await prisma.post.create({
        data: {
            title,
            content,
            slug,
            authorId: userId
        }
    })
}

export async function getPosts(userId: string) {
    return await prisma.post.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: 'desc' }
    })
}
export async function getPostBySlug(slug: string, userId: string) {
    try {
        return await prisma.post.findFirst({
            where: {
                slug: slug,
                authorId: userId
            }
        })
    } catch (error) {
        console.error('Error fetching post:', error)
        return null
    }
}

export async function updatePost(
    id: string,
    newTitle: string,
    newContent: string,
    userId: string
) {
    const existingPost = await prisma.post.findUnique({
        where: { id, authorId: userId }
    });

    if (!existingPost) {
        throw new Error('Post not found or unauthorized');
    }

    let newSlug = existingPost.slug;
    if (newTitle !== existingPost.title) {
        newSlug = generateSlug(newTitle);
        const slugExists = await prisma.post.findFirst({
            where: {
                slug: newSlug,
                authorId: userId,
                NOT: { id }
            }
        });
        if (slugExists) {
            throw new Error('A post with this title already exists');
        }
    }

    return await prisma.post.update({
        where: { id },
        data: {
            title: newTitle,
            content: newContent,
            slug: newSlug
        }
    });
}
function generateSlug(title: string) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// actions.ts
// app/miniprojects/blog/actions.ts
export async function deletePost(postId: string) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new Error('Unauthorized')

    const post = await prisma.post.findUnique({
        where: { id: postId, authorId: session.user.id }
    })

    if (!post) throw new Error('Post not found')

    await prisma.post.delete({ where: { id: postId } })
    return true
}