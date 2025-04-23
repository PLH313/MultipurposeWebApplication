'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { createTodo, getTodos, updateTodo, deleteTodo } from './actions'

interface Todo {
    id: string
    text: string
    deadline: Date | null
    completed: boolean
}

export default function TodoList() {
    const { data: session } = useSession()
    const [todos, setTodos] = useState<Todo[]>([])
    const [newTodo, setNewTodo] = useState('')
    const [deadline, setDeadline] = useState('')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editText, setEditText] = useState('')
    const [editDeadline, setEditDeadline] = useState('')
    const [error, setError] = useState('')

    // Gradient colors for cards
    const cardGradients = [
        'from-purple-400 via-pink-400 to-red-400',
        'from-blue-400 via-cyan-400 to-green-400',
        'from-yellow-400 via-amber-400 to-orange-400',
        'from-emerald-400 via-teal-400 to-cyan-400',
        'from-violet-400 via-purple-400 to-fuchsia-400'
    ]

    useEffect(() => {
        loadTodos()
    }, [])

    const loadTodos = async () => {
        try {
            const todos = await getTodos()
            setTodos(todos)
        } catch (err) {
            console.error("Failed to load todos:", err)
        }
    }

    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTodo.trim()) return

        try {
            await createTodo(
                newTodo,
                deadline ? new Date(deadline) : null
            )
            setNewTodo('')
            setDeadline('')
            await loadTodos()
        } catch (err) {
            console.error("Failed to add todo:", err)
        }
    }

    const startEditing = (todo: Todo) => {
        setEditingId(todo.id)
        setEditText(todo.text)
        setEditDeadline(todo.deadline ? todo.deadline.toISOString().split('T')[0] : '')
    }

    const handleUpdateTodo = async () => {
        if (!editText.trim()) {
            setError('Todo text cannot be empty')
            return
        }
        if (!editingId) return

        try {
            await updateTodo(editingId, {
                text: editText,
                deadline: editDeadline ? new Date(editDeadline) : null
            })
            setEditingId(null)
            setError('')
            await loadTodos()
        } catch (err) {
            console.error("Failed to update todo:", err)
        }
    }

    const handleToggleComplete = async (id: string, completed: boolean) => {
        try {
            await updateTodo(id, { completed })
            await loadTodos()
        } catch (err) {
            console.error("Failed to toggle todo:", err)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteTodo(id)
            await loadTodos()
        } catch (err) {
            console.error("Failed to delete todo:", err)
        }
    }

    const cancelEditing = () => {
        setEditingId(null)
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h2>
                    <p className="text-gray-600 mb-6">Sign in to access your personal todo list</p>
                    <a
                        href="/auth/signin"
                        className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all"
                    >
                        Sign In
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                        Todo List
                    </h1>
                </div>

                {/* Add Todo Form */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-10">
                    <form onSubmit={handleAddTodo} className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={newTodo}
                                    onChange={(e) => setNewTodo(e.target.value)}
                                    placeholder="What needs to be done?"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                                    required
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <input
                                    type="date"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                                />
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all whitespace-nowrap"
                                >
                                    Add Task
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Todo List */}
                <div className="space-y-4">
                    {todos.map((todo, index) => (
                        <div
                            key={todo.id}
                            className={`bg-gradient-to-r ${cardGradients[index % cardGradients.length]} rounded-xl shadow-lg overflow-hidden`}
                        >
                            {editingId === todo.id ? (
                                <div className="p-6 space-y-4 bg-white bg-opacity-90">
                                    <input
                                        type="text"
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                                    />
                                    {error && <p className="text-red-500 text-sm">{error}</p>}
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <input
                                            type="date"
                                            value={editDeadline}
                                            onChange={(e) => setEditDeadline(e.target.value)}
                                            className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                                        />
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleUpdateTodo}
                                                className="flex-1 bg-green-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-600 transition"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={cancelEditing}
                                                className="flex-1 bg-gray-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-600 transition"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <button
                                        onClick={() => handleToggleComplete(todo.id, !todo.completed)}
                                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 ${todo.completed ? 'border-green-500 bg-green-500' : 'border-gray-300'} flex items-center justify-center transition`}
                                    >
                                        {todo.completed && (
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </button>

                                    <div className="flex-1">
                                        <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-neutral-600' : 'text-black'}`}>
                                            {todo.text}
                                        </h3>
                                        {todo.deadline && (
                                            <div className="flex items-center mt-1">
                                                <svg className="w-4 h-4 text-white opacity-80 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-sm text-black">
                          {new Date(todo.deadline).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                          })}
                        </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => startEditing(todo)}
                                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                                        >
                                            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(todo.id)}
                                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                                        >
                                            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Stats Footer */}
                <div className="mt-10 text-center text-gray-500">
                    <p>
                        {todos.filter(t => t.completed).length} of {todos.length} tasks completed
                        ({todos.length > 0 ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100) : 0}%)
                    </p>
                </div>
            </div>
        </div>
    )
}