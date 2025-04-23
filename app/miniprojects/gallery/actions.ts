// app/miniprojects/gallery/actions.ts
'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { put } from '@vercel/blob'
import { revalidatePath } from 'next/cache'

export async function uploadImage(formData: FormData) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new Error('Unauthorized')

    const file = formData.get('file') as File
    const caption = formData.get('caption') as string

    // Upload to Vercel Blob Storage (or your preferred storage)
    const blob = await put(file.name, file, {
        access: 'public',
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

    await prisma.image.delete({
        where: {
            id: imageId,
            userId: session.user.id
        }
    })
    revalidatePath('/miniprojects/gallery')
}