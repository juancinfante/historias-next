import Image from 'next/image'
import React from 'react'

export default async function Page({ params }) {
    const res = await fetch(`http://localhost:3000/api/trips/${params.slug}`, {
        cache: 'no-store'
    })

    if (!res.ok) return <div>Viaje no encontrado</div>

    const trip = await res.json()

    function formatearFechaLarga(fechaIso) {
        const fecha = new Date(fechaIso);

        const opciones = {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };

        const fechaFormateada = fecha.toLocaleDateString('es-AR', opciones);

        // Capitalizar la primera letra
        return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
    }
    return (
        <>
            {/* Hero */}
            <header className="relative h-96 w-full">
                <Image
                    src="/img/hornocal.webp"
                    alt="Imagen de fondo"
                    fill
                    priority
                    sizes="10vh"
                    className="object-cover z-0"
                />
                <div className="absolute inset-0 bg-black/50 z-10" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold">{trip.nombre}</h1>
                </div>
            </header>

            <section className="max-w-5xl mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-10 items-start">
                    {/* Main content */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Descripción del viaje</h2>
                        <p className="text-gray-700 mb-6">{trip.descripcion || 'Próximamente más info...'}</p>

                        <h3 className="text-xl font-semibold mb-2">Incluye:</h3>
                        <ul className="text-gray-700 mb-6 list-none">
                            {trip.incluye?.map((item, i) => (
                                <li key={i}>✅ {item}</li>
                            ))}
                        </ul>

                        <h3 className="text-xl font-semibold mb-2">No incluye:</h3>
                        <ul className="text-gray-700 mb-6 list-none">
                            {trip.noIncluye?.map((item, i) => (
                                <li key={i}>❌ {item}</li>
                            ))}
                        </ul>

                        <h3 className="text-xl font-semibold mb-4">Formas de pago</h3>
                        <ul className="list-none text-gray-700">
                            <li>💳 Tarjeta de crédito en hasta 6 cuotas sin interés</li>
                            <li>🏦 Transferencia bancaria</li>
                            <li>💵 Pago en efectivo en nuestras oficinas</li>
                            <li>🔵 Mercado Pago</li>
                        </ul>
                    </div>

                    {/* Sidebar */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Información clave</h3>
                        <ul className="text-gray-700 space-y-2 mb-6">
                            <li>
                                <strong>Precio desde: </strong>
                                <span className="text-2xl font-bold">
                                    ${trip.precio?.toLocaleString('es-AR') || 'Consultar'} ARS <span className='text-xs'>por persona</span>
                                </span>
                            </li>
                            <li><strong>Destino:</strong> {trip.destino}</li>
                        </ul>

                        <form action="/prereserva" method="GET" id="reservaForm">
                            <input type="hidden" name="s" value={trip.slug} />
                            <ul className="space-y-4 mb-6">
                                {trip.fechas?.map((fecha, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <input
                                            type="radio"
                                            id={`fecha-${i}`}
                                            name="f"
                                            value={i}
                                            required
                                            className="mt-1"
                                        />
                                        <label
                                            htmlFor={`fecha-${i}`}
                                            className="border border-gray-300 rounded w-full p-2 text-sm text-gray-700 cursor-pointer"
                                        >
                                            <span className="font-semibold block mb-1">
                                                {formatearFechaLarga(fecha.salida)} →{' '}
                                                {formatearFechaLarga(fecha.regreso)}
                                            </span>
                                            <span className="text-gray-800 font-semibold">
                                                ${fecha.precio?.toLocaleString('es-AR')} ARS
                                            </span>
                                        </label>
                                    </li>
                                ))}
                            </ul>

                            <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700 mb-1">
                                Cantidad de personas
                            </label>
                            <select
                                id="cantidad"
                                name="p"
                                className="mb-4 w-full border border-gray-300 px-3 py-2 rounded"
                                required
                            >
                                {[...Array(10)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1} persona{i > 0 ? 's' : ''}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="submit"
                                className="w-full bg-[rgb(43,52,71)] text-white py-2 px-4 rounded-lg shadow hover:bg-opacity-90 transition"
                            >
                                Reservar Ahora
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}
