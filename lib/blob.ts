import { put } from '@vercel/blob'

export async function uploadFile(file: File) {
    return await put(file.name, file, {
        access: 'public',
    })
}