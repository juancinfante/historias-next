import { NextRequest, NextResponse } from 'next/server';
import clientPromise from 'app/lib/mongodb'; // Asegúrate de que esta ruta sea correcta para tu conexión a MongoDB
import { ObjectId } from 'mongodb'; // Importa ObjectId si alguna vez necesitas _id (aunque para 'id' no será estrictamente necesario en este CRUD)

// ---
// GET: Obtener una reserva por código
// ---
export async function GET(req: NextRequest, { params } : { params: Promise<{ codigo: string }> }) {
  try {
    const { codigo } = await params;

    if (!codigo) {
      return NextResponse.json({ error: 'Código de reserva requerido' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('historias');
    const reserva = await db.collection('reservas').findOne({ codigo: codigo });

    if (!reserva) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
    }

    return NextResponse.json(reserva);
  } catch (error) {
    console.error('GET error reserva:', error);
    return NextResponse.json({ error: 'Error interno del servidor al obtener la reserva' }, { status: 500 });
  }
}