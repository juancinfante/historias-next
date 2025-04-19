'use client'
import { Suspense } from 'react'
import PrereservaContent from './PrereservaContent'

export default function Paquetes() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Cargando...</div>}>
      <PrereservaContent />
    </Suspense>
  )
}
