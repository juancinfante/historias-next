'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function ConfirmacionReserva() {
  const params = useSearchParams()
  const codigo = params.get('id')
  const [loading, setLoading] = useState(true)
  const [reserva, setReserva] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchReserva = async () => {
      if (!codigo) {
        setError(true)
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`/api/reservas?codigo=${codigo}`)
        if (!res.ok) throw new Error('No encontrada')

        const data = await res.json()
        setReserva(data)
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchReserva()
  }, [codigo])

  if (loading) return <p className="text-center py-20">Cargando...</p>

  if (error || !reserva) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Reserva no encontrada</h1>
        <p>El código ingresado no corresponde a ninguna reserva.</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto text-center py-20 px-4">
      <h1 className="text-3xl font-bold text-green-600 mb-4">¡Reserva registrada!</h1>
      <p className="mb-2">Hemos guardado tu reserva con éxito.</p>
      <p className="mb-2">Tu número de reserva es: <strong>{reserva.codigo}</strong></p>
      <p className="mb-4">Te hemos enviado un email con los datos para realizar la transferencia.</p>
      <p className="text-gray-600 text-sm">Una vez recibido el pago, confirmaremos tu lugar en el viaje.</p>
    </div>
  )
}
