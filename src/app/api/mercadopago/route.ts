import MercadoPagoConfig, { Payment } from "mercadopago";
import clientPromise from "../../lib/mongodb";
import { sendConfirmationEmail } from "../../lib/sendConfirmationEmail";
import { nanoid } from "nanoid";

// Inicializa MercadoPago con tu accessToken
const mercadopago = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
});

export async function POST(request: Request) {
  try {
    // Obtenemos el cuerpo de la petición que incluye información sobre la notificación
    const body = await request.json() as { data: { id: string } };

    if (!body?.data?.id) {
      return new Response("Missing payment ID", { status: 400 });
    }

    // Obtenemos el pago
    const payment = await new Payment(mercadopago).get({ id: body.data.id });
    console.log(payment.metadata)
    // Si se aprueba, agregamos el mensaje
    if (payment.status === "approved") {

      const metadata = payment.metadata;
      const client = await clientPromise;
      const db = client.db('historias');
      const codigo = 'RSV-' + nanoid(8)
      const nuevaReserva = {
        tripID: metadata.trip_id,
        tipoPago: metadata.tipo_pago,
        pasajeros: metadata.pasajeros,
        metodo_pago: 'mercadopago',
        estado: 'pagado',
        fechaReserva: new Date(),
        codigo: codigo,
      };

      await db.collection('reservas').insertOne(nuevaReserva);

      await sendConfirmationEmail({
        email: "juaninfantejj@gmail.com",
        metodoPago: 'mercadopago',
        tipoPago: metadata.tipo_pago,
      })
      console.log("Reserva guardada con éxito");
    }
    if (payment.status === "rejected") {
        console.log("Pago rechazado:", payment.metadata);
    }
    if (payment.status === "in_process") {
        console.log("Pago pendiente:", payment.metadata);
    }

    // Respondemos con un estado 200 para indicarle que la notificación fue recibida
    return new Response(null, { status: 200 });

  } catch (error) {
    console.error("Error en el webhook de MercadoPago:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
