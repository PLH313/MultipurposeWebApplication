// lib/blob.ts
import { put } from '@vercel/blob'

export async function uploadFile(file: File, filePath: string) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        throw new Error('BLOB_READ_WRITE_TOKEN is not configured')
    }

    return await put(filePath, file, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
        addRandomSuffix: true,
        contentType: file.type
    })
}

// For products
export async function uploadProductFile(file: File) {
    return uploadFile(file, `products/${file.name}`)
}

// For gallery
export async function uploadGalleryFile(file: File) {
    return uploadFile(file, `gallery/${file.name}`)
}