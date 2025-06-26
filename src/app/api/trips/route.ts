import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import clientPromise from '../../lib/mongodb'

const uri = process.env.MONGODB_URI as string
// const client = new MongoClient(uri)

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

        const ordenPrecio = searchParams.get('ordenPrecio')
        let sort: any = { creadoEn: -1 }
        if (ordenPrecio === 'asc') sort = { precio: 1 }
        if (ordenPrecio === 'desc') sort = { precio: -1 }

        // Filtro base
        const match: any = {}
        if (destino) match.destino = { $regex: new RegExp(destino, 'i') }
        if (region) match.region = { $regex: new RegExp(region, 'i') }
        if (origen) match.origen = { $regex: new RegExp(origen, 'i') }

        const pipeline: any[] = [{ $match: match }]

        let filtrandoPorMes = false

        if (mes) {
            const mesNum = parseInt(mes)
            if (!isNaN(mesNum)) {
                filtrandoPorMes = true
                pipeline.push(
                    { $unwind: "$fechas" },
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    { $month: { $toDate: "$fechas.salida" } },
                                    mesNum
                                ]
                            }
                        }
                    }
                )
            }
        }

        if (filtrandoPorMes) {
            // Volvemos a agrupar fechas para mantener la estructura original
            pipeline.push(
                {
                    $group: {
                        _id: "$_id",
                        doc: { $first: "$$ROOT" },
                        fechas: { $push: "$fechas" }
                    }
                },
                {
                    $addFields: {
                        "doc.fechas": "$fechas"
                    }
                },
                {
                    $replaceRoot: {
                        newRoot: "$doc"
                    }
                }
            )
        } else {
            pipeline.push(
                {
                    $group: {
                        _id: "$_id",
                        doc: { $first: "$$ROOT" }
                    }
                },
                {
                    $replaceRoot: {
                        newRoot: "$doc"
                    }
                }
            )
        }

        // 🔁 APLICAR ORDENAMIENTO AHORA
        pipeline.push(
            { $sort: sort },
            { $skip: skip },
            { $limit: limit }
        )

        // Ejecutar pipeline
        const trips = await tripsCollection.aggregate(pipeline).toArray()

        // Obtener cantidad total (sin paginar)
        const total = await tripsCollection.countDocuments(match)

        // Cargar reservas
        const tripIds = trips.map(t => t._id)
        const reservas = await reservasCollection
            .find({ viajeId: { $in: tripIds.map(id => id.toString()) } })
            .toArray()

        const pasajerosPorViaje: Record<string, number> = {}
        reservas.forEach(reserva => {
            const viajeId = reserva.viajeId
            pasajerosPorViaje[viajeId] = (pasajerosPorViaje[viajeId] || 0) + (reserva.cantidad || 0)
        })

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



