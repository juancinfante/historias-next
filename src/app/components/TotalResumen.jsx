'use client'
import { useState } from 'react'

export default function TotalResumen({ precioUnitario, cantidadInicial }) {
  const [cantidad, setCantidad] = useState(cantidadInicial)

  const subtotal = cantidad * precioUnitario

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <label htmlFor="cantidad" className="text-sm font-medium text-gray-700">
          Cantidad de personas:
        </label>
        <select
          id="cantidad"
          name="personas"
          className="border px-2 py-1 rounded"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
        >
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-between mb-2">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-medium text-gray-800">${subtotal.toLocaleString('es-AR')}</span>
      </div>
      <hr className="my-2" />
      <div className="flex justify-between mb-6">
        <span className="text-gray-700 font-semibold">Total</span>
        <span className="text-lg font-bold text-gray-800">${subtotal.toLocaleString('es-AR')}</span>
      </div>
    </>
  )
}
