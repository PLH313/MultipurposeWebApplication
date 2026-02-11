// app/miniprojects/gallery/actions.ts
'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import prisma from '@/lib/prisma'
import { put } from '@vercel/blob'
import { del } from '@vercel/blob';
import { revalidatePath } from 'next/cache'

export async function uploadImage(formData: FormData) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new Error('Unauthorized')

    const file = formData.get('file') as File
    const caption = formData.get('caption') as string

    const uniqueFilename = `users/${session.user.id}/${file.name}`

    const blob = await put(uniqueFilename, file, {
        access: 'public',
        addRandomSuffix: true,
        contentType: file.type
    })

    await prisma.image.create({
        data: {
            url: blob.url,
            caption,
            userId: session.user.id
        }
    })

    revalidatePath('/miniprojects/gallery')
}
export async function getImages(userId: string) {
    return await prisma.image.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    })
}

export async function deleteImage(imageId: string) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new Error('Unauthorized')

    const image = await prisma.image.findUnique({
        where: {
            id: imageId,
            userId: session.user.id
        }
    })

    if (!image) {
        throw new Error('Image not found or unauthorized')
    }

    if (image.url) {
        await del(image.url);
    }

    await prisma.image.delete({
        where: {
            id: imageId
        }
    })

    revalidatePath('/miniprojects/gallery')
}

export async function getImageById(id: string) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new Error('Unauthorized')

    return await prisma.image.findUnique({
        where: {
            id,
            userId: session.user.id
        }
    })
}

export async function updateImage(
    id: string,
    data: {
        caption: string
        file?: File
        userId: string
    }
) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new Error('Unauthorized')

    const updateData: any = { caption: data.caption }

    if (data.file) {
        const uniqueFilename = `users/${session.user.id}/${data.file.name}`
        const blob = await put(uniqueFilename, data.file, {
            access: 'public',
            addRandomSuffix: true,
            contentType: data.file.type
        })
        updateData.url = blob.url
    }

    return await prisma.image.update({
        where: { id, userId: data.userId },
        data: updateData
    })
}
