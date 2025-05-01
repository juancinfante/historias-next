import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import clientPromise from '../../lib/mongodb'

const uri = process.env.MONGODB_URI as string
const client = new MongoClient(uri)

export async function GET(req: NextRequest) {
    try {
        const client = await clientPromise
        const db = client.db('historias')
        const trips = db.collection('trips')

        const searchParams = req.nextUrl.searchParams

        const destino = searchParams.get('destino')
        const region = searchParams.get('region')
        const origen = searchParams.get('origen') // <- este era el que faltaba
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
        const total = await trips.countDocuments(query)

        const ordenPrecio = searchParams.get('ordenPrecio')
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


