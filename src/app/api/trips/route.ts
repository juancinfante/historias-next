import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import clientPromise from '../../lib/mongodb'
import { Trip } from '../../models/trip'

const uri = process.env.MONGODB_URI as string
const client = new MongoClient(uri)

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { nombre, portada, destino, origen, fechas, incluye, noIncluye, precio } = body as Trip

        if (!nombre || !portada || !precio || !destino || !origen || !fechas?.length) {
            return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
        }

        await client.connect()
        const db = client.db('historias') // usa el nombre por defecto de la URI
        const trips = db.collection('trips')

        const newTrip = {
            nombre,
            portada,
            destino,
            origen,
            precio,
            fechas,
            incluye: incluye || [],
            noIncluye: noIncluye || [],
            creadoEn: new Date()
        }

        const result = await trips.insertOne(newTrip)

        return NextResponse.json({ _id: result.insertedId, ...newTrip }, { status: 201 })

    } catch (error) {
        console.error('Error creando viaje:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    } finally {
        await client.close()
    }
}




export async function GET(req: NextRequest) {
    try {
        const client = await clientPromise
        const db = client.db('historias')
        const trips = db.collection('trips')

        const searchParams = req.nextUrl.searchParams

        const destino = searchParams.get('destino')
        const origen = searchParams.get('origen')
        const mes = searchParams.get('mes')

        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const skip = (page - 1) * limit

        const query: any = {}

        if (destino) {
            query.destino = { $regex: new RegExp(destino, 'i') }
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

        let sort: any = { creadoEn: -1 } // Por defecto, último creado primero
        const total = await trips.countDocuments(query)
        const ordenPrecio = searchParams.get('ordenPrecio') // asc | desc
        if (ordenPrecio === 'asc') {
            sort = { precio: 1 }
        } else if (ordenPrecio === 'desc') {
            sort = { precio: -1 }
        }
        const resultados = await trips
            .find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .toArray()

        return NextResponse.json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data: resultados
        })

    } catch (error) {
        console.error('Error al obtener viajes:', error)
        return NextResponse.json({ error: 'Error al obtener viajes' }, { status: 500 })
    }
}

