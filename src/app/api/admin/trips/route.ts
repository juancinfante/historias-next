import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'
import { Trip } from '../../../models/trip'

// export async function POST(req: NextRequest) {
//     try {
//       const body = await req.json()
//       const { nombre, portada, destino, origen, fechas, incluye, noIncluye, precio, descripcion } = body as Trip
  
//       if (!nombre || !portada || !precio || !destino || !origen || !fechas?.length || !descripcion) {
//         return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
//       }
  
//       const client = await clientPromise
//       const db = client.db('historias')
  
//       const slug = nombre.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  
//       const newTrip = {
//         nombre,
//         portada,
//         destino,
//         origen,
//         precio,
//         fechas,
//         slug,
//         descripcion,
//         incluye: incluye || [],
//         noIncluye: noIncluye || [],
//         createdAt: new Date(),
//         updatedAt: new Date()
//       }
  
//       const result = await db.collection('trips').insertOne(newTrip)
  
//       return NextResponse.json({ _id: result.insertedId, ...newTrip }, { status: 201 })
//     } catch (error) {
//       console.error('POST error admin trip:', error)
//       return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
//     }
//   }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      nombre,
      portada,
      destino,
      origen,
      fechas,
      incluye,
      noIncluye,
      precio,
      descripcion,
      galeria,
      faq,
      region
    } = body as Trip

    // Validación básica
    if (!nombre || !portada || !precio || !destino || !origen || !fechas?.length || !descripcion) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('historias')

    const slug = nombre
      .toLowerCase()
      .replace(/\s+/g, '-')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

    const newTrip = {
      nombre,
      slug,
      portada,
      destino,
      origen,
      precio,
      fechas,
      descripcion,
      incluye: incluye || [],
      noIncluye: noIncluye || [],
      galeria: galeria || [],
      faq: faq || [],
      region: region || "",
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection('trips').insertOne(newTrip)

    return NextResponse.json({ _id: result.insertedId, ...newTrip }, { status: 201 })
  } catch (error) {
    console.error('POST error admin trip:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
