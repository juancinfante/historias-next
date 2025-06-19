// api/pagar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Preference } from 'mercadopago'; // Asegúrate que esté correctamente importado
import { MercadoPagoConfig } from 'mercadopago'; // O desde donde lo tengas inicializado
import clientPromise from '../../lib/mongodb';
import { sendTransferenciaEmail } from '../../lib/sendTransferenciaEmail';
import { generarCodigoUnico } from 'app/utils/utils';

// Inicializa MercadoPago con tu accessToken
const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

const client = await clientPromise;
const db = client.db('historias');

function obtenerFechaFormateada() {
  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, '0');
  const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0
  const anio = hoy.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

export async function POST(req: NextRequest) {
  try {
    const { titulo, pasajeros, precio, tipoPago, metodoPago, tripID, estado, fechaElegida, pagos } = await req.json();

    if (metodoPago === 'transferencia' || metodoPago === 'efectivo' ||  metodoPago === 'mercado pago admin') {
      
      // Creamos una reserva pendiente
      const codigo = await generarCodigoUnico();

      const nuevaReserva = {
        viajeId: tripID,
        titulo,
        pasajeros,
        cantidad: pasajeros.length,
        metodoPago: metodoPago,
        estado: estado,
        fechaReserva: new Date(),
        codigo,
        precio,
        tipoPago,
        fechaElegida,
        ...(pagos && { pagos }),
      };

      await db.collection('reservas').insertOne(nuevaReserva);

      
      await sendTransferenciaEmail({
        email: pasajeros[0].email,
        nombrePasajero: pasajeros[0].nombre + ' ' + pasajeros[0].apellido,
        codigo: codigo,
        precio: precio,
        tipoPago
      })

      return NextResponse.json({ codigo });
    }
    const preference = await new Preference(mercadopago).create({
      body: {
        items: [
          {
            id: "pago_viaje",
            unit_price: precio,
            quantity: 1,
            title: titulo,
          },
        ],
        metadata: {
          tripID,
          pasajeros,
          precio,
          tipoPago,
          titulo,
          cantidad: pasajeros.length,
          fechaElegida,
          pagos: [{monto: precio, metodo: "mercado pago", fecha: new Date()}],
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/pagar/exito`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/pagar/error`,
        },
      },
    });

    return NextResponse.json({ init_point: preference.init_point });
  } catch (error) {
    console.error('Error creando preferencia:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
