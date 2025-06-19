import MercadoPagoConfig, { Payment } from "mercadopago";
import clientPromise from "../../lib/mongodb";
import { sendConfirmationEmail } from "../../lib/sendConfirmationEmail";
import { nanoid } from "nanoid";
import { generarCodigoUnico } from "app/utils/utils";

// Inicializa MercadoPago con tu accessToken
const mercadopago = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
});

export async function POST(request) {
  try {
    // Obtenemos el cuerpo de la petición que incluye información sobre la notificación
    const body = await request.json();
    if (!body?.data?.id) {
      return new Response("Missing payment ID", { status: 400 });
    }

    // Obtenemos el pago
    const payment = await new Payment(mercadopago).get({ id: body.data.id });
    console.log(payment)
    // Si se aprueba, agregamos el mensaje
    if (payment.status === "approved") {

      const metadata = payment.metadata;
      const client = await clientPromise;
      const db = client.db('historias');

      const codigo = await generarCodigoUnico();

      const nuevaReserva = {
        viajeId: metadata.trip_id,
        tipoPago: metadata.tipo_pago,
        titulo: metadata.titulo,
        cantidad: metadata.cantidad,
        pasajeros: metadata.pasajeros,
        metodoPago: 'mercado pago',
        estado: 'pagado',
        precio: metadata.precio,
        fechaReserva: new Date(),
        codigo: codigo,
        fechaElegida: metadata.fecha_elegida, // Fecha elegida para el viaje
        pagos: metadata.pagos,
      };

      await db.collection('reservas').insertOne(nuevaReserva);

      await sendConfirmationEmail({
        email: metadata.pasajeros[0].email,
        tipoPago: metadata.tipo_pago,
        nombre: metadata.pasajeros[0].nombre + " " + metadata.pasajeros[0].apellido,
        codigoReserva: codigo,
      })
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
