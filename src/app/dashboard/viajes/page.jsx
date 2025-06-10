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
import React from 'react'
import { DataTable } from "./data-table"
import { columns } from "./colmuns"
import Link from "next/link"
import { Button } from "@/components/components/ui/button"
import { PlusCircle } from "lucide-react"

async function getData() {
    try {
        // Realiza la llamada a tu API.
        // Asegúrate de que la URL sea la correcta para tu entorno.
        // Si estás en desarrollo, podría ser http://localhost:3000/api/trips
        // En producción, debería ser tu dominio/api/trips
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trips`, {
            cache: 'no-store' // Esto asegura que los datos se obtengan en cada solicitud SSR
        });

        if (!res.ok) {
            // Maneja errores si la respuesta de la API no es exitosa
            throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        return data.data; // Asume que tu API devuelve un array de objetos directamente
    } catch (error) {
        console.error("Error fetching data:", error);
        // Puedes retornar un array vacío o lanzar el error nuevamente
        return [];
    }
}
export default async function page() {
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
                                    Viajes
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
                <Button className="ml-2 self-start">
                    <Link href="/dashboard/viajes/nuevo" className="hover-pointer flex items-center">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nueva
                    </Link>
                </Button>
                <DataTable columns={columns} data={data} />
            </div>
        </>
    )
}
