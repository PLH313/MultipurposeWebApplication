import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    // Create categories
    await prisma.category.createMany({
        data: [
            { name: 'Fiction', slug: 'fiction' },
            { name: 'Non-Fiction', slug: 'non-fiction' },
            { name: 'Science Fiction', slug: 'sci-fi' },
            { name: 'Biography', slug: 'biography' },
        ],
        skipDuplicates: true,
    })

    // Get created categories
    const categories = await prisma.category.findMany()

    // Create sample books
    await prisma.product.createMany({
        data: [
            {
                title: 'Đắc Nhân Tâm',
                author: 'Dale Carnegie',
                description: 'Cuốn sách nổi tiếng về nghệ thuật thu phục lòng người',
                price: 120000,
                stock: 100,
                categoryId: categories.find(c => c.slug === 'non-fiction')!.id,
            },
            {
                title: 'Dế Mèn Phiêu Lưu Ký',
                author: 'Tô Hoài',
                description: 'Tác phẩm văn học thiếu nhi kinh điển',
                price: 80000,
                stock: 50,
                categoryId: categories.find(c => c.slug === 'fiction')!.id,
            },
            {
                title: 'Harry Potter và Hòn Đá Phù Thủy',
                author: 'J.K. Rowling',
                description: 'Phần đầu tiên của series Harry Potter',
                price: 150000,
                stock: 75,
                categoryId: categories.find(c => c.slug === 'sci-fi')!.id,
            },
        ],
        skipDuplicates: true,
    })
}


main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

export {}