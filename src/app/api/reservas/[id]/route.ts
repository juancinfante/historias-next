import { NextRequest, NextResponse } from 'next/server';
import clientPromise from 'app/lib/mongodb'; // Asegúrate de que esta ruta sea correcta para tu conexión a MongoDB
import { ObjectId } from 'mongodb'; // Importa ObjectId si alguna vez necesitas _id (aunque para 'id' no será estrictamente necesario en este CRUD)

// ---
// GET: Obtener una reserva por código
// ---
export async function GET(req: NextRequest, { params } : { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    if (!id) {
      return NextResponse.json({ error: 'Código de reserva requerido' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('historias');
    const reserva = await db.collection('reservas').findOne({ _id: new ObjectId(id) });

    if (!reserva) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
    }

    return NextResponse.json(reserva);
  } catch (error) {
    console.error('GET error reserva:', error);
    return NextResponse.json({ error: 'Error interno del servidor al obtener la reserva' }, { status: 500 });
  }
}

// ---
// PUT: Actualizar completamente una reserva por código (o crear si no existe, si lo deseas)
// ---
export async function PUT(req: NextRequest, { params } : { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    
    if (!id) {
      return NextResponse.json({ error: 'Código de reserva requerido' }, { status: 400 });
    }

    let updateData;
    try {
      updateData = await req.json();
    } catch (error) {
      return NextResponse.json({ error: 'Formato de cuerpo de solicitud inválido (JSON esperado)' }, { status: 400 });
    }

    // Opcional: Eliminar _id si está presente en updateData para evitar errores de actualización
    if (updateData._id) {
      delete updateData._id;
    }

    const client = await clientPromise;
    const db = client.db('historias');

    const result = await db.collection('reservas').updateOne(
      { _id: new ObjectId(id) }, // Filtro para encontrar la reserva
      { $set: updateData }, // Actualiza los campos proporcionados
      { upsert: false } // 'true' crearía la reserva si no existe; 'false' (por defecto) solo actualiza
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Reserva no encontrada para el código proporcionado' }, { status: 404 });
    }

    // Opcional: Devolver la reserva actualizada para confirmación
    const updatedReserva = await db.collection('reservas').findOne({ _id: new ObjectId(id) });
    return NextResponse.json(updatedReserva);

  } catch (error) {
    console.error('PUT error reserva:', error);
    return NextResponse.json({ error: 'Error interno del servidor al actualizar la reserva' }, { status: 500 });
  }
}

// ---
// DELETE: Eliminar una reserva por código
// ---
export async function DELETE(req: NextRequest, { params } : { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Código de reserva requerido' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('historias');

    const result = await db.collection('reservas').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Reserva no encontrada para el código proporcionado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Reserva eliminada exitosamente' }, { status: 200 });
  } catch (error) {
    console.error('DELETE error reserva:', error);
    return NextResponse.json({ error: 'Error interno del servidor al eliminar la reserva' }, { status: 500 });
  }
}

// ---
// POST: Crear una nueva reserva
// NOTA: Para un CRUD RESTful completo, la operación POST para crear un recurso normalmente iría
// en la ruta base de la colección, no en la ruta con el ID específico.
// Por ejemplo: POST /api/reservas
// La incluyo aquí para completar el CRUD, pero considera moverla si sigues las convenciones REST.
// ---
export async function POST(req: NextRequest) {
  try {
    let newReservaData;
    try {
      newReservaData = await req.json();
    } catch (error) {
      return NextResponse.json({ error: 'Formato de cuerpo de solicitud inválido (JSON esperado)' }, { status: 400 });
    }

    // Opcional: Puedes validar los datos aquí antes de insertar
    if (!newReservaData.id) { // Asegúrate de que el código sea proporcionado al crear
      return NextResponse.json({ error: 'El campo "id" es requerido para crear una reserva' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('historias');

    // Opcional: Verificar si ya existe una reserva con el mismo código antes de insertar
    const existingReserva = await db.collection('reservas').findOne({ id: newReservaData.id });
    if (existingReserva) {
      return NextResponse.json({ error: 'Ya existe una reserva con este código' }, { status: 409 }); // 409 Conflict
    }

    const result = await db.collection('reservas').insertOne(newReservaData);

    // Devolver la reserva recién creada, incluyendo su _id generado por MongoDB
    const createdReserva = await db.collection('reservas').findOne({ _id: result.insertedId });
    return NextResponse.json(createdReserva, { status: 201 }); // 201 Created

  } catch (error) {
    console.error('POST error reserva:', error);
    return NextResponse.json({ error: 'Error interno del servidor al crear la reserva' }, { status: 500 });
  }
}