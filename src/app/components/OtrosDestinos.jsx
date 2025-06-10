'use client'
import { Bus } from 'lucide-react'
import Image from 'next/image'

const destinos = [
  {
    title: 'Sabores de Bahía',
    description: 'Dejate llevar por los ritmos afrobrasileños...',
    image: '/img/hornocal.webp'
  },
  {
    title: 'Misterios del Valle Sagrado',
    description: 'Explorá paisajes andinos y ruinas milenarias en Perú...',
    image: '/img/hornocal.webp'
  },
  {
    title: 'Colores de Cartagena',
    description: 'Perdete en callecitas empedradas en la costa caribeña de Colombia...',
    image: '/img/hornocal.webp'
  }
]

export default function OtrosDestinos() {
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

      {/* Overlay negro con opacidad */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-[-1]" />

      {/* Contenido */}
      <div className="relative z-20 max-w-[1300px] mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Descubrí otros destinos</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {destinos.map((destino, i) => (
            <div key={i} className="bg-white text-black rounded-lg overflow-hidden cursor-pointer">
              <Image
                src={destino.image}
                alt={destino.title}
                width={600}
                height={300}
                className="w-full h-64 object-cover"
              />
              <div className="relative p-3">
                <span className='absolute -top-2 bg-[var(--primario)] font-semibold text-white p-2 pt-1 pb-1 text-xs rounded-sm'>7 Días / 8 Noches</span>
                <h3 className="text-xl font-semibold mt-3">{destino.title}</h3>
                <p className="text-gray-700 text-xs">Desde <b>Mar 12 Jun</b> Hasta <b>Mie 30 Jul</b></p>
                <p className="text-gray-700 text-xs">Desde <b>Jue 2 Jul</b> Hasta <b>Mie 26 Jul</b></p>
                <span className='flex items-center gap-1 text-gray-400 text-xs'><Bus className='w-4'/>Saliendo desde Santiago del Estero, Cordoba</span>
              </div>
              <div className='border-t-1 p-3 flex flex-col relative mt-3'>
                <span className='absolute bg-[#e6fbfb] text-xs -top-3 p-2 pt-1 pb-1'>Ahorras <del className='text-[#01423a] font-semibold'>$100.000</del></span>
                <span className='text-xs text-gray-400'>Precio final por persona</span>
                <del className='text-gray-400 text-xs'>$600.000</del>
                <h1 className='text-2xl'><span className='text-sm'>$</span>500.000</h1>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-6 text-white font-bold">
          <a href="#" className="hover:underline">Ver más</a>
        </p>
      </div>
    </section>
  )
}
