import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '../../lib/mongodb'
import { Pasajero } from '../../models/pasajero'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { viajeId, pasajeros, metodoPago, reserva30 } = body

        if (!viajeId || !pasajeros?.length || !metodoPago) {
            return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 })
        }

        const client = await clientPromise
        const db = client.db('historias')

        // 1. Verificar existencia del viaje
        const viaje = await db.collection('trips').findOne({ _id: new ObjectId(viajeId) })
        if (!viaje) {
            return NextResponse.json({ error: 'Viaje no encontrado' }, { status: 404 })
        }

        if (typeof viaje.precio !== 'number') {
            return NextResponse.json({ error: 'El viaje no tiene precio definido' }, { status: 400 })
        }

        // 2. Verificar lugares disponibles (solo reservas pagadas)
        const reservasPagadas = await db.collection('reservas').aggregate([
            {
                $match: {
                    viajeId: new ObjectId(viajeId),
                    estado: 'pagado'
                }
            },
            {
                $group: {
                    _id: null,
                    totalPasajeros: { $sum: '$cantidad' }
                }
            }
        ]).toArray()

        const yaReservados = reservasPagadas[0]?.totalPasajeros || 0
        const disponibles = viaje.lugares - yaReservados

        if (pasajeros.length > disponibles) {
            return NextResponse.json({
                error: `Solo quedan ${disponibles} lugares disponibles para este viaje`
            }, { status: 400 })
        }

        // 3. Insertar o reutilizar pasajeros
        const pasajerosIds: ObjectId[] = []

        for (const p of pasajeros as Pasajero[]) {
            const existente = await db.collection('pasajeros').findOne({ dni: p.dni })

            if (existente) {
                pasajerosIds.push(existente._id)
            } else {
                const nuevoPasajero = {
                    ...p,
                    creadoEn: new Date()
                }
                const insert = await db.collection('pasajeros').insertOne(nuevoPasajero)
                pasajerosIds.push(insert.insertedId)
            }
        }

        // 4. Calcular montos
        const cantidad = pasajeros.length
        const montoTotal = viaje.precio * cantidad
        const montoPagado = reserva30 ? montoTotal * 0.3 : montoTotal

        // 5. Crear reserva
        const reserva = {
            viajeId: new ObjectId(viajeId),
            pasajeros: pasajerosIds,
            cantidad,
            metodoPago,
            estado: 'pendiente',
            fechaReserva: new Date(),
            montoTotal,
            montoPagado,
            reserva30: !!reserva30,
            pagadoTotal: !reserva30 // false si pagó solo el 30%
        }


        const result = await db.collection('reservas').insertOne(reserva)

        return NextResponse.json({ _id: result.insertedId, ...reserva }, { status: 201 })

    } catch (error) {
        console.error('Error al crear reserva:', error)
        return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
    }
}
export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('historias');

    // Usamos find() sin argumentos para obtener todos los documentos de la colección
    // y luego .toArray() para convertir el cursor en un array de objetos.
    const reservas = await db.collection('reservas').find({}).toArray();

    // Si no se encuentra ninguna reserva, find().toArray() devolverá un array vacío.
    // Puedes decidir si quieres un 404 aquí o simplemente un array vacío.
    // Lo más común es devolver un array vacío si no hay resultados, no un 404.
    if (!reservas || reservas.length === 0) {
      // Puedes devolver un array vacío con status 200 si es el comportamiento deseado
      // o un 404 si "no encontradas" significa que la colección no existe o un error.
      // Para "todas las reservas", lo normal es [] y 200 OK.
      return NextResponse.json([]); // Devuelve un array vacío si no hay reservas
    }

    return NextResponse.json(reservas);
  } catch (error) {
    console.error('GET error todas las reservas:', error);
    // Devuelve un error 500 en caso de problemas con la base de datos o el servidor
    return NextResponse.json({ error: 'Error interno del servidor al obtener las reservas' }, { status: 500 });
  }
}
