"use client"

import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { CheckCircle2Icon, LoaderIcon, MoreHorizontal, Landmark, Handshake, Banknote, Loader2, Pencil } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/components/ui/button"
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/components/ui/dialog"
import { Badge } from "@/components/components/ui/badge"
import { Input } from "@/components/components/ui/input"
import { Label } from "@/components/components/ui/label"
import { useState } from "react"

export const columns = [
  {
    accessorKey: "codigo",
    header: "Codigo",
  },
  {
    accessorKey: "precio",
    header: () => <div className="">Precio</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("precio"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className=" font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "metodoPago",
    header: "Método de Pago",
    cell: ({ row }) => {
      const payment = row.original
      return (
        <Badge variant="outline">
          {payment.metodoPago === "efectivo" && (
            <Banknote className=" text-green-500" />
          )}
          {payment.metodoPago === "mercado pago" && (
            <Handshake className=" text-blue-500" />
          )}
          {payment.metodoPago === "transferencia" && (
            <Landmark className=" text-black" />
          )}
          <span>{payment.metodoPago}</span>
        </Badge>
      )
    },
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.estado === "confirmado" ? (
          <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
        ) : (
          <LoaderIcon />
        )}
        {row.getValue("estado")}
      </Badge>
    ),
  },
  {
    accessorKey: "tipoPago",
    header: "Tipo de Pago",
  },
  {
    accessorKey: "cantidad",
    header: "Cantidad",
  },
  {
    accessorKey: "fechaReserva",
    header: "Fecha de Reserva",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original

      const [reserva, setReserva] = useState(payment);
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const [editedReserva, setEditedReserva] = useState(payment);
      const [isLoading, setIsLoading] = useState(false);
      // Función para formatear la fecha a un formato legible
      const formatFecha = (isoString) => {
        return new Date(isoString).toLocaleString(); // O el formato que prefieras
      };

      // Manejador de cambio para campos generales de la reserva
      const handleReservaChange = (e) => {
        const { id, value } = e.target;
        // El id del input debe coincidir con el nombre del campo de la reserva
        setEditedReserva(prev => ({ ...prev, [id]: value }));
      };

      // Manejador de cambio para campos de pasajeros
      const handlePasajeroChange = (
        index,
        field, // 'nombre', 'apellido', etc.
        value
      ) => {
        setEditedReserva(prev => {
          const newPasajeros = [...prev.pasajeros];
          newPasajeros[index] = { ...newPasajeros[index], [field]: value };
          return { ...prev, pasajeros: newPasajeros };
        });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log("first")
        try {
          // Construir el objeto de datos a enviar al backend
          // Aquí es donde creamos el objeto con las rutas de punto "pasajeros.0.nombre"
          const updatePayload = {};

          // Comparar editedReserva con reserva para enviar solo los cambios
          // Esto es más eficiente, pero por simplicidad inicial, enviaremos todos los campos editables
          // Puedes implementar una lógica de diff más compleja aquí si lo necesitas.

          // Campos generales (ejemplo: estado, metodoPago, etc.)
          // Simplemente itera sobre los campos que podrían cambiar
          if (editedReserva.estado !== reserva.estado) {
            updatePayload.estado = editedReserva.estado;
          }
          if (editedReserva.metodoPago !== reserva.metodoPago) {
            updatePayload.metodoPago = editedReserva.metodoPago;
          }
          // ... agrega más campos generales si son editables

          // Campos de pasajeros
          editedReserva.pasajeros.forEach((editedPasajero, index) => {
            const originalPasajero = reserva.pasajeros[index];
            if (originalPasajero) { // Asegurarse de que el pasajero existe en el original
              // Itera sobre los campos de cada pasajero
              for (const key in editedPasajero) {
                const field = key;
                if (editedPasajero[field] !== originalPasajero[field]) {
                  updatePayload[`pasajeros.${index}.${field}`] = editedPasajero[field];
                }
              }
            }
          });

          // Si no hay cambios, no hagas la llamada API
          if (Object.keys(updatePayload).length === 0) {
            toast.info("No se detectaron cambios para guardar.");
            setIsLoading(false);
            setIsDialogOpen(false); // Cierra el diálogo
            return;
          }

          // Asegúrate de que la URL base esté configurada para el cliente
          const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
          if (!baseUrl) {
            throw new Error("NEXT_PUBLIC_API_BASE_URL no está definido en las variables de entorno.");
          }

          const response = await fetch(`${baseUrl}/api/reservas/${reserva._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatePayload), // Envía solo los campos modificados
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Error HTTP: ${response.status}`);
          }

          const updatedReservaFromServer = await response.json();
          setReserva(updatedReservaFromServer); // Actualiza el estado local con la reserva fresca del servidor
          setEditedReserva(updatedReservaFromServer); // También actualiza los datos editables

          toast.success("Reserva actualizada exitosamente.");
          setIsDialogOpen(false); // Cierra el diálogo después de guardar

          // // Si se proporciona una función de callback, llámala para notificar al componente padre
          // if (onReservaUpdated) {
          //   onReservaUpdated(updatedReservaFromServer);
          // }

        } catch (error) {
          console.error('Error al actualizar la reserva:', error);
          toast.error(`Error al actualizar la reserva: ${error.message}`);
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <>
        {/* Botón para abrir el diálogo */}
      <Button onClick={() => setIsDialogOpen(true)}>
        <Pencil />
      </Button>
        {/* --- Dialog para ver detalles de la reserva --- */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="sm:max-w-xl flex flex-col max-h-[90vh]"> {/* Aumentado el ancho para más contenido */}
                <DialogHeader>
                  <DialogTitle>Detalles de la Reserva: {reserva.codigo}</DialogTitle>
                  <DialogDescription>
                    Información completa de la reserva y sus pasajeros.
                  </DialogDescription>
                </DialogHeader>
                {/* Formulario de edición */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-y-auto pr-4 -mr-4">
                  <div className="grid gap-4 py-4 flex-grow overflow-y-auto pr-4 -mr-4">
                    {/* Información General de la Reserva */}
                    <h3 className="text-lg font-semibold border-b pb-2 mb-2">Información General</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-4">
                        <Label htmlFor="reservaCodigo" className="text-right w-24">Código:</Label>
                        <Input id="reservaCodigo" value={editedReserva.codigo} className="col-span-1" readOnly />
                      </div>
                      <div className="flex items-center gap-4">
                        <Label htmlFor="reservaEstado" className="text-right w-24">Estado:</Label>
                        <Input id="reservaEstado" value={editedReserva.estado} onChange={handleReservaChange} className="col-span-1" />
                      </div>
                      <div className="flex items-center gap-4">
                        <Label htmlFor="reservaCantidad" className="text-right w-24">Cantidad:</Label>
                        <Input id="reservaCantidad" value={editedReserva.cantidad} onChange={handleReservaChange} className="col-span-1" />
                      </div>
                      <div className="flex items-center gap-4">
                        <Label htmlFor="reservaPrecio" className="text-right w-24">Precio:</Label>
                        <Input id="reservaPrecio" value={`$${editedReserva.precio}`} onChange={handleReservaChange} className="col-span-1" />
                      </div>
                      <div className="flex items-center gap-4">
                        <Label htmlFor="reservaMetodoPago" className="text-right w-24">Método Pago:</Label>
                        <Input id="reservaMetodoPago" value={editedReserva.metodoPago} onChange={handleReservaChange} className="col-span-1" />
                      </div>
                      <div className="flex items-center gap-4">
                        <Label htmlFor="reservaTipoPago" className="text-right w-24">Tipo Pago:</Label>
                        <Input id="reservaTipoPago" value={editedReserva.tipoPago} onChange={handleReservaChange} className="col-span-1" />
                      </div>
                      <div className="flex items-center gap-4 col-span-2">
                        <Label htmlFor="reservaFecha" className="text-right w-24">Fecha Reserva:</Label>
                        <Input id="reservaFecha" value={formatFecha(editedReserva.fechaReserva)} onChange={handleReservaChange} className="col-span-1" readOnly />
                      </div>
                    </div>

                    {/* --- Sección de Pasajeros --- */}
                    <h3 className="text-lg font-semibold border-b pb-2 mb-2 mt-4">Pasajeros ({reserva.pasajeros.length})</h3>
                    {editedReserva.pasajeros.length > 0 ? (
                      editedReserva.pasajeros.map((pasajero, index) => (
                        <div key={index} className="border p-4 rounded-md bg-gray-50 dark:bg-gray-800">
                          <h4 className="font-medium mb-2">Pasajero {index + 1}</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-4">
                              <Label htmlFor={`pasajeroNombre-${index}`} className="text-right w-24">Nombre:</Label>
                              <input type="text" id={`pasajeroNombre-${index}`} value={pasajero.nombre} onChange={(e) => handlePasajeroChange(index, 'nombre', e.target.value)} />
                            </div>
                            <div className="flex items-center gap-4">
                              <Label htmlFor={`pasajeroApellido-${index}`} className="text-right w-24">Apellido:</Label>
                              <Input id={`pasajeroApellido-${index}`} value={pasajero.apellido} onChange={(e) => handlePasajeroChange(index, 'apellido', e.target.value)} />
                            </div>
                            <div className="flex items-center gap-4">
                              <Label htmlFor={`pasajeroDocTipo-${index}`} className="text-right w-24">Tipo Doc.:</Label>
                              <Input id={`pasajeroDocTipo-${index}`} value={pasajero.tipo_documento} onChange={(e) => handlePasajeroChange(index, 'tipo_documento', e.target.value)} />
                            </div>
                            <div className="flex items-center gap-4">
                              <Label htmlFor={`pasajeroDocNum-${index}`} className="text-right w-24">Nº Doc.:</Label>
                              <Input id={`pasajeroDocNum-${index}`} value={pasajero.numero_documento} onChange={(e) => handlePasajeroChange(index, 'numero_documento', e.target.value)} />
                            </div>
                            <div className="flex items-center gap-4">
                              <Label htmlFor={`pasajeroEmail-${index}`} className="text-right w-24">Email:</Label>
                              <Input id={`pasajeroEmail-${index}`} value={pasajero.email} onChange={(e) => handlePasajeroChange(index, 'email', e.target.value)} />
                            </div>
                            <div className="flex items-center gap-4">
                              <Label htmlFor={`pasajeroTel-${index}`} className="text-right w-24">Teléfono:</Label>
                              <Input id={`pasajeroTel-${index}`} value={pasajero.telefono} onChange={(e) => handlePasajeroChange(index, 'telefono', e.target.value)} />
                            </div>
                            <div className="flex items-center gap-4 col-span-2">
                              <Label htmlFor={`pasajeroNotas-${index}`} className="text-right w-24">Notas:</Label>
                              <Input id={`pasajeroNotas-${index}`} value={pasajero.notas || 'N/A'} readOnly />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">No hay pasajeros registrados para esta reserva.</p>
                    )}
                  </div>

                  <DialogFooter>
                    <Button type="button" onClick={() => setIsDialogOpen(false)}>Cerrar</Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Guardar cambios
                    </Button>
                  </DialogFooter>
                </form>
                {/* Fin del formulario de edición */}
              </DialogContent>
            </Dialog>
            {/* --- Fin del Dialog --- */}
        </>
      )
    },
  },
]


// Este archivo NO necesita "use client" si solo define las columnas.
// "use client"
// import { MoreHorizontal, Landmark, Handshake, Banknote, CheckCircle2Icon, LoaderIcon } from "lucide-react";
// import { Button } from "@/components/components/ui/button";
// import {
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
// } from "@/components/components/ui/dropdown-menu";
// import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"; // Asegúrate de que esta importación sea correcta para DropdownMenu y DropdownMenuTrigger
// import { Badge } from "@/components/components/ui/badge";

// // Importa el nuevo componente ReservaActions
// import { ReservaActions } from '@/components/ReservaActions'; // Ajusta la ruta si es diferente

// // Define las interfaces aquí o impórtalas desde un archivo de tipos si ya las tienes
// interface Pasajero {
//   nombre: string;
//   apellido: string;
//   tipo_documento: string;
//   numero_documento: string;
//   email: string;
//   telefono: string;
//   notas: string;
// }

// export interface Reserva {
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

// export const columns = [
//   {
//     accessorKey: "codigo",
//     header: "Codigo",
//   },
//   {
//     accessorKey: "precio",
//     header: () => <div className="">Precio</div>,
//     cell: ({ row }) => {
//       const amount = parseFloat(row.getValue("precio"));
//       const formatted = new Intl.NumberFormat("en-US", {
//         style: "currency",
//         currency: "USD",
//       }).format(amount);
//       return <div className=" font-medium">{formatted}</div>;
//     },
//   },
//   {
//     accessorKey: "metodoPago",
//     header: "Método de Pago",
//     cell: ({ row }) => {
//       const payment = row.original as Reserva; // Castea a Reserva para tipado
//       return (
//         <Badge variant="outline">
//           {payment.metodoPago === "efectivo" && (
//             <Banknote className=" text-green-500" />
//           )}
//           {payment.metodoPago === "mercado pago" && (
//             <Handshake className=" text-blue-500" />
//           )}
//           {payment.metodoPago === "transferencia" && (
//             <Landmark className=" text-black" />
//           )}
//           <span>{payment.metodoPago}</span>
//         </Badge>
//       );
//     },
//   },
//   {
//     accessorKey: "estado",
//     header: "Estado",
//     cell: ({ row }) => (
//       <Badge variant="outline">
//         {row.original.estado === "confirmado" ? (
//           <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
//         ) : (
//           <LoaderIcon />
//         )}
//         {row.getValue("estado")}
//       </Badge>
//     ),
//   },
//   {
//     accessorKey: "tipoPago",
//     header: "Tipo de Pago",
//   },
//   {
//     accessorKey: "cantidad",
//     header: "Cantidad",
//   },
//   {
//     accessorKey: "fechaReserva",
//     header: "Fecha de Reserva",
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const reserva = row.original as Reserva; // Pasamos la reserva completa

//       // Aquí podrías tener una función para actualizar la tabla si la reserva cambia
//       // const handleReservaUpdated = (updatedReserva: Reserva) => {
//       //   // Por ejemplo, podrías recargar los datos de la tabla o actualizar una fila específica
//       //   console.log('Reserva actualizada en la tabla:', updatedReserva);
//       // };

//       return (
//         // Renderiza el componente de acciones dedicado
//         <ReservaActions
//           reserva={reserva}
//           // onReservaUpdated={handleReservaUpdated} // Pasa el callback si lo necesitas
//         />
//       );
//     },
//   },
// ];