import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '../../../lib/mongodb'
import { Trip } from '../../../models/trip'

export async function GET(req: NextRequest, { params } : { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const client = await clientPromise
    const db = client.db('historias')
    const trip = await db.collection('trips').findOne({ slug })

    if (!trip) {
      return NextResponse.json({ error: 'Viaje no encontrado' }, { status: 404 })
    }

    return NextResponse.json(trip)

  } catch (error) {
    console.error('Error al obtener viaje:', error)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
