export interface FechaViaje {
    salida: String // ISO format
    regreso: string
  }
  
  export interface Trip {
    nombre: String
    portada: String
    descripcion: String
    destino: String
    origen: []
    noches: Number
    dias: Number
    fechas: FechaViaje[]
    incluye: String[]
    noIncluye: String[]
    faq: String[]
    galeria: []
    precio: Number
    slug: String
    lugares: Number
    mostrarLugares: Boolean
    createdAt?: Date
    updatedAt?: Date
  }
  