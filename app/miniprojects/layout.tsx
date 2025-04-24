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
                <Link
                    href="/miniprojects"
                    className="block px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                    Overview
                </Link>
                <h2 className="text-lg font-semibold mt-2 mb-2 px-4">Mini Projects</h2>
                <nav className="space-y-2">

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

                    {/* Book Store Project Section */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2 px-4">E-Commerce Page</h3>
                        <div className="space-y-2">
                            <Link
                                href="/miniprojects/estore"
                                className="block px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                Book Store
                            </Link>
                            <Link
                                href="/miniprojects/productmanagement"
                                className="block px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                Product Management
                            </Link>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                {children}
            </div>
        </div>
    )
}