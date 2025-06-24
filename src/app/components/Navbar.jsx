'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [lang, setLang] = useState('es')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const isDark = !scrolled && !menuOpen

  return (
    <>
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${isDark ? 'bg-transparent' : 'bg-white shadow-md'}`}>
        <div className="container mx-auto max-w-[1300px] flex justify-between items-center py-3 px-4 lg:px-0">
          {/* Logo y botón mobile */}
          <div className="flex items-center space-x-4">
            <button className={`md:hidden text-2xl z-50 ${isDark ? 'text-white' : 'text-black'}`} onClick={toggleMenu}>
              ☰
            </button>
            <Link href="/">
              <Image
                id="logo"
                src={isDark ? '/historias_blanco.png' : '/historias_negro.png'}
                alt="logo"
                width={150}
                height={40}
                className="object-contain"
              />
            </Link>
          </div>

          {/* Menú desktop */}
          <ul className="hidden md:flex space-x-6 items-center">
            <li><Link href="#about" className={`${isDark ? 'text-white' : 'text-black'} hover:underline`}>Nosotros</Link></li>
            <li><Link href="/paquetes" className={`${isDark ? 'text-white' : 'text-black'} hover:underline`}>Paquetes</Link></li>
            <li><Link href="#contact" className={`${isDark ? 'text-white' : 'text-black'} hover:underline`}>Contacto</Link></li>
          </ul>

          {/* Selector e botón reservar */}
          <div className="hidden md:flex items-center space-x-4">
            <select
              className="border p-1 text-black bg-white"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
            >
              <option value="es">ES</option>
              <option value="en">EN</option>
            </select>
            <button className="bg-[rgb(43,52,71)] text-white px-4 py-2 rounded-lg shadow-md">RESERVAR</button>
          </div>

          {/* Botón cerrar menú mobile */}
          {menuOpen && (
            <button className="md:hidden text-3xl text-black z-50" onClick={closeMenu}>
              &times;
            </button>
          )}
        </div>
      </nav>

      {/* Menú Mobile */}
      <div className={`fixed top-0 left-0 h-full w-full bg-white transform transition-transform duration-300 z-40 pt-[100px] px-6 md:hidden ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <ul className="flex flex-col space-y-6 text-left">
          <li><Link href="#about" className="text-black hover:underline" onClick={closeMenu}>Nosotros</Link></li>
          <li><Link href="#packages" className="text-black hover:underline" onClick={closeMenu}>Paquetes</Link></li>
          <li><Link href="#contact" className="text-black hover:underline" onClick={closeMenu}>Contacto</Link></li>
        </ul>
      </div>
    </>
  )
}
