import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '../../../lib/mongodb'
import { Trip } from '../../../models/trip'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = await params

    const client = await clientPromise
    const db = client.db('historias')
    const trip = await db.collection('trips').findOne({ slug: slug })

    if (!trip) {
      return NextResponse.json({ error: 'Viaje no encontrado' }, { status: 404 })
    }

    return NextResponse.json(trip)

  } catch (error) {
    console.error('Error al obtener viaje:', error)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await req.json()
    const client = await clientPromise
    const db = client.db('historias')
    const trips = db.collection('trips')

    const updateData: Partial<Trip> = { ...body }

    const result = await trips.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Viaje no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Viaje actualizado correctamente' })

  } catch (error) {
    console.error('Error actualizando viaje:', error)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const client = await clientPromise
    const db = client.db('historias')
    const trips = db.collection('trips')

    const result = await trips.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Viaje no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Viaje eliminado correctamente' })

  } catch (error) {
    console.error('Error eliminando viaje:', error)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
