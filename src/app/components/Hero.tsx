'use client'
import Image from 'next/image'

export default function Hero() {
  return (
    <header className="relative h-screen w-full">
      {/* Imagen de fondo */}
      <Image
        src="/img/hornocal.webp" // asegurate que esté en /public/img/
        alt="Hornocal"
        fill
        priority
        sizes="100vw"
        className="object-cover z-0"
      />

      {/* Overlay negro */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Contenido */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Descubre el norte Argentino</h1>
        <p className="text-lg mt-4 max-w-2xl">
          Creamos experiencias únicas y memorables para que disfrutes de los destinos más increíbles del planeta.
        </p>
        <button className="mt-6 bg-[rgb(43,52,71)] text-white px-6 py-2 rounded-lg shadow-md hover:bg-opacity-90 transition">
          Explorar Destinos
        </button>
      </div>
    </header>
  )
}
