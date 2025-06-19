'use client'
import { useEffect, useState } from 'react'
import Slider from 'react-slick'
import Image from 'next/image'
import Link from 'next/link'

export default function CarouselPaquetes() {
  const [paquetes, setPaquetes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPaquetes = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trips`)
        if (!res.ok) throw new Error('Error al obtener paquetes')
        const data = await res.json()
        setPaquetes(data.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPaquetes()
  }, [])

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1, arrows: false } }
    ]
  }

  if (error) return <p className="p-4 text-center text-red-600">{error}</p>

  return (
    <section id="packages" className="bg-gray-100 py-20 text-center px-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-10">Nuestros Paquetes</h2>
      <div className="container mx-auto max-w-[1300px]">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[500px] bg-gray-300 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <Slider {...settings}>
            {paquetes.map((paquete, i) => (
              <div key={paquete._id || i} className="px-3">
                <div className="relative h-[500px] rounded-lg overflow-hidden text-left">
                  <Image
                    src={paquete.portada || '/img/default.webp'}
                    alt={paquete.nombre}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="flex flex-col absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold">{paquete.nombre}</h3>
                    <p className="text-sm">{paquete.dias} días - {paquete.noches} noches</p>
                    <h1 className="text-3xl font-semibold">
                      <span className="text-lg mr-1">$</span>{Number(paquete.precio).toLocaleString('es-AR')}
                    </h1>
                    <span className="text-sm">Saliendo desde {Array.isArray(paquete.origen) ? paquete.origen.join(', ') : paquete.origen}</span>
                    <Link href={`/paquete/${paquete.slug}`} className="cursor-pointer mt-2 inline-flex items-center justify-center w-fit rounded-md text-sm font-medium h-10 p-2 bg-white/10 border border-white/20 hover:bg-white/20 transition">
                      Ver Detalles
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </section>
  )
}
