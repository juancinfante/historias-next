import React from 'react'
import Link from 'next/link'
import { Bus, MapPinned, Siren } from 'lucide-react'

const PaqueteCard = ({ trip }) => {

    function formatFecha(fechaIso) {
        if (!fechaIso) return ''

        const [year, month, day] = fechaIso.split('-').map(Number)
        const fecha = new Date(year, month - 1, day) // mes base 0

        const dia = fecha.toLocaleDateString('es-AR', { day: '2-digit' })
        const mes = fecha.toLocaleDateString('es-AR', { month: 'long' })

        return `${dia} - ${capitalize(mes)}`
    }

    function capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1)
    }

    return (
        <div
            key={trip._id}
            className="bg-white rounded shadow flex flex-col md:flex-row overflow-hidden md:h-[230px]"
        >
            <img
                src={trip.portada}
                className="w-full h-60 md:w-1/3 md:h-full object-cover"
                alt={trip.destino}
            />
            <div className="flex flex-col h-full p-3 gap-1">
                <h1 className='font-bold text-2xl text-gray-700'>{trip.nombre}</h1>
                <div className='flex gap-1'>
                    <span className="inline-flex items-center text-xs rounded-md ps-2 pe-2 bg-[var(--primario-light)] font-semibold text-[var(--primario-dark)] w-fit">
                        <MapPinned className="w-[14px] mr-1" />
                        {trip.destino}
                    </span>
                    {/* <span className="inline-flex items-center text-xs rounded-md ps-2 pe-2 bg-red-200 text-red-950 font-semibold w-fit">
                                                                    <Siren className="w-[14px] mr-1" />
                                                                    Quedan 6 lugares
                                                                </span> */}
                </div>
                <span className='inline-flex items-center text-gray-500 text-sm pe-2 w-fit'>
                    <Bus className='w-4 mr-1' />
                    Saliendo desde {Array.isArray(trip.origen) ? trip.origen.join(', ') : trip.origen}</span>
                <h1 className='font-semibold'>{trip.noches} NOCHES - {trip.dias} DÍAS</h1>
                {Array.isArray(trip.fechas) && trip.fechas.length > 0 && (
                    <>
                        {trip.fechas.slice(0, 2).map((f, idx) => (
                            <p key={idx} className="text-gray-700 text-xs">
                                Salida <b>{formatFecha(f.salida)}</b> Regreso <b>{formatFecha(f.regreso)}</b>
                            </p>
                        ))}
                    </>
                )}
            </div>
            {/* <h1 className='bg-red-200 text-red-950 font-semibold w-fit ml-auto p-1'>Ultimos lugares!</h1> */}
            <div className="flex flex-col border-l-1 text-gray-700 md:ml-auto p-3 relative">
                <h1 className='hidden md:block bg-green-200 text-green-950 w-fit ml-auto pt-1 pb-1 p-2 text-sm rounded-bl-md absolute top-0 right-0'>
                    {trip.pasajerosReservados}/{trip.lugares} lugares reservados
                </h1>
                <span className='text-xs text-gray-500 md:mt-[40px]'>Precio final por persona</span>
                <div className="flex font-bold items-center gap-0.5 text-gray-700"><span className='text-md '>$</span><span className='text-3xl'>{Number(trip.precio).toLocaleString('es-AR')}</span></div>
                <span className='text-xs'>Incluye impuestos, tasas y cargos</span>
                <Link href={`/paquete/${trip.slug}`} className='bg-[var(--secundario)] text-white p-2 rounded-2xl mt-2 cursor-pointer text-center'>
                    Siguiente
                </Link>
            </div>
            {/* <button className='bg-gray-200 text-gray-500 p-2 rounded-2xl mt-2'>Completo</button> */}
        </div>
    )
}

export default PaqueteCard