// api/pagar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Preference } from 'mercadopago'; // Asegúrate que esté correctamente importado
import { MercadoPagoConfig } from 'mercadopago'; // O desde donde lo tengas inicializado
import { nanoid } from 'nanoid';
import clientPromise from '../../lib/mongodb';
import { sendTransferenciaEmail } from '../../lib/sendTransferenciaEmail';

// Inicializa MercadoPago con tu accessToken
const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

const client = await clientPromise;
const db = client.db('historias');

const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numeros = '0123456789';

async function generarCodigoUnico(db): Promise<string> {
  let codigo = '';
  let existe = true;

  while (existe) {
    const letrasAleatorias = Array.from({ length: 3 }, () => letras[Math.floor(Math.random() * letras.length)]).join('');
    const numerosAleatorios = Array.from({ length: 3 }, () => numeros[Math.floor(Math.random() * numeros.length)]).join('');
    codigo = letrasAleatorias + numerosAleatorios;

    const existeCodigo = await db.collection('reservas').findOne({ codigo });
    if (!existeCodigo) existe = false;
  }

  return codigo;
}

export async function POST(req: NextRequest) {
  try {
    const { titulo, pasajeros, precio, tipoPago, metodoPago, tripID, estado } = await req.json();

    if (metodoPago === 'transferencia' || metodoPago === 'efectivo' || metodoPago === 'mercado pago') {
      
      // Creamos una reserva pendiente
      const codigo = await generarCodigoUnico(db);

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
      };

      await db.collection('reservas').insertOne(nuevaReserva);

      
      await sendTransferenciaEmail({
        email: pasajeros[0].email,
        nombrePasajero: pasajeros[0].nombre,
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
          metodoPago
        },
      },
    });

    return NextResponse.json({ init_point: preference.init_point });
  } catch (error) {
    console.error('Error creando preferencia:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
