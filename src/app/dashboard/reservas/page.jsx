import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/components/ui/breadcrumb"
import { Separator } from "@/components/components/ui/separator"
import {
  SidebarTrigger,
} from "@/components/components/ui/sidebar"
import { DataTable } from './data-table'
import { columns } from './columns'
// async function getData(){
//   ¡Entendido! Para dejar de simular los datos y obtener las reservas directamente de tu API, simplemente necesitas hacer una llamada Workspace a tu endpoint /api/reservas.

// Asumiendo que esta getData se encuentra en un Client Component (ya que la interacción con la API se hará en el navegador o en un entorno que soporta Workspace en el cliente), así es como se vería:

// Función getData para Obtener Todas las Reservas
// TypeScript

// // Asegúrate de que este componente (o el archivo donde se use getData) sea un Client Component si está en Next.js App Router
// // "use client";

// import { NextResponse } from 'next/server'; // Aunque no se usa directamente aquí, puede que tu archivo lo necesite

// // Define las interfaces para tipar los datos que esperas de la API
// interface Pasajero {
//   nombre: string;
//   apellido: string;
//   tipo_documento: string;
//   numero_documento: string;
//   email: string;
//   telefono: string;
//   notas: string;
// }

// interface Reserva {
//   _id: string;
//   viajeId: string;
//   pasajeros: Pasajero[];
//   cantidad: number;
//   metodoPago: string;
//   estado: string;
//   fechaReserva: string;
//   codigo: string;
//   precio: number;
//   tipoPago: string;
// }

export async function getData(){
  try {
    // Usa process.env.NEXT_PUBLIC_API_BASE_URL para construir la URL absoluta
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_API_BASE_URL no está definido en las variables de entorno.");
    }

    const response = await fetch(`${baseUrl}/api/reservas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    // Verifica si la respuesta fue exitosa (código de estado 2xx)
    if (!response.ok) {
      // Si la API devuelve un error (ej. 500), lanza un error para manejarlo.
      const errorData = await response.json();
      throw new Error(errorData.error || `Error HTTP: ${response.status}`);
    }

    // Parsea la respuesta JSON en un array de objetos Reserva
    const reservas = await response.json();
    return reservas;

  } catch (error) {
    console.error('Error al obtener las reservas:', error);
    // Puedes lanzar el error o devolver un array vacío / un error específico según tu lógica de UI
    throw error; // Re-lanza el error para que el componente que llama a getData pueda manejarlo
    // return []; // O podrías devolver un array vacío si prefieres no lanzar un error en este punto.
  }
}


export default async function page()  {

  const data = await getData()

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Reservas
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                {/* <BreadcrumbPage>Data Fetching</BreadcrumbPage> */}
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DataTable columns={columns} data={data} />
        {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
        </div>
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" /> */}
      </div>
    </>
  )
}
