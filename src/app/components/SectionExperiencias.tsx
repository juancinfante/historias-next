'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

const translations = {
  es: {
    title: 'Experiencias Culturales Inolvidables',
    text: `Sumérgete en las culturas más fascinantes del mundo con nuestros paquetes
    diseñados para que vivas la historia, la gastronomía y las costumbres locales como un verdadero habitante.`
  },
  en: {
    title: 'Unforgettable Cultural Experiences',
    text: `Immerse yourself in the world’s most fascinating cultures with our packages
    designed to help you live the history, cuisine, and local customs like a true local.`
  }
}

export default function SectionExperiencias() {
  const [lang, setLang] = useState('es')

  useEffect(() => {
    const selector = document.getElementById('lang-select') as HTMLSelectElement | null
    if (selector) {
      const updateLang = () => setLang(selector.value)
      selector.addEventListener('change', updateLang)
      return () => selector.removeEventListener('change', updateLang)
    }
  }, [])

  const t = translations[lang]

  return (
    <section className="container mx-auto max-w-[1300px] py-20 px-4 lg:px-0 flex flex-col-reverse md:flex-row items-center">
      {/* Texto */}
      <div className="md:w-1/2 text-center md:text-left mt-10 md:mt-0 md:pr-10">
        <h2 className="text-3xl font-bold text-gray-800">{t.title}</h2>
        <p className="mt-4 text-gray-700">{t.text}</p>
      </div>

      {/* Imágenes */}
      <div className="relative w-full md:w-1/2 h-80 flex justify-center px-4 lg:px-0">
      <Image
          src="https://www.infobae.com/resizer/v2/B6VK45VAQNDQVF3QRY5PP7IX2I.png?auth=d1193c5d0d14ce5eb705cf92ee3440fa4b845603a37fdcb6ff6a6235f457996e&smart=true&width=992&height=558&quality=85"
          alt="Cultura 2"
          width={500}
          height={300}
          className="absolute left-0 bottom-0 w-2/3 rounded-lg shadow-xl object-cover"
        />
        <Image
          src="https://media-buenasvibras.s3.amazonaws.com/prod/18/viajes-grupales-para-solteros2.png"
          alt="Cultura 1"
          width={500}
          height={300}
          className="absolute right-0 top-0 w-3/5 rounded-lg shadow-lg object-cover"
        />
        
      </div>
    </section>
  )
}
