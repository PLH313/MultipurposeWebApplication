import Link from 'next/link'

export default function ProjectsLayout({
                                           children,
                                       }: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen">
            {/* Side Menu */}
            <div className="w-64 bg-gray-100 dark:bg-gray-800 p-4">
                <h2 className="text-xl font-bold mb-6">Mini Projects</h2>
                <nav className="space-y-2">
                    <Link
                        href="/miniprojects"
                        className="block px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        Overview
                    </Link>
                    <Link
                        href="/miniprojects/todolist"
                        className="block px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        Todo List
                    </Link>
                    <Link
                        href="/miniprojects/blog"
                        className="block px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        Blog
                    </Link>
                    <Link
                        href="/miniprojects/gallery"
                        className="block px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        Gallery
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                {children}
            </div>
        </div>
    )
}