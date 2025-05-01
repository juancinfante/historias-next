import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendTransferenciaEmail({
  email,
  nombrePasajero,
  codigo,
  precio,
  tipoPago,
}) {
  const montoTexto = tipoPago === 'reserva'
    ? `el 30% del total (${precio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })})`
    : `el monto total (${precio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })})`

  await resend.emails.send({
    from: 'onboarding@resend.dev', // debe estar verificado en Resend
    to: email,
    subject: `Reserva confirmada: ${codigo}`,
    html: `
      <h2>Hola,</h2>
      <p>Gracias por reservar tu lugar con nosotros 🙌</p>
      <p>Tu número de reserva es: <strong>${codigo}</strong></p>
      <p>💸 Te recordamos que elegiste pagar por <strong>transferencia bancaria</strong>.</p>
      <p>Por favor, realizá una transferencia por <strong>${montoTexto}</strong> a la siguiente cuenta:</p>
      <ul>
        <li><strong>CBU:</strong> 0000000000000000000000</li>
        <li><strong>Alias:</strong> historias.viajar</li>
        <li><strong>Banco:</strong> Banco Ejemplo</li>
      </ul>
      <p>Una vez realizado el pago, envíanos el comprobante respondiendo a este mail o por WhatsApp al 385123456</p>
      <br/>
      <p>Saludos,</p>
      <p>El equipo de Historias para Viajar</p>
    `,
  })
}
