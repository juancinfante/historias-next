export interface Reserva {
    viajeId: string // ObjectId en string
    pasajeros: string[] // array de IDs de pasajeros
    cantidad: number
    metodoPago: 'mercadopago' | 'transferencia'
    estado: 'pendiente' | 'pagado' | 'cancelado'
    fechaReserva: Date
  }
  