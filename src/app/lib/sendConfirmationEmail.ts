import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendConfirmationEmail({ email, tipoPago, nombre, codigoReserva }: {
    email: string
    tipoPago: 'total' | 'reserva',
    nombre: string
    codigoReserva: string
}) {
    await resend.emails.send({
        from: 'onboarding@resend.dev', // debe estar verificado
        to: email,
        subject: '¡Gracias por tu reserva!',
        html: `<h2>Hola, ${nombre}</h2>
      <p>Gracias por reservar el viaje. Hiciste una reserva abonando el ${tipoPago == "total" ? "total" : "30 %"} del viaje.<strong></strong></p>
      <p>TU numero de reserva es: <strong>${codigoReserva}</strong>.</p>
      <p>Te contactaremos a la brevedad para confirmar los detalles.</p>
      <br/>
      <p>Saludos,</p>
      <p>El equipo de Historias Argentinas</p>`
    })
}
