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
          src="/img/hornocal.webp"
          alt="Cultura 1"
          width={500}
          height={300}
          className="absolute right-0 top-0 w-3/5 rounded-lg shadow-lg object-cover"
        />
        <Image
          src="/img/hornocal.webp"
          alt="Cultura 2"
          width={500}
          height={300}
          className="absolute left-0 bottom-0 w-2/3 rounded-lg shadow-xl object-cover"
        />
      </div>
    </section>
  )
}
