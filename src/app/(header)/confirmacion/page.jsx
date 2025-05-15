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

  if (loading) {
    return (
      <div className="w-full h-[700px] mx-auto shadow-lg overflow-hidden animate-pulse">
        <div className="bg-green-800 px-6 py-20">
          <div className="flex flex-col items-center">
            <div className="bg-green-600 p-6 rounded-full w-12 h-12 mb-4" />
            <div className="h-6 w-2/3 bg-green-700 rounded mb-2" />
            <div className="h-4 w-1/3 bg-yellow-500 rounded" />
          </div>
        </div>
        <div className="bg-white w-full h-full px-6 py-8">
          <div className="container mx-auto space-y-4">
            <div className="bg-gray-100 rounded-lg p-6">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-300 rounded w-1/2" />
                <div className="h-4 bg-gray-300 rounded w-12" />
              </div>
            </div>
            <div className="text-right">
              <div className="h-4 bg-gray-300 rounded w-24 ml-auto" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !reserva) {
    return (
      <div className="w-full h-[700px] mx-auto shadow-lg overflow-hidden bg-white flex flex-col items-center justify-center text-center px-6">
        <div className="bg-red-100 text-red-600 p-4 rounded-full mb-4 text-4xl">❌</div>
        <h1 className="text-2xl font-bold text-red-600 mb-2">Reserva no encontrada</h1>
        <p className="text-gray-600">El código ingresado no corresponde a ninguna reserva válida.</p>
      </div>
    )
  }

  return (
    <div className="w-full h-[700px] mx-auto shadow-lg overflow-hidden">
      <div className="bg-green-800 text-white px-6 py-20 relative">
        <div className="mt-6 flex flex-col items-center container mx-auto">
          <div className="bg-green-600 p-4 rounded-full">
            <span className="text-3xl">✅</span>
          </div>
          <h2 className="text-3xl font-bold mt-2">Ya casi estamos!</h2>
          <div className="bg-yellow-400 text-black px-4 py-2 rounded mt-4 font-semibold">
            Reserva No: #{reserva.codigo}
          </div>
          <p className='mt-5'>Te enviamos un email con los datos para poder realizar la transferencia asi poder confirmar tu reserva!</p>
        </div>
      </div>

      <div className="bg-white w-full h-full px-6 py-8">
        <div className="container mx-auto">
          <div className="bg-gray-100 rounded-lg p-7">
            <div className="flex items-center space-x-4 max-w-[300px]">
              <div className="flex">
                <p className="font-semibold me-5 text-gray-800">{reserva.titulo || 'Paquete de viaje'}</p>
                <p className="text-md text-gray-500">x{reserva.cantidad || 1}</p>
              </div>
              <p className="font-semibold text-gray-800">${reserva.precio || 0}</p>
            </div>
          </div>

          <div className="text-right mt-4 text-lg font-bold text-gray-800">
            Total: ${reserva.cantidad * reserva.precio || 0}
          </div>
        </div>
      </div>
    </div>
  )
}

