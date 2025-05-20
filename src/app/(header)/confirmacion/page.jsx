// src/app/finalizar/page.tsx
'use client'
import { Suspense } from 'react'
import ConfirmacionReserva from './ConfirmacionContent'

export default function FinalizarCompra() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Cargando...</div>}>
      <ConfirmacionReserva />
    </Suspense>
  )
}
