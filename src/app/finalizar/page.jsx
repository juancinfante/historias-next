// src/app/finalizar/page.tsx
'use client'
import { Suspense } from 'react'
import CompraContent from './CompraContent'

export default function FinalizarCompra() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Cargando...</div>}>
      <CompraContent />
    </Suspense>
  )
}
