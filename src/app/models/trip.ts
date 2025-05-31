export interface FechaViaje {
    salida: string // ISO format
    regreso: string
  }
  
  export interface Trip {
    nombre: string
    portada: string
    descripcion: string
    destino: string
    origen: string
    fechas: FechaViaje[]
    incluye: string[]
    noIncluye: string[]
    faq: string[]
    galeria: []
    precio: number
    slug: string
    createdAt?: Date
    updatedAt?: Date
  }
  