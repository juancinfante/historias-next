'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function PaquetesPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [filtrosActivos, setFiltrosActivos] = useState([])
    const [trips, setTrips] = useState([])
    const [ordenPrecio, setOrdenPrecio] = useState('')

    const fetchTrips = async () => {
        const params = new URLSearchParams()

        filtrosActivos.forEach((filtro) => {
            if (filtro.toLowerCase().includes('2025')) {
                if (filtro.toLowerCase().includes('abril')) params.set('mes', '4')
                if (filtro.toLowerCase().includes('mayo')) params.set('mes', '5')
                if (filtro.toLowerCase().includes('junio')) params.set('mes', '6')
            } else if (['ushuaia', 'mendoza', 'iguazú', 'europa'].some((d) => filtro.toLowerCase().includes(d))) {
                params.set('destino', filtro)
            } else if (['buenos aires', 'córdoba', 'rosario'].some((o) => filtro.toLowerCase().includes(o))) {
                params.set('origen', filtro)
            }
        })

        if (ordenPrecio === 'asc') params.set('ordenPrecio', 'asc')
        if (ordenPrecio === 'desc') params.set('ordenPrecio', 'desc')

        router.push(`/paquetes?${params.toString()}`)

        try {
            const res = await fetch(`/api/trips?${params.toString()}`)
            const data = await res.json()
            setTrips(data.data || [])
        } catch (error) {
            console.error('Error al obtener viajes', error)
        }
    }

    useEffect(() => {
        const init = []
        const destino = searchParams.get('destino')
        const origen = searchParams.get('origen')
        const mes = searchParams.get('mes')
        const orden = searchParams.get('ordenPrecio')

        if (destino) init.push(destino)
        if (origen) init.push(origen)
        if (mes === '4') init.push('Abril 2025')
        if (mes === '5') init.push('Mayo 2025')
        if (mes === '6') init.push('Junio 2025')
        if (orden === 'asc') setOrdenPrecio('asc')
        if (orden === 'desc') setOrdenPrecio('desc')

        setFiltrosActivos(init)
    }, [])

    useEffect(() => {
        fetchTrips()
    }, [filtrosActivos, ordenPrecio])

    const handleCheckboxChange = (e) => {
        const label = e.target.parentElement?.textContent?.trim()
        if (!label) return
        setFiltrosActivos((prev) =>
            e.target.checked ? [...prev, label] : prev.filter((item) => item !== label)
        )
    }

    const handleOrdenChange = (e) => {
        const value = e.target.value
        if (value === 'Precio más bajo') setOrdenPrecio('asc')
        else if (value === 'Precio más alto') setOrdenPrecio('desc')
        else setOrdenPrecio('')
    }
    // Toggle para los menús móviles
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

    window.toggleMenu = toggleMenu
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
        <main className="bg-gray-50 text-gray-800">
            <header
                className="relative h-[70vh] bg-cover bg-center flex items-center justify-center text-white"
                style={{ backgroundImage: "url('')" }}
            >
                <div className="bg-black bg-opacity-60 absolute inset-0" />
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-bold">Paquetes</h1>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <aside className="hidden md:block md:col-span-1">
                        <div id="filtros-activos" className="mb-4">
                            <h3 className="text-sm font-semibold mb-2">Filtros activos</h3>
                            <div className="flex flex-wrap gap-2 text-sm" id="chips-container">
                                {filtrosActivos.map((filtro) => (
                                    <span
                                        key={filtro}
                                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                                    >
                                        {filtro}
                                        <button onClick={() => removeFiltro(filtro)} className="text-blue-500 hover:text-red-600">
                                            &times;
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white p-4 shadow rounded">
                            <h2 className="text-lg font-semibold mb-4">Filtros</h2>

                            <div className="mb-4">
                                <h3 className="text-sm font-semibold mb-2">Destino</h3>
                                <ul className="space-y-2">
                                    <li><label><input type="checkbox" className="mr-2" onChange={handleCheckboxChange} />Europa</label></li>
                                    <li><label><input type="checkbox" className="mr-2" onChange={handleCheckboxChange} />Mendoza</label></li>
                                    <li><label><input type="checkbox" className="mr-2" onChange={handleCheckboxChange} />Iguazú</label></li>
                                </ul>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-sm font-semibold mb-2">Salidas</h3>
                                <ul className="space-y-2">
                                    <li><label><input type="checkbox" className="mr-2" onChange={handleCheckboxChange} />Abril 2025</label></li>
                                    <li><label><input type="checkbox" className="mr-2" onChange={handleCheckboxChange} />Mayo 2025</label></li>
                                    <li><label><input type="checkbox" className="mr-2" onChange={handleCheckboxChange} />Junio 2025</label></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold mb-2">Origen</h3>
                                <ul className="space-y-2">
                                    <li><label><input type="checkbox" className="mr-2" onChange={handleCheckboxChange} />Buenos Aires</label></li>
                                    <li><label><input type="checkbox" className="mr-2" onChange={handleCheckboxChange} />Córdoba</label></li>
                                    <li><label><input type="checkbox" className="mr-2" onChange={handleCheckboxChange} />Rosario</label></li>
                                </ul>
                            </div>
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
                                >
                                    <option>Recomendado</option>
                                    <option>Precio más bajo</option>
                                    <option>Precio más alto</option>
                                </select>
                            </div>
                        </div>

                        <div className="max-w-7xl mx-auto px-4 py-6">
                            {trips.length === 0 ? (
                                <p className="text-center text-gray-500">No se encontraron viajes.</p>
                            ) : (
                                <div className="grid gap-6">
                                    {trips.map((trip) => (
                                        <div
                                            key={trip._id}
                                            className="bg-white rounded shadow flex flex-col md:flex-row overflow-hidden"
                                        >
                                            <img
                                                src={trip.portada}
                                                className="w-full md:w-1/3 object-cover"
                                                alt={trip.destino}
                                            />
                                            <div className="p-4 flex flex-col justify-between flex-grow">
                                                <div>
                                                    <h3 className="text-lg font-bold mb-1">{trip.titulo}</h3>
                                                    <p className="text-sm text-gray-600">Destino: {trip.destino}</p>
                                                    <p className="text-sm text-gray-600">Origen: {trip.origen}</p>
                                                    <p className="text-sm text-gray-600">
                                                        Fechas:{' '}
                                                        {trip.fechas?.map((f) => new Date(f.salida)).join(', ')}
                                                    </p>
                                                    <p className="text-sm text-gray-600">{trip.descripcion}</p>
                                                </div>
                                                <div className="flex items-center justify-between mt-4">
                                                    <p className="text-lg font-bold text-blue-800">
                                                        ${trip.precio}
                                                    </p>
                                                    <button className="bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700">
                                                        Comprar
                                                    </button>
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
                    <span className="material-icons">filter_list</span> Filtros
                </button>
                <button
                    onClick={() => window.toggleMenu('ordenar-menu')}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow"
                >
                    <span className="material-icons">sort</span> Ordenar
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
                <div className="mb-4">
                    <h2 className="text-md font-semibold mb-2">Salidas disponibles</h2>
                    <ul className="space-y-2">
                        <li>
                            <label>
                                <input type="checkbox" id="salida-abril2025" className="mr-2" onChange={handleCheckboxChange} />
                                Abril 2025
                            </label>
                        </li>
                        <li>
                            <label>
                                <input type="checkbox" id="salida-mayo2025" className="mr-2" onChange={handleCheckboxChange} />
                                Mayo 2025
                            </label>
                        </li>
                        <li>
                            <label>
                                <input type="checkbox" id="salida-junio2025" className="mr-2" onChange={handleCheckboxChange} />
                                Junio 2025
                            </label>
                        </li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-md font-semibold mb-2">Origen</h2>
                    <ul className="space-y-2">
                        <li>
                            <label>
                                <input type="checkbox" id="origen-bsas" className="mr-2" onChange={handleCheckboxChange} />
                                Buenos Aires
                            </label>
                        </li>
                        <li>
                            <label>
                                <input type="checkbox" id="origen-cordoba" className="mr-2" onChange={handleCheckboxChange} />
                                Córdoba
                            </label>
                        </li>
                        <li>
                            <label>
                                <input type="checkbox" id="origen-rosario" className="mr-2" onChange={handleCheckboxChange} />
                                Rosario
                            </label>
                        </li>
                    </ul>
                </div>
            </div>

        </main>
    )
}