import React from "react";
import NuevoViajeForm from "@/components/NuevoViajeForm"
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
export default async function Page() {
  

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
                <BreadcrumbLink href="/dashboard/viajes">
                  Viajes
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                {/* Si tienes alguna página actual o sub-ruta específica */}
                <BreadcrumbPage>Nuevo</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <h1 className="text-2xl font-bold mb-4">Nuevo viaje</h1>
      <NuevoViajeForm />
    </div>
    </>
  );
}
