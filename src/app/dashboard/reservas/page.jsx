"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/components/ui/breadcrumb";
import { Separator } from "@/components/components/ui/separator";
import { SidebarTrigger } from "@/components/components/ui/sidebar";
import { Button } from "@/components/components/ui/button";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Loader2 } from "lucide-react";
import ModalNuevaReserva from "@/components/ModalNuevaReserva";
import { Input } from "@/components/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/components/ui/select";

export default function ReservasPage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [codigo, setCodigo] = useState("");
  const [destinos, setDestinos] = useState([]);
  const [fechas, setFechas] = useState([]);
  const [destinoSeleccionado, setDestinoSeleccionado] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [metodoPago, setMetodoPago] = useState('');
  const [tipoPago, setTipoPago] = useState('');
  const [estadoPago, setEstadoPago] = useState('');
  const [cantidad, setCantidad] = useState('');

  // Obtiene todas las reservas
  const fetchReservas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${baseUrl}/api/reservas`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error HTTP: ${response.status}`);
      }
      const reservas = await response.json();
      setData(reservas.reservas);
      setCantidad(reservas.total);
    } catch (err) {
      console.error("Error al obtener las reservas:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtiene los destinos
  useEffect(() => {
    async function obtenerDestinos() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trips`);
        const data = await res.json();
        setDestinos(data.data);
      } catch (err) {
        console.error("Error al obtener destinos:", err);
      }
    }
    obtenerDestinos();
  }, []);

  // Actualiza fechas al cambiar destino
  useEffect(() => {
    const destino = destinos.find((d) => d.titulo === destinoSeleccionado);
    if (destino && destino.fechas) {
      setFechas(destino.fechas);
    } else {
      setFechas([]);
    }
  }, [destinoSeleccionado, destinos]);

  // Carga inicial de todas las reservas
  useEffect(() => {
    fetchReservas();
  }, [fetchReservas]);

  // Carga inicial de todas las fechas segun destino
  useEffect(() => {
    if (!destinoSeleccionado) {
      setFechas([]);
      return;
    }

    const destino = destinos.find((d) => d.nombre === destinoSeleccionado);

    if (destino && Array.isArray(destino.fechas)) {
      // Transformamos [{salida, regreso}] → ["2025-06-04 - 2025-06-04"]
      const fechasFormateadas = destino.fechas.map((f) => `${f.salida}`);
      setFechas(fechasFormateadas);
    } else {
      setFechas([]);
    }
  }, [destinoSeleccionado, destinos]);

  // Buscar filtrando
  const handleBuscar = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  try {
    const params = new URLSearchParams();

    if (codigo) params.append("codigo", codigo);
    if (destinoSeleccionado) params.append("destino", destinoSeleccionado);

    if (fechaSeleccionada) {
      const fechaFormateada = new Date(fechaSeleccionada).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      params.append("fechaElegida", fechaFormateada);
    }

    if (metodoPago) params.append("metodoPago", metodoPago);
    if (tipoPago) params.append("tipoPago", tipoPago);
    if (estadoPago) params.append("estado", estadoPago);

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reservas${params.toString() ? "?" + params.toString() : ""}`;

    const res = await fetch(url);
    const result = await res.json();
    setData(result.reservas);
    setCantidad(result.total);
  } catch (err) {
    console.error(err);
    setError("Error al filtrar las reservas");
  } finally {
    setIsLoading(false);
  }
};


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
                <BreadcrumbLink href="#">Reservas</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
            </BreadcrumbList>
          </Breadcrumb>

        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex w-full justify-start">
          <ModalNuevaReserva onSuccess={() => fetchReservas()} />
        </div>
        {/* FORMULARIO DE FILTROS */}
        <form onSubmit={handleBuscar} className="flex flex-wrap items-center gap-2 mb-4">
          <Input
            type="text"
            placeholder="Buscar por código"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className="border p-2 rounded w-fit"
          />
          <Select
            value={destinoSeleccionado}
            onValueChange={(value) => {
              setDestinoSeleccionado(value === "__empty__" ? "" : value);
              setFechaSeleccionada(""); // Resetear fecha cuando cambia el destino
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos los destinos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__empty__">Todos los destinos</SelectItem>
              {destinos.map((d) => (
                <SelectItem key={d._id} value={d.nombre}>
                  {d.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>



          {/* Select de Fecha */}
          <Select
            value={fechaSeleccionada || "__empty__"}
            onValueChange={(value) => setFechaSeleccionada(value === "__empty__" ? "" : value)}
            disabled={!fechas.length}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todas las fechas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__empty__">Todas las fechas</SelectItem>
              {fechas.map((fecha, index) => {
                const salida = new Date(fecha);
                const dia = salida.getDate();
                const mes = salida.toLocaleDateString("es-ES", { month: "long" });
                const texto = `${dia} ${mes.charAt(0).toUpperCase() + mes.slice(1)}`;
                return (
                  <SelectItem key={index} value={fecha}>
                    {texto}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {/* Select de Método de Pago */}
          <Select
            value={metodoPago || "__empty__"}
            onValueChange={(value) => setMetodoPago(value === "__empty__" ? "" : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Método de Pago" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__empty__">Todos</SelectItem>
              <SelectItem value="mercado pago">Mercado Pago</SelectItem>
              <SelectItem value="efectivo">Efectivo</SelectItem>
              <SelectItem value="transferencia">Transferencia</SelectItem>
            </SelectContent>
          </Select>

          {/* Select de Tipo de Pago */}
          <Select
            value={tipoPago || "__empty__"}
            onValueChange={(value) => setTipoPago(value === "__empty__" ? "" : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de Pago" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__empty__">Todos</SelectItem>
              <SelectItem value="reserva">Reserva</SelectItem>
              <SelectItem value="total">Total</SelectItem>
            </SelectContent>
          </Select>

          {/* Select de Estado */}
          <Select
            value={estadoPago || "__empty__"}
            onValueChange={(value) => setEstadoPago(value === "__empty__" ? "" : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__empty__">Todos</SelectItem>
              <SelectItem value="pagado">Pagado</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>


          <Button type="submit" className="px-4 py-2">
            Buscar
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setCodigo("");
              setDestinoSeleccionado("");
              setFechaSeleccionada("");
              setMetodoPago("");
              setTipoPago("");
              setEstadoPago("");
              fetchReservas();
            }}
          >
            Limpiar
          </Button>
        </form>
        <h1 className="text-2xl">{cantidad} reservas encontradas</h1>




        <DataTable columns={reservationColumns} data={data} />
      </div>
    </>
  );
}
