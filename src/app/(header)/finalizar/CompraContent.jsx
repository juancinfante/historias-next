'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useRouter } from 'next/navigation';


export default function CompraContent() {
    const searchParams = useSearchParams()
    const slug = searchParams.get('s')
    const personas = parseInt(searchParams.get('p') || '1')
    const fechaIndex = parseInt(searchParams.get('f') || '0')

    const [trip, setTrip] = useState(null)
    const [loading, setLoading] = useState(true)
    const [tipoPago, setTipoPago] = useState('total')
    const [aceptaTerminos, setAceptaTerminos] = useState(false)
    const [metodoPago, setMetodoPago] = useState('mercadopago')


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



    const formatear = (f) => new Date(f).toLocaleDateString('es-AR')
    let fecha, precioUnitario, subtotal
    if (trip) {
        fecha = trip.fechas[fechaIndex]
        precioUnitario = trip.precio
        subtotal = precioUnitario * personas
    }
    const router = useRouter();

    async function handleReserva() {
        if (!aceptaTerminos) {
            alert('Debes aceptar los términos y condiciones para continuar.')
            return
        }
        const form = document.getElementById('form-compra');
        if (!form) return;

        const campos = form.querySelectorAll('input[required], select[required], textarea[required]');

        for (let campo of campos) {
            if (!campo.value.trim()) {
                alert('Por favor, completá todos los campos obligatorios.');
                campo.focus();
                return;
            }
        }

        try {
            const pasajeros = [];

            const pasajeroDivs = form.querySelectorAll('.pasajero');

            pasajeroDivs.forEach((pasajeroDiv) => {
                const nombre = pasajeroDiv.querySelector('input[placeholder="Nombre *"]')?.value || "";
                const apellido = pasajeroDiv.querySelector('input[placeholder="Apellidos *"]')?.value || "";
                const tipoDocumento = pasajeroDiv.querySelector('select')?.value || "";
                const numeroDocumento = pasajeroDiv.querySelector('input[placeholder="Número DNI o Pass *"]')?.value || "";
                const email = pasajeroDiv.querySelector('input[type="email"]')?.value || "";
                const telefono = pasajeroDiv.querySelector('input[type="tel"]')?.value || "";
                const notas = pasajeroDiv.querySelector('textarea')?.value || "";

                pasajeros.push({
                    nombre,
                    apellido,
                    tipo_documento: tipoDocumento,
                    numero_documento: numeroDocumento,
                    email,
                    telefono,
                    notas,
                });
            });

            const data = {
                tripID: trip._id,
                titulo: trip.nombre,
                pasajeros,
                metodoPago,
                tipoPago, // 'total' o 'reserva'
                precio: tipoPago === 'reserva' ? subtotal * 0.3 : subtotal,
            }

            const res = await fetch('/api/pagar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (metodoPago === 'mercadopago' && result.init_point) {
                window.location.href = result.init_point;
              } else if (metodoPago === 'transferencia' && result.codigo) {
                // Redirige a la confirmación de reserva
                router.push(`/confirmacion?id=${result.codigo}`);

              } else {
                alert('Error al procesar la reserva. Intenta de nuevo.');
              }

        } catch (error) {
            console.error('Error al procesar el pago:', error);
            alert('Error inesperado. Intenta nuevamente.');
        }
    }




    return (
        <>
            {/* Hero SIEMPRE visible */}
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
                    <h1 className="text-4xl md:text-5xl font-bold">{trip?.nombre || 'Finalizar compra'}</h1>
                </div>
            </header>
            {loading && (
                <section className="max-w-6xl w-full mx-auto px-4 py-10 animate-pulse">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* 🧍‍♂️ Skeleton del formulario de pasajeros */}
                        <div className="space-y-6">
                            <div
                                className="border border-gray-200 p-4 rounded-md shadow-sm bg-white space-y-4"
                            >
                                <div className="h-4 bg-gray-300 rounded w-1/3" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="h-10 bg-gray-200 rounded" />
                                    <div className="h-10 bg-gray-200 rounded" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="h-10 bg-gray-200 rounded" />
                                    <div className="h-10 bg-gray-200 rounded" />
                                </div>
                                <div className="h-4 bg-gray-300 rounded w-1/2 mt-4" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="h-10 bg-gray-200 rounded" />
                                    <div className="h-10 bg-gray-200 rounded" />
                                </div>
                                <div className="h-10 bg-gray-200 rounded" />
                                <div className="h-24 bg-gray-200 rounded" />
                                <div className="flex items-start gap-2">
                                    <div className="w-5 h-5 bg-gray-300 rounded" />
                                    <div className="h-4 bg-gray-300 rounded w-3/4" />
                                </div>
                                <div className="h-10 bg-gray-400 rounded w-full" />
                            </div>
                        </div>

                        {/* 📦 Skeleton del resumen "Tu pedido" */}
                        <div className="bg-white rounded-lg shadow p-6 space-y-4 h-fit sticky top-24 self-start">
                            <div className="h-6 bg-gray-300 rounded w-1/3" />
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                            <div className="h-4 bg-gray-200 rounded w-1/3" />
                            <hr />
                            <div className="h-4 bg-gray-300 rounded w-1/2" />
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-6 bg-gray-400 rounded w-full mt-4" />

                            {/* Métodos de pago (2 opciones) */}
                            <div className="space-y-4 mt-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-6 h-6 bg-gray-300 rounded-full" />
                                    <div className="h-4 bg-gray-300 rounded w-1/2" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-6 h-6 bg-gray-300 rounded-full" />
                                    <div className="h-4 bg-gray-300 rounded w-2/3" />
                                </div>
                            </div>

                            {/* Botón de acción */}
                            <div className="h-10 bg-gray-400 rounded w-full mt-6" />
                        </div>
                    </div>
                </section>
            )}

            {/* Contenido cuando ya cargó */}
            {
                trip && (
                    <section className="max-w-6xl mx-auto px-4 py-10 ">
                        <h2 className="text-2xl font-bold mb-6">Finalizar Compra</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Formulario */}
                            <div>
                                <form id="form-compra" className="space-y-6">
                                    {[...Array(personas)].map((_, i) => (
                                        <div key={i} className="pasajero border border-gray-300 p-4 rounded-md shadow-sm space-y-4 bg-white">
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
                                <div className="mt-4">
                                    <h4 className="text-sm font-semibold mb-2">¿Cómo querés pagar?</h4>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="tipoPago"
                                                value="total"
                                                checked={tipoPago === 'total'}
                                                onChange={() => setTipoPago('total')}
                                            />
                                            Pago total
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="tipoPago"
                                                value="reserva"
                                                checked={tipoPago === 'reserva'}
                                                onChange={() => setTipoPago('reserva')}
                                            />
                                            Reserva (30%)
                                        </label>
                                    </div>
                                    
                                    {tipoPago === 'reserva' && (
                                        <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 mb-4 rounded">
                                            <p className="font-semibold">Estás pagando una reserva (30%)</p>
                                            <p>Monto a pagar ahora: <strong>${(subtotal * 0.3).toLocaleString('es-AR')}</strong></p>
                                        </div>
                                    )}
                                </div>

                                {/* Métodos de pago */}
                                <div className="mt-6 space-y-4">
                                    <label className="flex items-start gap-4 p-4 border rounded cursor-pointer hover:shadow-sm">
                                        <input
                                            type="radio"
                                            name="pago"
                                            value="mercadopago"
                                            checked={metodoPago === 'mercadopago'}
                                            onChange={() => setMetodoPago('mercadopago')}
                                            className="mt-6 accent-blue-600"
                                        />
                                        <div>
                                            <div className="font-semibold flex items-center gap-2">
                                                <img src="https://dk0k1i3js6c49.cloudfront.net/iconos-pago/iconos-checkout/mercadopago-payment-icon.png" alt="" className="w-14" />
                                                <span>Mercado Pago</span>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex flex-wrap gap-2">
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
                                        <input
                                            type="radio"
                                            name="pago"
                                            value="transferencia"
                                            checked={metodoPago === 'transferencia'}
                                            onChange={() => setMetodoPago('transferencia')}
                                            className="mt-6 accent-blue-600"
                                        />
                                        <div>
                                            <div className="font-semibold flex items-center gap-2">
                                                <img src="https://dk0k1i3js6c49.cloudfront.net/iconos-pago/iconos-checkout/bank-payment-icon.png" alt="" className="w-14" />
                                                <span>Transferencia bancaria</span>
                                                <span className="text-sm font-normal text-green-600">(20% de descuento)</span>
                                            </div>
                                        </div>
                                    </label>
                                    {metodoPago === 'transferencia' && (
                                        <div className="mt-4 border-l-4 border-blue-600 bg-blue-50 p-4 text-sm text-blue-800 rounded">
                                            <p><strong>Cuenta bancaria para transferencias:</strong></p>
                                            <p>Banco: Banco Nación</p>
                                            <p>Alias: VIAJES.HISTORIAS.MP</p>
                                            <p>CBU: 0110123456789012345678</p>
                                            <p>CUIT: 20-12345678-9</p>
                                            <p>Enviá el comprobante por WhatsApp luego de hacer la reserva.</p>
                                        </div>
                                    )}
                                </div>

                                <p className="text-xs text-gray-500 mt-6">
                                    Tus datos personales se utilizarán para procesar tu pedido. Consulta nuestra <a href="#" className="underline">política de privacidad</a>.
                                </p>
                                <label className="inline-flex items-start gap-2 mt-4">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox mt-1"
                                        checked={aceptaTerminos}
                                        onChange={(e) => setAceptaTerminos(e.target.checked)}
                                    />
                                    <span className="text-sm">Acepto los <a href="#" className="underline">términos y condiciones</a> *</span>
                                </label>
                                

                                <button
                                    type="button"
                                    onClick={() => handleReserva()}
                                    className="mt-6 w-full bg-[rgb(43,52,71)] text-white font-semibold py-2 rounded-full transition"
                                >
                                    REALIZAR EL PEDIDO
                                </button>
                            </div>
                        </div>
                    </section>
                )
            }

        </>
    )
}
