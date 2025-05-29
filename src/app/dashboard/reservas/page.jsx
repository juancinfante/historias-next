"use client" // <--- ¡IMPORTANTE! Marca este archivo como Client Component

import React, { useState, useEffect, useCallback } from 'react' // Importa hooks necesarios
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
import { columns } from './columns' // Asegúrate que este path sea correcto
import { Loader2 } from 'lucide-react'
import ModalNuevaReserva  from "@/components/ModalNuevaReserva"

export default function ReservasPage() { // Cambiado a un Client Component
  const [data, setData] = useState([]); // Estado para tus datos de reservas
  const [isLoading, setIsLoading] = useState(true); // Estado para el indicador de carga
  const [error, setError] = useState(null); // Estado para manejar errores

  // Función para obtener los datos de las reservas
  // Usamos useCallback para que esta función no cambie en cada render si no es necesario,
  // lo cual es bueno cuando se pasa como prop.
  const fetchReservas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_API_BASE_URL no está definido en las variables de entorno.");
      }

      const response = await fetch(`${baseUrl}/api/reservas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // cache: 'no-store' // No es necesario aquí si fetch se hace en el cliente
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error HTTP: ${response.status}`);
      }

      const reservas = await response.json();
      setData(reservas);
    } catch (err) {
      console.error('Error al obtener las reservas:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []); // El array de dependencias vacío significa que esta función solo se crea una vez

  // Ejecuta fetchReservas cuando el componente se monta por primera vez
  useEffect(() => {
    fetchReservas();
  }, [fetchReservas]); // Dependencia de fetchReservas




  // Pasa la función `WorkspaceReservas` a la función `columns`
  // Esto permite que el componente de acción en 'columns.js' la llame
  const reservationColumns = columns(fetchReservas);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Cargando reservas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 items-center justify-center h-screen text-red-500">
        <p>Error al cargar las reservas: {error}</p>
        <Button onClick={fetchReservas}>Reintentar</Button>
      </div>
    );
  }

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
                {/* Si tienes alguna página actual o sub-ruta específica */}
                {/* <BreadcrumbPage>Detalles</BreadcrumbPage> */}
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className='flex w-full justify-end'>
          <ModalNuevaReserva onSuccess={() => fetchReservas()} />
        </div>
        {/* Pasa las columnas configuradas con la función de recarga */}
        <DataTable columns={reservationColumns} data={data} />
      </div>
    </>
  )
}