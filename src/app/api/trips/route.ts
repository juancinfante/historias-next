import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import clientPromise from '../../lib/mongodb'

const uri = process.env.MONGODB_URI as string
const client = new MongoClient(uri)

export async function GET(req: NextRequest) {
    try {
        const client = await clientPromise
        const db = client.db('historias')
        const tripsCollection = db.collection('trips')
        const reservasCollection = db.collection('reservas')

        const searchParams = req.nextUrl.searchParams

        const destino = searchParams.get('destino')
        const region = searchParams.get('region')
        const origen = searchParams.get('origen')
        const mes = searchParams.get('mes')

        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const skip = (page - 1) * limit

        const query: any = {}

        if (destino) {
            query.destino = { $regex: new RegExp(destino, 'i') }
        }

        if (region) {
            query.region = { $regex: new RegExp(region, 'i') }
        }

        if (origen) {
            query.origen = { $regex: new RegExp(origen, 'i') }
        }

        if (mes) {
            const mesNum = parseInt(mes)
            if (!isNaN(mesNum) && mesNum >= 1 && mesNum <= 12) {
                const ahora = new Date()
                const añoActual = ahora.getFullYear()

                const inicioMes = new Date(añoActual, mesNum - 1, 1)
                const finMes = new Date(añoActual, mesNum, 1)

                query.fechas = {
                    $elemMatch: {
                        salida: {
                            $gte: inicioMes.toISOString(),
                            $lt: finMes.toISOString()
                        }
                    }
                }
            }
        }

        let sort: any = { creadoEn: -1 }
        const total = await tripsCollection.countDocuments(query)

        const ordenPrecio = searchParams.get('ordenPrecio')
        if (ordenPrecio === 'asc') {
            sort = { precio: 1 }
        } else if (ordenPrecio === 'desc') {
            sort = { precio: -1 }
        }

        const trips = await tripsCollection
            .find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .toArray()

        // Obtener los IDs de los viajes
        const tripIds = trips.map(trip => trip._id)

        // Buscar reservas de esos viajes
        const reservas = await reservasCollection
            .find({ viajeId: { $in: tripIds.map(id => id.toString()) } })
            .toArray()

        // Crear un mapa con el total de pasajeros por viaje
        const pasajerosPorViaje: Record<string, number> = {}

        reservas.forEach(reserva => {
            const viajeId = reserva.viajeId
            if (!pasajerosPorViaje[viajeId]) {
                pasajerosPorViaje[viajeId] = 0
            }
            pasajerosPorViaje[viajeId] += reserva.cantidad || 0
        })

        // Agregar campo pasajerosReservados a cada viaje
        const tripsConReservas = trips.map(trip => ({
            ...trip,
            pasajerosReservados: pasajerosPorViaje[trip._id.toString()] || 0
        }))

        return NextResponse.json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data: tripsConReservas
        })
    } catch (error) {
        console.error('Error al obtener viajes:', error)
        return NextResponse.json({ error: 'Error al obtener viajes' }, { status: 500 })
    }
}



