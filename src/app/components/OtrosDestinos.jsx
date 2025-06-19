'use client'
import { useEffect, useState } from 'react'
import { Bus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function OtrosDestinos() {
  const [destinos, setDestinos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDestinos = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trips`)
        if (!res.ok) throw new Error('Error al obtener destinos')
        const data = await res.json()
        setDestinos(data.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchDestinos()
  }, [])

  return (
    <section className="relative py-20 px-6 text-white min-h-[600px]">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-[-1]">
        <Image
          src="/img/hornocal.webp"
          alt="Fondo otros destinos"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Overlay negro */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-[-1]" />

      {/* Contenido */}
      <div className="relative z-20 max-w-[1300px] mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Descubrí otros destinos</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-300 animate-pulse h-[400px] rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {destinos.slice(0, 3).map((destino) => (
        <Link href={`/paquete/${destino.slug}`} key={destino._id}>
              <div className="bg-white text-black rounded-lg overflow-hidden cursor-pointer">
                <Image
                  src={destino.portada || '/img/default.webp'}
                  alt={destino.nombre}
                  width={600}
                  height={300}
                  className="w-full h-64 object-cover"
                />
                <div className="relative p-3">
                  <span className="absolute -top-2 bg-[var(--primario)] font-semibold text-white p-2 pt-1 pb-1 text-xs rounded-sm">
                    {destino.dias} Días / {destino.noches} Noches
                  </span>
                  <h3 className="text-xl font-semibold mt-3">{destino.nombre}</h3>

                  {Array.isArray(destino.fechas) && destino.fechas.length > 0 && (
                    <>
                      {destino.fechas.slice(0, 2).map((f, idx) => (
                        <p key={idx} className="text-gray-700 text-xs">
                          Desde <b>{formatFecha(f.salida)}</b> Hasta <b>{formatFecha(f.regreso)}</b>
                        </p>
                      ))}
                    </>
                  )}

                  <span className="flex items-center gap-1 text-gray-400 text-xs">
                    <Bus className="w-4" />
                    Saliendo desde {Array.isArray(destino.origen) ? destino.origen.join(', ') : destino.origen}
                  </span>
                </div>

                <div className="border-t-1 p-3 flex flex-col relative mt-3">
                  <span className="absolute bg-[#e6fbfb] text-xs -top-3 p-2 pt-1 pb-1">
                    Ahorras <del className="text-[#01423a] font-semibold">$100.000</del>
                  </span>
                  <span className="text-xs text-gray-400">Precio final por persona</span>
                  <del className="text-gray-400 text-xs">$600.000</del>
                  <h1 className="text-2xl">
                    <span className="text-sm">$</span>{Number(destino.precio).toLocaleString('es-AR')}
                  </h1>
                </div>
              </div>
        </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function formatFecha(fechaIso) {
  if (!fechaIso) return ''
  const fecha = new Date(fechaIso)
  return fecha.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short'
  })
}
