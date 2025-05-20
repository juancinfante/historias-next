export default function Loading() {
    return (
        <>
            {/* Hero */}
            <header className="relative h-96 w-full animate-pulse">
                <div className="absolute inset-0 bg-gray-300 z-0" />
                <div className="absolute inset-0 bg-black/50 z-10" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 px-4 text-center">
                    <div className="h-10 bg-gray-400 rounded w-3/4 md:w-1/2" />
                </div>
            </header>

            {/* Main content */}
            <section className="max-w-5xl w-full mx-auto px-4 py-16 animate-pulse">
                <div className="grid md:grid-cols-2 gap-10 items-start">
                    {/* Descripción lado izquierdo */}
                    <div className="space-y-6">
                        <div className="h-6 bg-gray-300 rounded w-2/3" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-5/6" />
                        <div className="h-6 bg-gray-300 rounded w-1/3" />
                        <ul className="space-y-2">
                            {[...Array(3)].map((_, i) => (
                                <li key={i} className="h-4 bg-gray-200 rounded w-2/3" />
                            ))}
                        </ul>
                        <div className="h-6 bg-gray-300 rounded w-1/3" />
                        <ul className="space-y-2">
                            {[...Array(2)].map((_, i) => (
                                <li key={i} className="h-4 bg-gray-200 rounded w-2/3" />
                            ))}
                        </ul>
                        <div className="h-6 bg-gray-300 rounded w-1/3" />
                        <ul className="space-y-2">
                            {[...Array(4)].map((_, i) => (
                                <li key={i} className="h-4 bg-gray-200 rounded w-3/4" />
                            ))}
                        </ul>
                    </div>

                    {/* Sidebar lado derecho */}
                    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        <div className="h-6 bg-gray-300 rounded w-1/2" />
                        <div className="h-8 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />

                        {/* Fechas */}
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="border border-gray-200 rounded p-4 space-y-2">
                                <div className="h-4 bg-gray-300 rounded w-3/4" />
                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                            </div>
                        ))}

                        <div className="h-4 bg-gray-300 rounded w-1/3" />
                        <div className="h-10 bg-gray-200 rounded" />

                        <div className="h-10 bg-gray-400 rounded w-full" />
                    </div>
                </div>
            </section>
        </>
    )
}
