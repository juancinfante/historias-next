'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'

export default function SliderImagenes({ imagenes }) {
  const [selectedIndex, setSelectedIndex] = useState(null)
  const sliderRef = useRef(null)

  const openModal = (index) => setSelectedIndex(index)
  const closeModal = () => setSelectedIndex(null)

  const prevImageModal = (e) => {
    e.stopPropagation()
    setSelectedIndex((prev) =>
      prev === 0 ? imagenes.length - 1 : prev - 1
    )
  }

  const nextImageModal = (e) => {
    e.stopPropagation()
    setSelectedIndex((prev) =>
      prev === imagenes.length - 1 ? 0 : prev + 1
    )
  }

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  return (
    <>
  <h2 className="text-2xl font-bold text-center mt-10 mb-6">Galería de imágenes</h2>

  <div className="w-full flex items-center gap-2 overflow-hidden px-2">
    {/* Flecha izquierda */}
    <button
      onClick={scrollLeft}
      aria-label="Desplazar izquierda"
      className="text-2xl sm:text-3xl md:text-4xl p-2 rounded-full bg-gray-200 hover:bg-gray-300 shrink-0"
    >
      ‹
    </button>

    {/* Slider */}
    <div
      ref={sliderRef}
      className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar flex-1"
    >
      {imagenes.map((url, i) => (
        <div
          key={i}
          onClick={() => openModal(i)}
          className="relative h-48 sm:h-56 md:h-64 lg:h-72 min-w-[70%] sm:min-w-[300px] md:min-w-[300px] lg:min-w-[300px] rounded-xl overflow-hidden shrink-0 cursor-pointer"
        >
          <Image
            src={url}
            alt={`Imagen ${i + 1}`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 75vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>

    {/* Flecha derecha */}
    <button
      onClick={scrollRight}
      aria-label="Desplazar derecha"
      className="text-2xl sm:text-3xl md:text-4xl p-2 rounded-full bg-gray-200 hover:bg-gray-300 shrink-0"
    >
      ›
    </button>
  </div>


      {/* Modal / Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-[rgb(0,0,0)]/50 bg-opacity-90 flex items-center justify-center"
          onClick={closeModal}
        >
          <div className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center">
            {/* Flecha izquierda modal */}
            <button
              onClick={prevImageModal}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-70 p-3 rounded-full z-50"
              aria-label="Imagen anterior"
            >
              ‹
            </button>

            {/* Imagen modal */}
            <Image
              src={imagenes[selectedIndex]}
              alt={`Imagen ampliada ${selectedIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Flecha derecha modal */}
            <button
              onClick={nextImageModal}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-70 p-3 rounded-full z-50"
              aria-label="Imagen siguiente"
            >
              ›
            </button>

            {/* Botón cerrar modal */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 p-2 rounded-full z-50"
              aria-label="Cerrar modal"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  )
}
