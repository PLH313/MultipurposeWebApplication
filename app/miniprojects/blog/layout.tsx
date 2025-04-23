export default function BlogLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 ">
            <header className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-6 shadow-lg">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold">My Blog</h1>
                    <p className="text-indigo-100 mt-2"></p>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
            {/* <footer className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 mt-50">
                <div className="container mx-auto px-4 text-center">
                    © {new Date().getFullYear()} Blog
                </div>
            </footer> */}
        </div>
    )
}