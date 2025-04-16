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
    precio: number
    slug: string
    creadoEn?: Date
  }
  