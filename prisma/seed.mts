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
            { name: 'Self-Help', slug: 'self-help' },
            { name: 'History', slug: 'history' },
            { name: 'Fantasy', slug: 'fantasy' },
            { name: 'Mystery', slug: 'mystery' },
        ],
        skipDuplicates: true,
    })

    const categories = await prisma.category.findMany()

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
            {
                title: '7 Thói Quen Hiệu Quả',
                author: 'Stephen R. Covey',
                description: 'Hướng dẫn thực hành để nâng cao hiệu suất cá nhân',
                price: 135000,
                stock: 60,
                categoryId: categories.find(c => c.slug === 'self-help')!.id,
            },
            {
                title: 'Sapiens: Lược Sử Loài Người',
                author: 'Yuval Noah Harari',
                description: 'Khám phá hành trình tiến hóa của loài người',
                price: 170000,
                stock: 45,
                categoryId: categories.find(c => c.slug === 'history')!.id,
            },
            {
                title: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh',
                author: 'Nguyễn Nhật Ánh',
                description: 'Một câu chuyện tuổi thơ đậm chất Việt',
                price: 95000,
                stock: 80,
                categoryId: categories.find(c => c.slug === 'fiction')!.id,
            },
            {
                title: 'Game of Thrones',
                author: 'George R. R. Martin',
                description: 'Tập đầu tiên của loạt truyện fantasy hoành tráng',
                price: 180000,
                stock: 30,
                categoryId: categories.find(c => c.slug === 'fantasy')!.id,
            },
            {
                title: 'Sherlock Holmes: Tập Truyện Ngắn',
                author: 'Arthur Conan Doyle',
                description: 'Tuyển tập các vụ án phá án ly kỳ',
                price: 110000,
                stock: 70,
                categoryId: categories.find(c => c.slug === 'mystery')!.id,
            },
            {
                title: 'Steve Jobs',
                author: 'Walter Isaacson',
                description: 'Tiểu sử chính thức về nhà sáng lập Apple',
                price: 160000,
                stock: 40,
                categoryId: categories.find(c => c.slug === 'biography')!.id,
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
