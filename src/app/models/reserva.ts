export interface Reserva {
    tripID: string // ObjectId en string
    titulo: string
    pasajeros: string[] // array de IDs de pasajeros
    metodoPago: 'mercado pago' | 'transferencia' | 'efectivo'
    tipoPago: 'total' | 'reserva'
    estado: 'pendiente' | 'pagado' | 'cancelado'
    fechaReserva: Date
    codigo: string // Nuevo campo para el código único
    pagos: [],
    fechaElegida: String // Fecha elegida para el viaje
  }
  