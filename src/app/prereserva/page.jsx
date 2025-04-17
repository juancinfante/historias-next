'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'

export default function Page() {
    const searchParams = useSearchParams()
    const slug = searchParams.get('s')
    const fechaIndex = parseInt(searchParams.get('f'))
    const personasURL = parseInt(searchParams.get('p') || '1')

    const [trip, setTrip] = useState(null)
    const [cantidad, setCantidad] = useState(personasURL)
    const [loading, setLoading] = useState(true)

    const handleCantidadChange = (e) => {
        const nuevaCantidad = parseInt(e.target.value)
        setCantidad(nuevaCantidad)

        const params = new URLSearchParams(searchParams.toString())
        params.set('p', nuevaCantidad.toString())

        // Usamos router.replace para actualizar la URL sin recargar
        const newUrl = `${window.location.pathname}?${params.toString()}`
        window.history.replaceState(null, '', newUrl)
    }

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const res = await fetch(`/api/trips/${slug}`)
                if (!res.ok) throw new Error('No se pudo cargar el viaje')
                const data = await res.json()
                setTrip(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchTrip()
    }, [slug])

    if (loading) return <p className="p-6 text-center">Cargando viaje...</p>
    if (!trip) return <p className="p-6 text-center">Viaje no encontrado</p>

    const fecha = trip.fechas[fechaIndex]
    const precioUnitario = trip.precio
    const subtotal = cantidad * precioUnitario

    const formatear = (f) => new Date(f).toLocaleDateString('es-AR')

    return (
        <>
            {/* Hero */}
            <header className="relative h-[250px] w-full">
                <Image
                    src="/img/hornocal.webp"
                    alt="Imagen de fondo"
                    fill
                    priority
                    className="object-cover z-0"
                />
                <div className="absolute inset-0 bg-black/50 z-10" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold">Reserva</h1>
                </div>
            </header>
            <section className="max-w-6xl mx-auto px-4 py-10">
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        {/* Mobile resumen */}
                        <div className="block md:hidden bg-white rounded-lg shadow p-4 space-y-4 mb-6">
                            <div className="flex gap-4">
                                <img src={trip.portada} className="w-20 h-20 rounded object-cover" alt={trip.destino} />
                                <div>
                                    <p className="font-semibold text-gray-800">{trip.nombre}</p>
                                    <p className="text-sm text-gray-600">Salida: {formatear(fecha.salida)}</p>
                                    <p className="text-sm text-gray-600">Regreso: {formatear(fecha.regreso)}</p>
                                </div>
                            </div>
                            <div className="text-sm text-gray-700">
                                <p><span className="font-semibold">Cantidad:</span> {cantidad}</p>
                                <p><span className="font-semibold">Precio:</span> ${precioUnitario.toLocaleString('es-AR')}</p>
                                <p><span className="font-semibold">Subtotal:</span> ${subtotal.toLocaleString('es-AR')}</p>
                            </div>
                        </div>

                        {/* Tabla desktop */}
                        <table className="w-full text-left border-separate border-spacing-y-4 min-w-[600px] hidden md:table">
                            <thead className="text-gray-600 font-semibold">
                                <tr>
                                    <th>Producto</th>
                                    <th className="text-center">Precio</th>
                                    <th className="text-center">Personas</th>
                                    <th className="text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="rounded-lg shadow bg-white">
                                <tr>
                                    <td className="flex items-center gap-4 p-4">
                                        <img src={trip.portada} className="w-20 h-20 rounded object-cover" alt={trip.destino} />
                                        <div>
                                            <p className="font-semibold text-gray-800">{trip.nombre}</p>
                                            <p className="text-sm text-gray-600">Salida: {formatear(fecha.salida)}</p>
                                            <p className="text-sm text-gray-600">Regreso: {formatear(fecha.regreso)}</p>
                                        </div>
                                    </td>
                                    <td className="text-center align-middle font-medium text-gray-800">
                                        ${precioUnitario.toLocaleString('es-AR')}
                                    </td>
                                    <td className="text-center align-middle font-medium text-gray-800">
                                        <select
                                            value={cantidad}
                                            onChange={handleCantidadChange}
                                            className="border px-2 py-1 rounded"
                                        >
                                            {[...Array(10)].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>
                                                    {i + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="text-right align-middle font-bold text-gray-800 pr-4">
                                        ${subtotal.toLocaleString('es-AR')}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Totales */}
                    <div className="bg-white rounded-lg shadow p-6 mt-6 md:mt-0">
                        <h3 className="text-xl font-bold text-gray-700 mb-4">Totales:</h3>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium text-gray-800">${subtotal.toLocaleString('es-AR')}</span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between mb-6">
                            <span className="text-gray-700 font-semibold">Total</span>
                            <span className="text-lg font-bold text-gray-800">${subtotal.toLocaleString('es-AR')}</span>
                        </div>
                        <a
                            href={`/finalizar?s=${slug}&p=${cantidad}&f=${fechaIndex}`}
                            className="w-full bg-[rgb(43,52,71)] hover:bg-teal-500 text-white font-semibold py-2 px-4 rounded-md transition"
                        >
                            Finalizar compra
                        </a>
                    </div>
                </div>
            </section>
        </>
    )
}
