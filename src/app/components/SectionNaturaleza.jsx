'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

const translations = {
  es: {
    title: 'Conexión con la Naturaleza',
    text: `Disfruta de la belleza natural más impresionante, desde selvas tropicales
    hasta montañas majestuosas. Nuestros destinos están pensados para los amantes de la naturaleza y la aventura.`
  },
  en: {
    title: 'Connection with Nature',
    text: `Experience the most stunning natural beauty, from tropical jungles to majestic mountains.
    Our destinations are designed for nature and adventure lovers.`
  }
}

export default function SectionNaturaleza() {
  return (
    <section className="container mx-auto max-w-[1300px] py-20 px-4 lg:px-0">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Imágenes */}
        <div className="relative h-96 w-full">
          <Image
            src="https://media.istockphoto.com/id/1388968455/photo/dirt-street-of-humahuaca-jujuy-argentina.jpg?s=612x612&w=0&k=20&c=qFBwLeNbWHnr17PrImHzpep9yKp0Cbx0TF-OXDfVO3g="
            alt="Naturaleza 1"
            fill
            className="object-cover rounded-lg shadow-lg"
            style={{ zIndex: 1 }}
          />
          <Image
            src="https://res.cloudinary.com/worldpackers/image/upload/c_fill,f_auto,q_auto,w_1024/v1/guides/article_cover/m9axmbe4pdw289xmvhza?_a=BACADKGT"
            alt="Naturaleza 2"
            width={400}
            height={300}
            className="absolute top-10 left-10 w-1/2 border-4 border-white rounded-lg shadow-xl object-cover z-10"
          />
        </div>

        {/* Texto */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-gray-800">Conexión con la Naturaleza</h2>
          <p className="mt-4 text-gray-700">Disfruta de la belleza natural más impresionante, desde selvas tropicales
          hasta montañas majestuosas. Nuestros destinos están pensados para los amantes de la naturaleza y la aventura.</p>
        </div>
      </div>
    </section>
  )
}
