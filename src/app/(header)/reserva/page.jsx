'use client'

import { useState } from 'react'

export default function Reserva() {
  const [codigoInput, setCodigoInput] = useState('')
  const [reserva, setReserva] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const buscarReserva = async () => {
    if (!codigoInput.trim()) return
    setLoading(true)
    setError(false)
    setReserva(null)

    try {
      const res = await fetch(`/api/reservas?codigo=${codigoInput.trim()}`)
      if (!res.ok) throw new Error('No encontrada')
      const data = await res.json()
      setReserva(data)
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-20 px-4 text-center">
      <h1 className="text-2xl font-bold mb-6">Buscar mi reserva</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Ingresá tu código de reserva"
          value={codigoInput}
          onChange={(e) => setCodigoInput(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full max-w-sm"
        />
        <button
          onClick={buscarReserva}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Buscar
        </button>
      </div>

      {loading && <p className="text-center">Buscando...</p>}

      {error && (
        <p className="text-red-500 mt-4">Reserva no encontrada. Verificá el código e intentá de nuevo.</p>
      )}

      {reserva && (
        <div className="mt-8 border rounded-lg p-6 bg-gray-50 text-left">
          <h2 className="text-xl font-semibold text-green-600 mb-4">¡Reserva encontrada!</h2>
          <p><strong>Código:</strong> {reserva.codigo}</p>
          <p><strong>Estado:</strong> {reserva.estado}</p>
          <p><strong>Método de pago:</strong> {reserva.metodoPago}</p>
          <p><strong>Cantidad de pasajeros:</strong> {reserva.cantidad}</p>
          {/* Agregá más detalles si querés */}
        </div>
      )}
    </div>
  )
}
