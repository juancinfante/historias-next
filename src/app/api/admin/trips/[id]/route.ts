import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'

// GET viaje por ID
export async function GET(req: NextRequest, { params } : { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('historias');
    const trip = await db.collection('trips').findOne({ _id: new ObjectId(id) });

    if (!trip) {
      return NextResponse.json({ error: 'Viaje no encontrado' }, { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    console.error('GET error admin trip:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}


// PUT viaje por ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const data = await req.json()
    const update = { ...data, updatedAt: new Date() }

    const client = await clientPromise
    const db = client.db('historias')
    const result = await db.collection('trips').updateOne({ _id: new ObjectId(id) }, { $set: update })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Viaje no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Viaje actualizado correctamente' })
  } catch (error) {
    console.error('PUT error admin trip:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}

// DELETE viaje por ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('historias')
    const result = await db.collection('trips').deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Viaje no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Viaje eliminado correctamente' })
  } catch (error) {
    console.error('DELETE error admin trip:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
