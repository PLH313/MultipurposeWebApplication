'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import prisma from '@/lib/prisma'

async function getCurrentUserId() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new Error('Not authenticated')
    return session.user.id
}

export async function createTodo(text: string, deadline: Date | null) {
    const userId = await getCurrentUserId()

    return await prisma.todo.create({
        data: {
            text,
            deadline: deadline || null,
            user: { connect: { id: userId } }
        }
    })
}

export async function getTodos() {
    const userId = await getCurrentUserId()

    return await prisma.todo.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    })
}

export async function updateTodo(
    id: string,
    data: { text?: string; deadline?: Date | null; completed?: boolean }
) {
    const userId = await getCurrentUserId()

    // Verify todo belongs to user before updating
    const todo = await prisma.todo.findFirst({
        where: { id, userId }
    })

    if (!todo) throw new Error('Todo not found or access denied')

    return await prisma.todo.update({
        where: { id },
        data
    })
}

export async function deleteTodo(id: string) {
    const userId = await getCurrentUserId()

    // Verify todo belongs to user before deleting
    const todo = await prisma.todo.findFirst({
        where: { id, userId }
    })

    if (!todo) throw new Error('Todo not found or access denied')

    return await prisma.todo.delete({
        where: { id }
    })
}