// components/ReservaActions.tsx
"use client"; // ¡IMPORTANTE: DEBE ESTAR EN LA PRIMERA LÍNEA!

import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Loader2 } from "lucide-react";
import { toast } from "sonner"; // Asegúrate de haber configurado 'sonner'

// Importa tus componentes de shadcn/ui.
// Verifica las rutas, parecen ser diferentes a las comunes (ej. "@/components/ui/button" vs "@/components/components/ui/button")
import { Button } from "@/components/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/components/ui/dialog";
import { Input } from "@/components/components/ui/input";
import { Label } from "@/components/components/ui/label";

// Define las interfaces fuera del componente para que sean reutilizables
interface Pasajero {
  nombre: string;
  apellido: string;
  tipo_documento: string;
  numero_documento: string;
  email: string;
  telefono: string;
  notas: string;
}

export interface Reserva { // Exporta la interfaz si la necesitas en otros archivos (ej. columns.tsx)
  _id: string;
  viajeId: string;
  pasajeros: Pasajero[];
  cantidad: number;
  metodoPago: string;
  estado: string;
  fechaReserva: string;
  codigo: string;
  precio: number;
  tipoPago: string;
}

export function ReservaActions({ reserva: initialReserva, onReservaUpdated }: { reserva: Reserva, onReservaUpdated?: (updatedReserva: Reserva) => void }) {
  // Estado original de la reserva (viene de las props)
  const [reserva, setReserva] = useState<Reserva>(initialReserva);
  // Estado para los datos que se están editando en el formulario
  const [editedReserva, setEditedReserva] = useState<Reserva>(initialReserva);
  // Estado para controlar la visibilidad del diálogo
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Estado para mostrar un indicador de carga durante la llamada a la API
  const [isLoading, setIsLoading] = useState(false);

  // Sincroniza `editedReserva` con `initialReserva` cuando la prop `initialReserva` cambie
  // Esto es crucial si la tabla padre recarga los datos y pasa una nueva `reserva` prop
  useEffect(() => {
    setReserva(initialReserva);
    setEditedReserva(initialReserva);
  }, [initialReserva]);


  // Función auxiliar para formatear la fecha
  const formatFecha = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleString(); // O el formato que prefieras
    } catch (e) {
      console.error("Error al formatear la fecha:", isoString, e);
      return isoString; // Devuelve el string original si hay un error
    }
  };

  // Manejador de cambio para campos de la reserva que NO son anidados
  const handleReservaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    // Usamos `id` del input para actualizar el campo correspondiente en `editedReserva`
    // Asegúrate de que el `id` del Input coincida con el nombre de la propiedad en el objeto Reserva
    setEditedReserva(prev => ({ ...prev, [id]: value }));
  };

  // Manejador de cambio para campos dentro de cada pasajero
  const handlePasajeroChange = (
    index: number,
    field: keyof Pasajero, // TypeScript nos ayuda aquí con los campos válidos de Pasajero
    value: string
  ) => {
    setEditedReserva(prev => {
      const newPasajeros = [...prev.pasajeros]; // Copia el array de pasajeros
      // Copia el pasajero específico y actualiza el campo
      newPasajeros[index] = { ...newPasajeros[index], [field]: value };
      return { ...prev, pasajeros: newPasajeros }; // Actualiza el estado con el nuevo array de pasajeros
    });
  };

  // Manejador de envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar página)
    setIsLoading(true); // Activa el estado de carga

    try {
      // Construir el objeto de datos que se enviará al backend (solo los campos modificados)
      const updatePayload: { [key: string]: any } = {};

      // 1. Comparar y agregar campos generales de la reserva
      // Nota: Si los campos de `editedReserva` son numéricos (ej. `precio`, `cantidad`),
      // necesitarás convertir `value` a `number` antes de la comparación y antes de enviarlo.
      // Aquí asumo que los campos que haces editables son string por el input simple.
      if (editedReserva.estado !== reserva.estado) {
        updatePayload.estado = editedReserva.estado;
      }
      if (editedReserva.metodoPago !== reserva.metodoPago) {
        updatePayload.metodoPago = editedReserva.metodoPago;
      }
      if (editedReserva.tipoPago !== reserva.tipoPago) {
        updatePayload.tipoPago = editedReserva.tipoPago;
      }
      // Para precio y cantidad, asegúrate de convertirlos a número
      const editedPrecio = parseFloat(editedReserva.precio.toString());
      const originalPrecio = parseFloat(reserva.precio.toString());
      if (!isNaN(editedPrecio) && editedPrecio !== originalPrecio) {
        updatePayload.precio = editedPrecio;
      }
      const editedCantidad = parseInt(editedReserva.cantidad.toString());
      const originalCantidad = parseInt(reserva.cantidad.toString());
      if (!isNaN(editedCantidad) && editedCantidad !== originalCantidad) {
        updatePayload.cantidad = editedCantidad;
      }


      // 2. Comparar y agregar campos de pasajeros usando notación de punto
      editedReserva.pasajeros.forEach((editedPasajero, index) => {
        const originalPasajero = reserva.pasajeros[index];
        if (originalPasajero) { // Asegúrate de que el pasajero original exista
          for (const key in editedPasajero) {
            const field = key as keyof Pasajero; // Castear a keyof Pasajero
            if (editedPasajero[field] !== originalPasajero[field]) {
              // Construye la ruta de punto para el campo anidado
              updatePayload[`pasajeros.${index}.${field}`] = editedPasajero[field];
            }
          }
        }
      });

      // Si no hay cambios, no hagas la llamada API
      if (Object.keys(updatePayload).length === 0) {
        toast.info("No se detectaron cambios para guardar.");
        setIsLoading(false);
        setIsDialogOpen(false);
        return;
      }

      // Obtén la URL base del entorno (requiere NEXT_PUBLIC_API_BASE_URL en .env.local)
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_API_BASE_URL no está definido en las variables de entorno.");
      }

      // Realiza la llamada PUT a tu API
      const response = await fetch(`${baseUrl}/api/reservas/${reserva.codigo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload), // Envía solo los cambios
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error HTTP: ${response.status}`);
      }

      const updatedReservaFromServer: Reserva = await response.json();
      setReserva(updatedReservaFromServer); // Actualiza el estado principal con los datos del servidor
      setEditedReserva(updatedReservaFromServer); // Y también el estado editable para reflejar los cambios guardados

      toast.success("Reserva actualizada exitosamente.");
      setIsDialogOpen(false); // Cierra el diálogo

      // Si hay un callback, notifica al componente padre
      if (onReservaUpdated) {
        onReservaUpdated(updatedReservaFromServer);
      }

    } catch (error: any) {
      console.error('Error al actualizar la reserva:', error);
      toast.error(`Error al actualizar la reserva: ${error.message || 'Desconocido'}`);
    } finally {
      setIsLoading(false); // Desactiva el estado de carga
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones de Reserva</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(reserva.codigo)}
        >
          Copiar código de reserva
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        {/* --- Dialog para editar detalles de la reserva --- */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => {
              e.preventDefault(); // Evita que el dropdown se cierre inmediatamente
              setIsDialogOpen(true); // Abre el diálogo
            }}>
              Editar Reserva
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl flex flex-col max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Editar Reserva: {reserva.codigo}</DialogTitle>
              <DialogDescription>
                Realiza cambios en la información de la reserva y sus pasajeros.
              </DialogDescription>
            </DialogHeader>

            {/* Formulario de edición */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
              <div className="grid gap-4 py-4 flex-grow overflow-y-auto pr-4 -mr-4"> {/* Ajustado para el scroll */}
                {/* Información General de la Reserva */}
                <h3 className="text-lg font-semibold border-b pb-2 mb-2">Información General</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-4">
                    <Label htmlFor="codigo" className="text-right w-24">Código:</Label>
                    {/* El ID del input debe coincidir con el campo en `editedReserva` para `handleReservaChange` */}
                    <Input id="codigo" value={editedReserva.codigo} className="col-span-1" readOnly />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label  className="text-right w-24">Estado:</Label>
                    <Input  value={editedReserva.estado} onChange={handleReservaChange} type="text"  className="col-span-1" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label htmlFor="cantidad" className="text-right w-24">Cantidad:</Label>
                    {/* Convertir a string para el value de input, y a number para el cambio */}
                    <Input id="cantidad" value={editedReserva.cantidad.toString()} onChange={handleReservaChange} type="text" className="col-span-1" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label htmlFor="precio" className="text-right w-24">Precio:</Label>
                    {/* Convertir a string para el value de input, y a number para el cambio */}
                    <Input id="precio" value={editedReserva.precio.toString()} onChange={handleReservaChange} type="text" step="0.01" className="col-span-1" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label htmlFor="metodoPago" className="text-right w-24">Método Pago:</Label>
                    <Input id="metodoPago" value={editedReserva.metodoPago} onChange={handleReservaChange} type="text"  className="col-span-1" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label htmlFor="tipoPago" className="text-right w-24">Tipo Pago:</Label>
                    <Input id="tipoPago" value={editedReserva.tipoPago} onChange={handleReservaChange} type="text"  className="col-span-1" />
                  </div>
                  <div className="flex items-center gap-4 col-span-2">
                    <Label htmlFor="fechaReserva" className="text-right w-24">Fecha Reserva:</Label>
                    {/* Fecha de reserva suele ser readOnly */}
                    <Input id="fechaReserva" value={formatFecha(editedReserva.fechaReserva)} className="col-span-1" readOnly />
                  </div>
                </div>

                {/* --- Sección de Pasajeros --- */}
                <h3 className="text-lg font-semibold border-b pb-2 mb-2 mt-4">Pasajeros ({editedReserva.pasajeros.length})</h3>
                {editedReserva.pasajeros.length > 0 ? (
                  editedReserva.pasajeros.map((pasajero, index) => (
                    <div key={index} className="border p-4 rounded-md bg-gray-50 dark:bg-gray-800 mb-2 last:mb-0">
                      <h4 className="font-medium mb-2">Pasajero {index + 1}</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-4">
                          <Label htmlFor={`pasajeroNombre-${index}`} className="text-right w-24">Nombre:</Label>
                          <Input
                            id={`pasajeroNombre-${index}`}
                            value={pasajero.nombre}
                            onChange={(e) => handlePasajeroChange(index, 'nombre', e.target.value)}
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <Label htmlFor={`pasajeroApellido-${index}`} className="text-right w-24">Apellido:</Label>
                          <Input
                            id={`pasajeroApellido-${index}`}
                            value={pasajero.apellido}
                            onChange={(e) => handlePasajeroChange(index, 'apellido', e.target.value)}
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <Label htmlFor={`pasajeroDocTipo-${index}`} className="text-right w-24">Tipo Doc.:</Label>
                          <Input
                            id={`pasajeroDocTipo-${index}`}
                            value={pasajero.tipo_documento}
                            onChange={(e) => handlePasajeroChange(index, 'tipo_documento', e.target.value)}
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <Label htmlFor={`pasajeroDocNum-${index}`} className="text-right w-24">Nº Doc.:</Label>
                          <Input
                            id={`pasajeroDocNum-${index}`}
                            value={pasajero.numero_documento}
                            onChange={(e) => handlePasajeroChange(index, 'numero_documento', e.target.value)}
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <Label htmlFor={`pasajeroEmail-${index}`} className="text-right w-24">Email:</Label>
                          <Input
                            id={`pasajeroEmail-${index}`}
                            value={pasajero.email}
                            onChange={(e) => handlePasajeroChange(index, 'email', e.target.value)}
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <Label htmlFor={`pasajeroTel-${index}`} className="text-right w-24">Teléfono:</Label>
                          <Input
                            id={`pasajeroTel-${index}`}
                            value={pasajero.telefono}
                            onChange={(e) => handlePasajeroChange(index, 'telefono', e.target.value)}
                          />
                        </div>
                        <div className="flex items-center gap-4 col-span-2">
                          <Label htmlFor={`pasajeroNotas-${index}`} className="text-right w-24">Notas:</Label>
                          <Input
                            id={`pasajeroNotas-${index}`}
                            value={pasajero.notas || ''} // Si notas puede ser null/undefined, asegúrate de que sea string vacío
                            onChange={(e) => handlePasajeroChange(index, 'notas', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No hay pasajeros registrados para esta reserva.</p>
                )}
              </div>

              <DialogFooter className="mt-auto pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar cambios
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/* --- Fin del Dialog --- */}

        <DropdownMenuItem>View payment details</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}