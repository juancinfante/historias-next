export interface Reserva {
    tripID: string // ObjectId en string
    pasajeros: string[] // array de IDs de pasajeros
    metodoPago: 'mercadopago' | 'transferencia'
    tipoPago: 'total' | 'reserva'
    estado: 'pendiente' | 'pagado' | 'cancelado'
    fechaReserva: Date
    codigo: string // Nuevo campo para el código único
  }
  