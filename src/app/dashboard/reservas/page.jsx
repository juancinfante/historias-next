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

async function getData(){
  // Fetch data from your API here.
  return [
  {
    _id: "6812a7470bf5b260caccb8e1",
    viajeId: "67f73e6ed4f9c49606ac0bc6",
    pasajeros: [
      {
        nombre: "Juan Cruz",
        apellido: "Infante",
        tipo_documento: "DNI",
        numero_documento: "12312323",
        email: "juaninfantejj@gmail.com",
        telefono: "03856137879",
        notas: "asdasd"
      },
      {
        nombre: "Laura",
        apellido: "Gómez",
        tipo_documento: "DNI",
        numero_documento: "33211234",
        email: "laura@gmail.com",
        telefono: "1123456789",
        notas: "Vegetariana"
      }
    ],
    cantidad: 2,
    metodoPago: "efectivo",
    estado: "pendiente",
    fechaReserva: "2025-04-30T22:42:15.012Z",
    codigo: "HXA255",
    precio: 2000,
    tipoPago: "total"
  },
  {
    _id: "6812a7480bf5b260caccb8e2",
    viajeId: "67f73e6ed4f9c49606ac0bc7",
    pasajeros: [
      {
        nombre: "Carlos",
        apellido: "Pérez",
        tipo_documento: "DNI",
        numero_documento: "44111222",
        email: "carlos@gmail.com",
        telefono: "1133344455",
        notas: ""
      }
    ],
    cantidad: 1,
    metodoPago: "mercado pago",
    estado: "confirmado",
    fechaReserva: "2025-05-01T10:15:30.000Z",
    codigo: "MBR812",
    precio: 1200,
    tipoPago: "seña"
  },
  {
    _id: "6812a7490bf5b260caccb8e3",
    viajeId: "67f73e6ed4f9c49606ac0bc8",
    pasajeros: [
      {
        nombre: "Ana",
        apellido: "López",
        tipo_documento: "DNI",
        numero_documento: "40123456",
        email: "ana.lopez@gmail.com",
        telefono: "1144455566",
        notas: "Alergia a frutos secos"
      },
      {
        nombre: "Martín",
        apellido: "López",
        tipo_documento: "DNI",
        numero_documento: "40123457",
        email: "martin.lopez@gmail.com",
        telefono: "1144455577",
        notas: ""
      }
    ],
    cantidad: 2,
    metodoPago: "transferencia",
    estado: "pendiente",
    fechaReserva: "2025-05-02T14:22:10.000Z",
    codigo: "LZP390",
    precio: 2200,
    tipoPago: "total"
  },
  {
    _id: "6812a7500bf5b260caccb8e4",
    viajeId: "67f73e6ed4f9c49606ac0bc9",
    pasajeros: [
      {
        nombre: "Sofía",
        apellido: "Ramírez",
        tipo_documento: "Pasaporte",
        numero_documento: "P1234567",
        email: "sofia@gmail.com",
        telefono: "1155566677",
        notas: ""
      }
    ],
    cantidad: 1,
    metodoPago: "efectivo",
    estado: "confirmado",
    fechaReserva: "2025-05-03T09:00:00.000Z",
    codigo: "TRF710",
    precio: 1800,
    tipoPago: "total"
  },
  {
    _id: "6812a7510bf5b260caccb8e5",
    viajeId: "67f73e6ed4f9c49606ac0bd0",
    pasajeros: [
      {
        nombre: "Lucía",
        apellido: "Fernández",
        tipo_documento: "DNI",
        numero_documento: "39001122",
        email: "lucia@gmail.com",
        telefono: "1166677788",
        notas: "Silla de ruedas"
      },
      {
        nombre: "Elena",
        apellido: "Fernández",
        tipo_documento: "DNI",
        numero_documento: "39001123",
        email: "elena@gmail.com",
        telefono: "1166677789",
        notas: ""
      }
    ],
    cantidad: 2,
    metodoPago: "mercado pago",
    estado: "pendiente",
    fechaReserva: "2025-05-04T18:30:00.000Z",
    codigo: "FER904",
    precio: 2500,
    tipoPago: "seña"
  }
];
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
