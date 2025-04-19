'use client'
import { Suspense } from 'react'
import PaquetesContent from './PaquetesContent'

export default function Paquetes() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Cargando...</div>}>
      <PaquetesContent />
    </Suspense>
  )
}
