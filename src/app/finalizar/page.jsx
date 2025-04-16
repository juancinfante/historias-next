'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'

export default function FinalizarCompra() {
    const searchParams = useSearchParams()
    const slug = searchParams.get('s')
    const personas = parseInt(searchParams.get('p') || '1')
    const fechaIndex = parseInt(searchParams.get('f') || '0')

    const [trip, setTrip] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const res = await fetch(`/api/trips/${slug}`)
                const data = await res.json()
                setTrip(data)
            } catch (err) {
                console.error('Error al cargar el viaje:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchTrip()
    }, [slug])

    if (loading) return <p className="p-6 text-center">Cargando viaje...</p>
    if (!trip) return <p className="p-6 text-center">Viaje no encontrado</p>

    const fecha = trip.fechas[fechaIndex]
    const precioUnitario = trip.precio
    const subtotal = precioUnitario * personas

    const formatear = (f) => new Date(f).toLocaleDateString('es-AR')

    return (
        <>
            {/* Hero */}
            <header className="relative h-96 w-full">
                <Image
                    src="/img/hornocal.webp"
                    alt="Imagen de fondo"
                    fill
                    priority
                    sizes="10vh"
                    className="object-cover z-0"
                />
                <div className="absolute inset-0 bg-black/50 z-10" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold">{trip.nombre}</h1>
                </div>
            </header>
            <section className="max-w-6xl mx-auto px-4 py-10 mt-[60px]">
                <h2 className="text-2xl font-bold mb-6">Finalizar Compra</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Formulario */}
                    <div>
                        <form id="form-compra" className="space-y-6">
                            {[...Array(personas)].map((_, i) => (
                                <div key={i} className="border border-gray-300 p-4 rounded-md shadow-sm space-y-4 bg-white">
                                    <h4 className="font-semibold text-gray-800">Pasajero {i + 1}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="text" placeholder="Nombre *" className="border rounded px-4 py-2 w-full" required />
                                        <input type="text" placeholder="Apellidos *" className="border rounded px-4 py-2 w-full" required />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <select className="border rounded px-4 py-2 w-full">
                                            <option>DNI</option>
                                            <option>Pasaporte</option>
                                        </select>
                                        <input type="text" placeholder="Número DNI o Pass *" className="border rounded px-4 py-2 w-full" required />
                                    </div>
                                    <div className="space-y-4 mt-8">
                                        <h4 className="font-semibold text-gray-800">Datos del contacto</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input type="email" placeholder="Correo electrónico *" className="border rounded px-4 py-2 w-full" required />
                                            <input type="tel" placeholder="Teléfono (WhatsApp) *" className="border rounded px-4 py-2 w-full" required />
                                        </div>
                                        <select className="border rounded px-4 py-2 w-full">
                                            <option>Argentina</option>
                                            <option>Chile</option>
                                            <option>Perú</option>
                                        </select>
                                        <textarea
                                            placeholder="Notas del pedido (opcional)"
                                            className="w-full border rounded px-4 py-2 h-24"
                                        ></textarea>
                                    </div>
                                </div>

                            ))}

                        </form>
                    </div>

                    {/* Resumen */}
                    <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-24 self-start">
                        <h3 className="text-xl font-bold text-gray-700 mb-4">Tu Pedido</h3>
                        <div className="flex justify-between font-semibold border-b pb-2">
                            <span>PRODUCTO</span>
                            <span>SUBTOTAL</span>
                        </div>
                        <div className="py-4 border-b text-sm">
                            <p className="font-medium text-gray-800">{trip.nombre}</p>
                            <p className="text-gray-600 text-sm">
                                Salida: {formatear(fecha.salida)}<br />
                                Regreso: {formatear(fecha.regreso)}<br />
                                Cantidad: {personas}
                            </p>
                            <p className="text-right font-semibold text-gray-800 mt-1">
                                ${subtotal.toLocaleString('es-AR')}
                            </p>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-600">Subtotal</span>
                            <span>${subtotal.toLocaleString('es-AR')}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                            <span>Total</span>
                            <span>${subtotal.toLocaleString('es-AR')}</span>
                        </div>

                        {/* Métodos de pago */}
                        <div className="mt-6 space-y-4">
                            <label className="flex items-start gap-4 p-4 border rounded cursor-pointer hover:shadow-sm">
                                <input type="radio" name="pago" defaultChecked className="mt-6 accent-blue-600" />
                                <div>
                                    <div className="font-semibold flex items-center gap-2">
                                        <img src="https://dk0k1i3js6c49.cloudfront.net/iconos-pago/iconos-checkout/mercadopago-payment-icon.png" alt="" className="w-14" />
                                        <span>Mercado Pago</span>
                                    </div>
                                </div>
                                <div class="mt-2 flex flex-wrap gap-2">
                                    <img src="https://dk0k1i3js6c49.cloudfront.net/iconos-pago/mastercard.png" alt="Mastercard" className="h-5" />
                                    <img src="https://dk0k1i3js6c49.cloudfront.net/iconos-pago/visa.png" alt="Visa" className="h-5" />
                                    <img src="https://dk0k1i3js6c49.cloudfront.net/iconos-pago/american-express.png" alt="Naranja" className="h-5" />
                                    <img src="https://dk0k1i3js6c49.cloudfront.net/iconos-pago/naranja.png" alt="Cabal" className="h-5" />
                                    <img src="https://dk0k1i3js6c49.cloudfront.net/iconos-pago/cabal.png" alt="Maestro" className="h-5" />
                                    <img src="https://dk0k1i3js6c49.cloudfront.net/iconos-pago/maestro.png" alt="Nativa" className="h-5" />
                                    <img src="https://dk0k1i3js6c49.cloudfront.net/iconos-pago/diners-club.png" alt="Diners Club" className="h-5" />
                                    <img src="https://dk0k1i3js6c49.cloudfront.net/iconos-pago/nativa.png" alt="Rapipago" className="h-5" />
                                    <img src="https://dk0k1i3js6c49.cloudfront.net/iconos-pago/argencard.png" alt="Rapipago" className="h-5" />
                                    <img src="https://dk0k1i3js6c49.cloudfront.net/iconos-pago/pagofacil.png" alt="Rapipago" className="h-5" />
                                    <img src="https://dk0k1i3js6c49.cloudfront.net/iconos-pago/rapipago.png" alt="Rapipago" className="h-5" />
                                </div>
                            </label>
                            <label className="flex items-start gap-4 p-4 border rounded cursor-pointer hover:shadow-sm">
                                <input type="radio" name="pago" className="mt-6 accent-blue-600" />
                                <div>
                                    <div className="font-semibold flex items-center gap-2">
                                        <img src="https://dk0k1i3js6c49.cloudfront.net/iconos-pago/iconos-checkout/bank-payment-icon.png" alt="" className="w-14" />
                                        <span>Transferencia bancaria</span>
                                        <span className="text-sm font-normal text-green-600">(20% de descuento)</span>
                                    </div>
                                </div>
                            </label>
                        </div>

                        <p className="text-xs text-gray-500 mt-6">
                            Tus datos personales se utilizarán para procesar tu pedido. Consulta nuestra <a href="#" className="underline">política de privacidad</a>.
                        </p>
                        <label className="inline-flex items-start gap-2 mt-4">
                            <input type="checkbox" className="form-checkbox mt-1" />
                            <span className="text-sm">Acepto los <a href="#" className="underline">términos y condiciones</a> *</span>
                        </label>
                        <button
                            type="button"
                            onClick={() => {
                                const form = document.getElementById('form-compra')
                                const campos = form.querySelectorAll('input[required], select[required], textarea[required]')

                                for (let campo of campos) {
                                    if (!campo.value.trim()) {
                                        alert('Por favor, completá todos los campos obligatorios.')
                                        campo.focus()
                                        return
                                    }
                                }

                                // Acá podrías hacer un fetch, mostrar loading, etc.
                                alert('Formulario válido, listo para enviar')
                            }}
                            className="mt-6 w-full bg-[rgb(43,52,71)] text-white font-semibold py-2 rounded-full transition"
                        >
                            REALIZAR EL PEDIDO
                        </button>
                    </div>
                </div>
            </section>
        </>
    )
}
