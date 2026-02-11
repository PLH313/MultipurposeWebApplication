'use server'

import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { revalidatePath } from 'next/cache'
import { put } from '@vercel/blob'
import { del } from '@vercel/blob';
import { ProductList } from '@/types/product'
import { ProductDetail } from '@/types/product'
export async function getProducts(options?: {
    category?: string
    search?: string
    page?: number
    limit?: number
    exclude?: string
}): Promise<ProductList[]> {
    const where: any = {}

    if (options?.category && options.category !== 'all') {
        where.category = { name: options.category }
    }

    if (options?.search) {
        where.OR = [
            { title: { contains: options.search, mode: 'insensitive' } },
            { author: { contains: options.search, mode: 'insensitive' } }
        ]
    }

    if (options?.exclude) {
        where.id = { not: options.exclude }
    }

    const skip = options?.page && options?.limit
        ? (options.page - 1) * options.limit
        : 0

    return prisma.product.findMany({
        where,
        select: {
            id: true,
            title: true,
            author: true,
            price: true,
            stock: true,
            imageUrl: true,
            categoryId: true,
            category: {
                select: {
                    id: true,
                    name: true,
                    slug: true
                }
            }
        },
        skip,
        take: options?.limit,
        orderBy: { createdAt: 'desc' }
    }).then(products => products.map(p => ({
        ...p,
        price: Number(p.price)
    })))
}
export async function createCategory(name: string, slug: string) {
    const session = await getServerSession(authOptions)
    if (!session?.user) throw new Error('Unauthorized')

    return await prisma.category.create({
        data: { name, slug }
    })
}

export async function getCategories() {
    return prisma.category.findMany({
        orderBy: { name: 'asc' }
    })
}

export async function createProduct(formData: FormData) {
    const session = await getServerSession(authOptions)
    if (!session?.user) throw new Error('Unauthorized')

    const price = parseInt(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string)
    const imageFile = formData.get('file') as File

    if (isNaN(price) || price < 0) throw new Error('Invalid price')
    if (isNaN(stock) || stock < 0) throw new Error('Invalid stock')

    const { url: imageUrl } = await put(`products/${imageFile.name}`, imageFile, {
        access: 'public',
        addRandomSuffix: true
    })

    await prisma.product.create({
        data: {
            title: formData.get('title') as string,
            author: formData.get('author') as string,
            description: formData.get('description') as string,
            price: price,
            stock: stock,
            categoryId: formData.get('categoryId') as string,
            imageUrl: imageUrl
        }
    })

    revalidatePath('/miniprojects/productmanagement')
}

export async function deleteProduct(id: string) {
    const session = await getServerSession(authOptions)
    if (!session?.user) throw new Error('Unauthorized')

    const product = await prisma.product.findUnique({
        where: { id },
        select: { imageUrl: true } 
    })

    if (!product) {
        throw new Error('Product not found')
    }

    if (product.imageUrl) { 
        try {
            await del(product.imageUrl);
        } catch (error) {
            console.error("Warning: Không thể xóa ảnh", error);
        }
    }

    await prisma.product.delete({ where: { id } })
    
    revalidatePath('/miniprojects/productmanagement')
}

// In actions.ts
export async function getProductById(id: string): Promise<ProductDetail | null> {
    const product = await prisma.product.findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            author: true,
            description: true,
            price: true,
            stock: true,
            imageUrl: true,
            categoryId: true,
            createdAt: true,
            updatedAt: true,
            category: {
                select: {
                    id: true,
                    name: true,
                    slug: true
                }
            }
        }
    })

    return product ? {
        ...product,
        price: Number(product.price)
    } : null
}
export async function updateProduct(id: string, formData: FormData) {
    const session = await getServerSession(authOptions)
    if (!session?.user) throw new Error('Unauthorized')

    const currentProduct = await prisma.product.findUnique({
        where: { id },
        select: { imageUrl: true } 
    });

    if (!currentProduct) throw new Error('Product not found');

    const price = parseInt(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string)
    const imageFile = formData.get('file') as File | null 
    
    let newImageUrl = formData.get('imageUrl') as string | undefined

    if (isNaN(price) || price < 0) throw new Error('Invalid price')
    if (isNaN(stock) || stock < 0) throw new Error('Invalid stock')

    if (imageFile && imageFile.size > 0) {
        const { url } = await put(`products/${imageFile.name}`, imageFile, {
            access: 'public',
            addRandomSuffix: true
        })
        newImageUrl = url;

        if (currentProduct.imageUrl) {
            try {
                await del(currentProduct.imageUrl);
            } catch (error) {
                console.error("Lỗi xóa ảnh cũ trên Blob:", error);
            }
        }
    } 
    else if (currentProduct.imageUrl && !newImageUrl) {
         try {
            await del(currentProduct.imageUrl);
         } catch (error) {
             console.error("Lỗi xóa ảnh cũ:", error);
         }
    }

    await prisma.product.update({
        where: { id },
        data: {
            title: formData.get('title') as string,
            author: formData.get('author') as string,
            description: formData.get('description') as string,
            price: price,
            stock: stock,
            categoryId: formData.get('categoryId') as string,
            imageUrl: newImageUrl || null 
        }
    })
    
    revalidatePath('/miniprojects/productmanagement')
}
export async function getTotalProductsCount(options?: {
    category?: string
    search?: string
}): Promise<number> {
    const where: any = {}

    if (options?.category && options.category !== 'all') {
        where.category = { name: options.category }
    }

    if (options?.search) {
        where.OR = [
            { title: { contains: options.search, mode: 'insensitive' } },
            { author: { contains: options.search, mode: 'insensitive' } }
        ]
    }

    return prisma.product.count({ where })
}
