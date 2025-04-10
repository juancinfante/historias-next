'use client'
import Image from 'next/image'

export default function Hero({
  titulo="",
  subtitulo="",
  botonTexto="",
  botonHref="",
  mostrarBoton,
  imagen=""
}) {
  return (
    <header className="relative h-screen w-full">
      {/* Imagen de fondo */}
      <Image
        src={imagen}
        alt="Imagen de fondo"
        fill
        priority
        sizes="100vw"
        className="object-cover z-0"
      />

      {/* Overlay negro */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Contenido */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">{titulo}</h1>
        <p className="text-lg mt-4 max-w-2xl">{subtitulo}</p>
        {mostrarBoton && (
          <a
            href={botonHref}
            className="mt-6 bg-[rgb(43,52,71)] text-white px-6 py-2 rounded-lg shadow-md hover:bg-opacity-90 transition"
          >
            {botonTexto}
          </a>
        )}
      </div>
    </header>
  )
}
