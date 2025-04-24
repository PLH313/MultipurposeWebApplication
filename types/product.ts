export interface ProductBase {
    id: string
    title: string
    author: string
    price: number
    stock: number
    imageUrl?: string | null
    categoryId: string
}



export interface ProductList extends ProductBase {
    category: {
        id: string
        name: string
        slug: string
    }
}

// types/product.ts
export interface ProductFormType extends ProductBase {
    imageUrl?: string | null
    description: string
}

export interface ProductDetail extends ProductBase {
    description: string
    createdAt: Date
    updatedAt: Date
    category: {
        id: string
        name: string
        slug: string
    }
}
export interface CategoryType {
    id: string
    name: string
    slug: string
    createdAt: Date
    updatedAt: Date
}