'use client'
import React, { useState } from 'react'

export default function SelectorButacas({
    butacasOcupadas = [12,13,44,55,60,6,24,27,17,37],
    precioPorButaca = 150000,
}) {
    const [butacasSeleccionadas, setButacasSeleccionadas] = useState([])

    const toggleButaca = (numero) => {
        if (butacasOcupadas.includes(numero)) return
        setButacasSeleccionadas((prev) =>
            prev.includes(numero)
                ? prev.filter((n) => n !== numero)
                : [...prev, numero]
        )
    }

    return (
        <>
            <h4 className="text-lg font-semibold mb-2">Elegí tus butacas</h4>
            <div className="grid grid-cols-5 gap-2 mb-4">
                {[...Array(60)].map((_, i) => {
                    const numero = i + 1
                    const ocupada = butacasOcupadas.includes(numero)
                    const seleccionada = butacasSeleccionadas.includes(numero)
                    return (
                        <div key={numero} className="relative group">
                            <button
                                type="button"
                                disabled={ocupada}
                                onClick={() => toggleButaca(numero)}
                                className={`
                                    w-full aspect-square rounded text-sm flex items-center justify-center border
                                    ${
                                        ocupada
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : seleccionada
                                            ? 'bg-green-600 text-white'
                                            : 'bg-white text-black hover:bg-blue-100'
                                    }
                                `}
                            >
                                {numero}
                            </button>
                            {/* Tooltip */}
                            {!ocupada && (
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                                    ${precioPorButaca.toLocaleString('es-AR')}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            <input
                type="hidden"
                name="butacas"
                value={butacasSeleccionadas.join(',')}
                required
            />
        </>
    )
}
