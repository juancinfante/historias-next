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

async function getData() {
    // Fetch data from your API here.
    return [
        {
            id: "728ed52f",
            nombre: "Tilcara",
            origen: "Santiago del Estero",
            destino: "pending",
            precio: "350000",
        },
        {
            id: "asdas312312",
            nombre: "Brasil",
            origen: "Cordoba",
            destino: "pending",
            precio: "250000",
        },
        {
            id: "123qweqweqw",
            nombre: "Sumampa",
            origen: "Santiago del Estero",
            destino: "pending",
            precio: "650000",
        },
        // ...
    ]
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
                <DataTable columns={columns} data={data} />
            </div>
        </>
    )
}
