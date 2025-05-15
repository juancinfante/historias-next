import React from 'react'

const page = () => {
    return (
        <div>
            {/* <!-- Mobile sidebar toggle --> */}
                <header className="md:hidden bg-white shadow-md flex justify-between items-center px-4 py-3">
                    <h1 className="text-lg font-bold">AdminPanel</h1>
                    <button id="menuBtn" className="text-gray-600 focus:outline-none">
                        ☰
                    </button>
                </header>
                {/* <!-- Sidebar --> */}
                <aside id="sidebar"
                    className="bg-white shadow-md fixed md:relative top-0 left-0 h-full md:h-screen w-64 transform -translate-x-full md:translate-x-0 transition-transform z-50 flex-col md:flex">
                    <div className="p-6 font-bold text-xl border-b">AdminPanel</div>
                    <nav className="flex-1 p-4 space-y-2 text-gray-700">
                        <a href="dashboard.html" className="block px-4 py-2 rounded hover:bg-gray-200">Dashboard</a>
                        <a href="ManageBlogs.html" className="block px-4 py-2 rounded hover:bg-gray-200">Manage Blogs</a>
                        <a href="AddBlog.html" className="block px-4 py-2 rounded hover:bg-gray-200">Add Blog</a>
                        <a href="ManageCategories.html" className="block px-4 py-2 rounded hover:bg-gray-200">Manage Categories</a>
                        <a href="UserManagement.html" className="block px-4 py-2 rounded hover:bg-gray-200">User Management</a>
                    </nav>
                    <div className="p-4 border-t text-sm text-gray-600">
                        &copy; 2025 AdminPanel
                    </div>
                </aside>
                {/* <!-- Overlay for mobile --> */}
                <div id="overlay" className="fixed inset-0 bg-black opacity-40 hidden z-40 md:hidden"></div>
                {/* <!-- Main Content --> */}
                <main className="hidden flex-1 flex flex-col">
                    {/* <!-- Topbar --> */}
                    <div className="hidden md:flex justify-between items-center bg-white shadow-md p-4">
                        <h1 className="text-xl font-semibold">Dashboard Overview</h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">Hola, Admin</span>
                            <img src="https://i.pravatar.cc/40?img=3" alt="avatar" className="w-10 h-10 rounded-full" />
                        </div>
                    </div>

                    {/* <!-- Content --> */}
                    <section className="p-4 sm:p-6">
                        {/* <!-- KPI Cards --> */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white p-4 rounded-xl shadow">
                                <h2 className="text-sm text-gray-500">Total Blogs</h2>
                                <p className="text-2xl font-bold">128</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow">
                                <h2 className="text-sm text-gray-500">Categorias</h2>
                                <p className="text-2xl font-bold">12</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow">
                                <h2 className="text-sm text-gray-500">Nuevos Usuarios</h2>
                                <p className="text-2xl font-bold">25</p>
                            </div>
                        </div>

                        {/* <!-- Placeholder --> */}
                        <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
                            Aquí puede ir un gráfico de actividad o estadísticas futuras.
                        </div>
                    </section>
                </main>
        </div>
    )
}

export default page