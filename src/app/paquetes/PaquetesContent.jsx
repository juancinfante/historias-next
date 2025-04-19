'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function PaquetesContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [filtrosActivos, setFiltrosActivos] = useState([])
    const [trips, setTrips] = useState([])
    const [ordenPrecio, setOrdenPrecio] = useState('')
    const [loading, setLoading] = useState(true)

    const fetchTrips = async () => {
        setLoading(true)
        const params = new URLSearchParams()

        filtrosActivos.forEach((filtro) => {
            const lowerFiltro = filtro.toLowerCase()

            const meses = {
                'enero': '1', 'febrero': '2', 'marzo': '3', 'abril': '4', 'mayo': '5',
                'junio': '6', 'julio': '7', 'agosto': '8', 'septiembre': '9',
                'octubre': '10', 'noviembre': '11', 'diciembre': '12'
            }
            for (const [mesNombre, mesNumero] of Object.entries(meses)) {
                if (lowerFiltro === mesNombre) {
                    params.set('mes', mesNumero)
                    return
                }
            }

            if (['europa', 'brasil', 'argentina'].includes(lowerFiltro)) {
                params.set('region', filtro)
            } else if (['buenos aires', 'córdoba', 'rosario', 'santiago del estero', 'tucuman'].includes(lowerFiltro)) {
                params.set('origen', filtro)
            } else {
                params.set('destino', filtro)
            }
        })

        if (ordenPrecio === 'asc') params.set('ordenPrecio', 'asc')
        if (ordenPrecio === 'desc') params.set('ordenPrecio', 'desc')

        router.push(`/paquetes?${params.toString()}`, { scroll: false })


        try {
            const res = await fetch(`/api/trips?${params.toString()}&limit=10`)
            const data = await res.json()
            console.log(data)

            let fetchedTrips = Array.isArray(data.data) ? data.data : []

            if (ordenPrecio === 'asc') {
                fetchedTrips.sort((a, b) => a.precio - b.precio)
            } else if (ordenPrecio === 'desc') {
                fetchedTrips.sort((a, b) => b.precio - a.precio)
            }
            setTrips(fetchedTrips)
        } catch (error) {
            console.error('Error al obtener viajes', error)
            setTrips([]) // Para mostrar "no se encontraron viajes"
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        const init = []
        const region = searchParams.get('region')
        const origen = searchParams.get('origen')
        const destino = searchParams.get('destino')
        const mes = searchParams.get('mes')
        const orden = searchParams.get('ordenPrecio')

        if (region) init.push(region)
        if (origen) init.push(origen)
        if (destino) init.push(destino)

        const mesesTexto = {
            '1': 'Enero', '2': 'Febrero', '3': 'Marzo', '4': 'Abril', '5': 'Mayo',
            '6': 'Junio', '7': 'Julio', '8': 'Agosto', '9': 'Septiembre',
            '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre'
        }
        if (mes && mesesTexto[mes]) init.push(mesesTexto[mes])

        if (orden === 'asc') setOrdenPrecio('asc')
        if (orden === 'desc') setOrdenPrecio('desc')

        setFiltrosActivos(init)
    }, [])

    useEffect(() => {
        fetchTrips()
    }, [filtrosActivos, ordenPrecio])

    const handleCheckboxChange = (e) => {
        const value = e.target.value
        setFiltrosActivos((prev) =>
            e.target.checked
                ? [...prev, value]
                : prev.filter((item) => item !== value)
        )
    }

    const handleOrdenChange = (e) => {
        const value = e.target.value
        if (value === 'Precio más bajo') setOrdenPrecio('asc')
        else if (value === 'Precio más alto') setOrdenPrecio('desc')
        else setOrdenPrecio('')
    }
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

    useEffect(() => {
        const toggleMenu = (id) => {
            const menu = document.getElementById(id)
            if (!menu) return

            if (menu.classList.contains('hidden')) {
                menu.classList.remove('hidden')
                requestAnimationFrame(() => {
                    menu.classList.add('active')
                })
            } else {
                menu.classList.remove('active')
                setTimeout(() => menu.classList.add('hidden'), 300)
            }
        }

        // Solo se ejecuta en el cliente
        window.toggleMenu = toggleMenu
    }, [])
    const removeFiltro = (filtro) => {
        setFiltrosActivos((prev) => prev.filter((item) => item !== filtro))
    }
    useEffect(() => {


        const radios = document.querySelectorAll("input[name='orden']")
        radios.forEach((radio) => {
            radio.addEventListener('change', handleOrdenChange)
        })
        return () => {
            radios.forEach((radio) => {
                radio.removeEventListener('change', handleOrdenChange)
            })
        }

    }, [])

    return (
        <>
            {/* <!-- Hero Section --> */}
            <header className="relative h-96 w-full">
                {/* Imagen de fondo */}
                <Image
                    src="/img/hornocal.webp"
                    alt="Imagen de fondo"
                    fill
                    priority
                    sizes="10vh"
                    className="object-cover z-0"
                />

                {/* Overlay negro */}
                <div className="absolute inset-0 bg-black/50 z-10" />

                {/* Contenido */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold">Paquetes</h1>
                </div>
            </header>
            <main className=" text-gray-800 bg-[rgb(245,247,249)] ">
                <div className="max-w-7xl mx-auto px-4 py-6 mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <aside className="md:block md:col-span-1">
                            <div id="filtros-activos" className="mb-2">
                                {filtrosActivos.length > 0 && (
                                    <div className="flex flex-wrap gap-2 text-sm" id="chips-container">
                                        <h3 className="text-sm font-semibold mb-2 w-full">Filtros activos</h3>
                                        {filtrosActivos.map((filtro) => (
                                            <span
                                                key={filtro}
                                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                                            >
                                                {filtro}
                                                <button
                                                    onClick={() => removeFiltro(filtro)}
                                                    className="ml-2 text-blue-500 hover:text-red-600"
                                                >
                                                    &times;
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="hidden md:block bg-white p-4 shadow rounded">
                                <h2 className="text-lg font-semibold mb-4">Filtros</h2>
                                <details className="mb-4">
                                    <summary className="cursor-pointer text-sm font-semibold mb-2">Salidas</summary>
                                    <ul className="space-y-2 mt-2">
                                        {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map((mes) => (
                                            <li key={mes}>
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="mr-2"
                                                        value={mes}
                                                        checked={filtrosActivos.includes(mes)}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    {mes}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </details>

                                <details className="mb-4">
                                    <summary className="cursor-pointer text-sm font-semibold mb-2">Desde</summary>
                                    <ul className="space-y-2 mt-2">
                                        {["Buenos Aires", "Córdoba", "Rosario", "Santiago del Estero", "Tucuman"].map((item) => (
                                            <li key={item}>
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="mr-2"
                                                        value={item}
                                                        checked={filtrosActivos.includes(item)}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    {item}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </details>

                                <details>
                                    <summary className="cursor-pointer text-sm font-semibold mb-2">Región</summary>
                                    <ul className="space-y-2 mt-2">
                                        {["Argentina", "Brasil", "Europa"].map((item) => (
                                            <li key={item}>
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="mr-2"
                                                        value={item}
                                                        checked={filtrosActivos.includes(item)}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    {item}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </details>
                            </div>
                        </aside>

                        <section className="md:col-span-3 space-y-6">
                            <div className="hidden md:flex justify-between items-center">
                                <h2 className="text-xl font-bold">Paquetes disponibles</h2>
                                <div>
                                    <label htmlFor="ordenar" className="mr-2 text-sm text-gray-700">
                                        Ordenar por
                                    </label>
                                    <select
                                        id="ordenar"
                                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                                        value={ordenPrecio === 'asc' ? 'Precio más bajo' : ordenPrecio === 'desc' ? 'Precio más alto' : 'Recomendado'}
                                        onChange={handleOrdenChange}
                                    >
                                        <option>Recomendado</option>
                                        <option>Precio más bajo</option>
                                        <option>Precio más alto</option>
                                    </select>
                                </div>
                            </div>

                            <div className="max-w-7xl mx-auto px-4 py-6">
                                {loading ? (
                                    <div className="space-y-4">
                                        {[...Array(6)].map((_, idx) => (
                                            <div key={idx} className="animate-pulse flex space-x-4">
                                                <div className="rounded bg-gray-200 h-24 w-1/3"></div>
                                                <div className="flex-1 space-y-4 py-1">
                                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) :
                                    trips.length === 0 ? (
                                        <p className="text-center text-gray-500">No se encontraron viajes.</p>
                                    ) : (
                                        <div className="grid gap-6">
                                            {trips.map((trip) => (
                                                <div
                                                    key={trip._id}
                                                    className="bg-white rounded shadow flex flex-col md:flex-row overflow-hidden md:h-[230px]"
                                                >
                                                    <img
                                                        src={trip.portada}
                                                        className="w-full h-60 md:w-1/3 md:h-full object-cover"
                                                        alt={trip.destino}
                                                    />
                                                    <div className="p-4 flex flex-col justify-between flex-grow">
                                                        <div>
                                                            <h3 className="text-lg font-bold mb-1">{trip.nombre}</h3>
                                                            <p className="text-sm text-gray-600">
                                                                <strong className="text-gray-800">Destino:</strong> {trip.destino}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                <strong className="text-gray-800">Origen:</strong> {trip.origen}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                <strong className="text-gray-800">Salida:</strong> {formatearFechaLarga(trip.fechas[0].salida)}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                <strong className="text-gray-800">Regreso:</strong> {formatearFechaLarga(trip.fechas[0].regreso)}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-4">
                                                            <p className="text-lg font-bold text-blue-900">${trip.precio}</p>
                                                            <Link
                                                                href={`/paquete/${trip.slug}`}
                                                                className="bg-[rgb(43,52,71)] hover:bg-teal-600 text-white px-4 py-2 text-sm rounded transition"
                                                            >
                                                                Reservar
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                    )}
                            </div>
                        </section>
                    </div>
                </div>
                {/* Botones flotantes para móvil */}
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex gap-4 md:hidden">
                    <button
                        onClick={() => window.toggleMenu('filtro-menu')}
                        id="filtro-btn"
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow"
                    >
                        <span
                            id="filtro-count"
                            className="bg-white text-blue-600 font-bold w-5 h-5 flex items-center justify-center rounded-full text-xs"
                        >
                            {filtrosActivos.length}
                        </span>
                        <span className="material-icons"></span> Filtros
                    </button>
                    <button
                        onClick={() => window.toggleMenu('ordenar-menu')}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow"
                    >
                        <span className="material-icons"></span> Ordenar
                    </button>
                </div>

                {/* Menú Ordenar */}
                <div
                    id="ordenar-menu"
                    className="fixed bottom-0 left-0 right-0 bg-white border-t rounded-t-2xl p-4 hidden fade-slide z-50"
                >
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold text-lg">Ordenar por</span>
                        <button onClick={() => window.toggleMenu('ordenar-menu')} className="text-2xl">
                            &times;
                        </button>
                    </div>
                    <ul className="space-y-2">
                        <li>
                            <label>
                                <input type="radio" name="orden" value="Precio más bajo" className="mr-2" />
                                Precio: menor a mayor
                            </label>
                        </li>
                        <li>
                            <label>
                                <input type="radio" name="orden" value="Precio más alto" className="mr-2" />
                                Precio: mayor a menor
                            </label>
                        </li>
                        <li>
                            <label>
                                <input
                                    type="radio"
                                    name="orden"
                                    value="Recomendado"
                                    className="mr-2"
                                    defaultChecked
                                />
                                Recomendado
                            </label>
                        </li>
                    </ul>
                </div>

                {/* Menú Filtros */}
                <div
                    id="filtro-menu"
                    className="fixed bottom-0 left-0 right-0 bg-white border-t rounded-t-2xl p-4 hidden fade-slide z-50 max-h-[90vh] overflow-y-auto"
                >
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold text-lg">Filtrar por</span>
                        <button onClick={() => window.toggleMenu('filtro-menu')} className="text-2xl">
                            &times;
                        </button>
                    </div>
                    <details className="mb-4">
                        <summary className="cursor-pointer text-sm font-semibold mb-2">Salidas</summary>
                        <ul className="space-y-2 mt-2">
                            {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map((mes) => (
                                <li key={mes}>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="mr-2"
                                            value={mes}
                                            checked={filtrosActivos.includes(mes)}
                                            onChange={handleCheckboxChange}
                                        />
                                        {mes}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </details>
                    <details className="mb-4">
                        <summary className="cursor-pointer text-sm font-semibold mb-2">Desde</summary>
                        <ul className="space-y-2 mt-2">
                            {["Buenos Aires", "Córdoba", "Rosario", "Santiago del Estero", "Tucuman"].map((item) => (
                                <li key={item}>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="mr-2"
                                            value={item}
                                            checked={filtrosActivos.includes(item)}
                                            onChange={handleCheckboxChange}
                                        />
                                        {item}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </details>

                    <details>
                        <summary className="cursor-pointer text-sm font-semibold mb-2">Región</summary>
                        <ul className="space-y-2 mt-2">
                            {["Argentina", "Brasil", "Europa"].map((item) => (
                                <li key={item}>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="mr-2"
                                            value={item}
                                            checked={filtrosActivos.includes(item)}
                                            onChange={handleCheckboxChange}
                                        />
                                        {item}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </details>
                </div>

            </main>
        </>

    )
}