export default function ProjectsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Projects Overview</h1>
            <p className="mb-4">Select a project from the side menu to get started.</p>
            <div className="grid md:grid-cols-3 gap-5 mt-8">
                <div className="border p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">Todo List</h2>
                    <p>Manage your tasks with a simple todo list application.</p>
                </div>
                <div className="border p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">Blog</h2>
                    <p>Create and manage blog posts.</p>
                </div>
                <div className="border p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">Gallery</h2>
                    <p>Browse and manage your image gallery.</p>
                </div>
                {/* Book Store Project Entries */}
                <div className="border p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">Book Store</h2>
                    <p>E-commerce platform for book purchases.</p>
                </div>
                <div className="border p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">Product Management</h2>
                    <p>Interface for managing products.</p>
                </div>
            </div>
        </div>
    )
}