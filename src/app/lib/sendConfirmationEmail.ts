import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendConfirmationEmail({ email, metodoPago, tipoPago }: {
    email: string
    metodoPago: 'mercadopago' | 'transferencia'
    tipoPago: 'total' | 'reserva'
}) {
    const pagoTexto = metodoPago === 'mercadopago' ? 'Mercado Pago' : 'Transferencia Bancaria'

    await resend.emails.send({
        from: 'onboarding@resend.dev', // debe estar verificado
        to: email,
        subject: '¡Gracias por tu reserva!',
        html: `<h2>Hola,</h2>
      <p>Gracias por reservar el viaje <strong></strong>.</p>
      <p>✅ <strong>Cantidad de personas:</strong></p>
      <p>💳 <strong>Método de pago:</strong></p>
      <p>Te contactaremos a la brevedad para confirmar los detalles.</p>
      <br/>
      <p>Saludos,</p>
      <p>El equipo de Historias para Viajar</p>`
    })
}
