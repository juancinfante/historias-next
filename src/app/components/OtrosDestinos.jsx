'use client'
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
            <div key={i} className="bg-white text-black rounded-lg overflow-hidden">
              <Image
                src={destino.image}
                alt={destino.title}
                width={600}
                height={300}
                className="w-full h-64 object-cover"
              />
              <div className="pt-3 px-4 pb-6">
                <h3 className="text-xl font-semibold">{destino.title}</h3>
                <p className="text-gray-700 mt-2">{destino.description}</p>
                <a href="#" className="block mt-4 text-[rgb(43,52,71)] font-bold hover:underline">
                  VER MÁS
                </a>
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
