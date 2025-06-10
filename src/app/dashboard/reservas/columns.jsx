"use client"

import { CheckCircle2Icon, LoaderIcon, MoreHorizontal, Landmark, Handshake, Banknote, Loader2, Pencil, X, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/components/ui/button"
import { Badge } from "@/components/components/ui/badge"
import { Input } from "@/components/components/ui/input"
import { Label } from "@/components/components/ui/label"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/components/ui/alert-dialog"

// La función 'onRefreshData' se pasa como un argumento a la función de columnas
// Esto permite que el componente que define las columnas reciba una función para recargar datos
export const columns = (onRefreshData) => [ // MODIFICADO: Ahora 'columns' es una función que recibe onRefreshData
  {
    accessorKey: "codigo",
    header: "Codigo",
  },
  {
    accessorKey: "titulo",
    header: "Destino",
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
        {row.original.estado === "pagado" && (
          <CheckCircle2Icon className=" text-green-500" />
        )}
        {row.original.estado === "pendiente" && (
          <LoaderIcon />
        )}
        {row.original.estado === "cancelado" && (
          <X className="text-red-500" />
        )}
        <span>{row.original.estado}</span>
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
    header: "Ver/Editar",
    cell: ({ row }) => {
      const payment = row.original

      const [reserva, setReserva] = useState(payment);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [editedReserva, setEditedReserva] = useState(payment);
      const [isLoading, setIsLoading] = useState(false);
      const [pagos, setPagos] = useState(editedReserva.pagos || []);
      const [nuevoPago, setNuevoPago] = useState({ monto: '', metodo: 'efectivo', fecha: '' });

      const handleNuevoPagoChange = (e) => {
        const { name, value } = e.target;
        setNuevoPago((prev) => ({ ...prev, [name]: value }));
      };

      const agregarPago = () => {
        if (!nuevoPago.monto || !nuevoPago.fecha) {
          toast.error("Completa monto y fecha");
          return;
        }
        setPagos((prev) => [...prev, nuevoPago]);
        setNuevoPago({ monto: '', metodo: 'efectivo', fecha: '' });
      };

      const eliminarPago = (index) => {
        setPagos((prev) => prev.filter((_, i) => i !== index));
      };

      const formatFecha = (isoString) => {
        if (!isoString) return 'N/A';
        return new Date(isoString).toLocaleString();
      };

      const handleReservaChange = (e) => {
        const { id, value } = e.target;
        const fieldName = id;
        setEditedReserva(prev => ({ ...prev, [fieldName]: value }));
      };

      const handlePasajeroChange = (
        index,
        field,
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

        try {
          const updatePayload = {};

          if (editedReserva.estado !== reserva.estado) updatePayload.estado = editedReserva.estado;
          if (editedReserva.metodoPago !== reserva.metodoPago) updatePayload.metodoPago = editedReserva.metodoPago;
          if (editedReserva.cantidad !== reserva.cantidad) updatePayload.cantidad = editedReserva.cantidad;

          const editedPrecio = parseFloat(editedReserva.precio.toString().replace('$', ''));
          const originalPrecio = parseFloat(reserva.precio.toString().replace('$', ''));
          if (!isNaN(editedPrecio) && editedPrecio !== originalPrecio) updatePayload.precio = editedPrecio;

          if (editedReserva.tipoPago !== reserva.tipoPago) updatePayload.tipoPago = editedReserva.tipoPago;

          editedReserva.pasajeros.forEach((editedPasajero, index) => {
            const originalPasajero = reserva.pasajeros[index];
            if (originalPasajero) {
              for (const key in editedPasajero) {
                if (editedPasajero[key] !== originalPasajero[key]) {
                  updatePayload[`pasajeros.${index}.${key}`] = editedPasajero[key];
                }
              }
            }
          });

          const pagosIguales =
            pagos.length === (reserva.pagos?.length || 0) &&
            pagos.every((pago, index) => JSON.stringify(pago) === JSON.stringify(reserva.pagos[index]));

          if (!pagosIguales) updatePayload.pagos = pagos;

          if (Object.keys(updatePayload).length === 0) {
            toast.info("No se detectaron cambios para guardar.");
            setIsLoading(false);
            setIsModalOpen(false);
            return;
          }

          const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
          if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL no está definido.");

          const response = await fetch(`${baseUrl}/api/reservas/${reserva._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatePayload),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Error HTTP: ${response.status}`);
          }

          const updatedReservaFromServer = await response.json();
          setReserva(updatedReservaFromServer);
          setEditedReserva(updatedReservaFromServer);
          setPagos(updatedReservaFromServer.pagos || []);
          setIsModalOpen(false);
          if (onRefreshData) onRefreshData();

        } catch (error) {
          console.error('Error al actualizar la reserva:', error);
          toast.error(`Error al actualizar la reserva: ${error.message}`);
        } finally {
          setIsLoading(false);
        }

      };

      return (
        <>
          <Button onClick={() => setIsModalOpen(true)}>
            <Pencil className="h-4 w-4" />
          </Button>

          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto p-4">
              <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold">Detalles de la Reserva: {reserva.codigo}</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    &times;
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-y-auto p-4">
                  <div className="grid gap-4 py-4">
                    <h3 className="text-lg font-semibold border-b pb-2 mb-2">Información General</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="codigo">Destino:</Label>
                        <Input id="codigo" value={editedReserva.titulo} readOnly />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="codigo">Código:</Label>
                        <Input id="codigo" value={editedReserva.codigo} readOnly />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="estado">Estado:</Label>
                        <select
                          id="estado"
                          value={editedReserva.estado}
                          onChange={handleReservaChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="pagado">Pagado</option>
                          <option value="pendiente">Pendiente</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="cantidad">Cantidad:</Label>
                        <Input id="cantidad" type="number" value={editedReserva.cantidad} onChange={handleReservaChange} />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="precio">Precio:</Label>
                        <Input id="precio" type="text" value={editedReserva.precio} onChange={handleReservaChange} />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="metodoPago">Método Pago:</Label>
                        <select
                          id="metodoPago"
                          value={editedReserva.metodoPago}
                          onChange={handleReservaChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="efectivo">Efectivo</option>
                          <option value="mercado pago">Mercado Pago</option>
                          <option value="transferencia">Transferencia</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="tipoPago">Tipo Pago:</Label>
                        <select
                          id="tipoPago"
                          value={editedReserva.tipoPago}
                          onChange={handleReservaChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="total">Total</option>
                          <option value="reserva">Reserva</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-2 col-span-1 sm:col-span-2">
                        <Label htmlFor="fechaReserva">Fecha Reserva:</Label>
                        <Input id="fechaReserva" value={formatFecha(editedReserva.fechaReserva)} readOnly />
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold border-b pb-2 mb-2 mt-4">Pagos realizados</h3>

                    {pagos.length === 0 ? (
                      <p className="text-gray-500">No hay pagos registrados.</p>
                    ) : (
                      <div className="space-y-2">
                        {pagos.map((pago, index) => (
                          <div key={index} className="flex items-center gap-2 border p-2 rounded-md">
                            <span className="flex-1 text-sm">${pago.monto} - {pago.metodo} - {pago.fecha}</span>
                            <button
                              type="button"
                              onClick={() => eliminarPago(index)}
                              className="text-red-500 text-xs"
                            >
                              Eliminar
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Formulario para agregar pago */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                      <Input
                        name="monto"
                        placeholder="Monto"
                        value={nuevoPago.monto}
                        onChange={handleNuevoPagoChange}
                        type="number"
                      />
                      <select
                        name="metodo"
                        value={nuevoPago.metodo}
                        onChange={handleNuevoPagoChange}
                        className="border rounded-md p-2 text-sm"
                      >
                        <option value="efectivo">Efectivo</option>
                        <option value="mercado pago">Mercado Pago</option>
                        <option value="transferencia">Transferencia</option>
                        <option value="otro">Otro</option>
                      </select>
                      <Input
                        name="fecha"
                        type="date"
                        value={nuevoPago.fecha}
                        onChange={handleNuevoPagoChange}
                      />
                    </div>
                    <Button
                      type="button"
                      className="mt-2"
                      onClick={agregarPago}
                    >
                      Agregar Pago
                    </Button>

                    <h3 className="text-lg font-semibold border-b pb-2 mb-2 mt-4">Pasajeros ({reserva.pasajeros.length})</h3>
                    {editedReserva.pasajeros.length > 0 ? (
                      editedReserva.pasajeros.map((pasajero, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-700 p-4 rounded-md bg-gray-50 dark:bg-gray-800 mb-4">
                          <h4 className="font-medium mb-2">Pasajero {index + 1}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                              <Label htmlFor={`pasajeroNombre-${index}`}>Nombre:</Label>
                              <Input id={`pasajeroNombre-${index}`} value={pasajero.nombre} onChange={(e) => handlePasajeroChange(index, 'nombre', e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-2">
                              <Label htmlFor={`pasajeroApellido-${index}`}>Apellido:</Label>
                              <Input id={`pasajeroApellido-${index}`} value={pasajero.apellido} onChange={(e) => handlePasajeroChange(index, 'apellido', e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-2">
                              <Label htmlFor={`pasajeroDocTipo-${index}`}>Tipo Doc.:</Label>
                              <Input id={`pasajeroDocTipo-${index}`} value={pasajero.tipo_documento} onChange={(e) => handlePasajeroChange(index, 'tipo_documento', e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-2">
                              <Label htmlFor={`pasajeroDocNum-${index}`}>Nº Doc.:</Label>
                              <Input id={`pasajeroDocNum-${index}`} value={pasajero.numero_documento} onChange={(e) => handlePasajeroChange(index, 'numero_documento', e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-2">
                              <Label htmlFor={`pasajeroEmail-${index}`}>Email:</Label>
                              <Input id={`pasajeroEmail-${index}`} type="email" value={pasajero.email} onChange={(e) => handlePasajeroChange(index, 'email', e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-2">
                              <Label htmlFor={`pasajeroTel-${index}`}>Teléfono:</Label>
                              <Input id={`pasajeroTel-${index}`} type="tel" value={pasajero.telefono} onChange={(e) => handlePasajeroChange(index, 'telefono', e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-2 col-span-1 sm:col-span-2">
                              <Label htmlFor={`pasajeroNotas-${index}`}>Notas:</Label>
                              <Input id={`pasajeroNotas-${index}`} value={pasajero.notas || 'N/A'} readOnly />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">No hay pasajeros registrados para esta reserva.</p>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
                    <Button type="button" onClick={() => setIsModalOpen(false)} variant="outline">
                      Cerrar
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Guardar cambios
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )
    },
  },
  { // Le doy un nombre a la constante de la columna
    header: "Eliminar",
    id: "delete-action",
    cell: ({ row, table }) => {
      const reserva = row.original;
      const [isDeleting, setIsDeleting] = useState(false);

      // Necesitamos pasar la función onRefreshData desde el componente padre
      // Asumo que el `table` objeto o las propiedades del `cell` pueden tener una forma de acceder a esto.
      // Si no, tendrás que pasar `onRefreshData` como una prop a la `DataTable` y luego a las `columns`.
      // Por simplicidad, asumiré que se puede acceder como `table.options.meta?.onRefreshData`
      // (Esta es una convención común si usas TanStack Table con `meta` en sus opciones).

      const handleDeleteReserva = async (reservaId) => {
        setIsDeleting(true);
        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
          if (!baseUrl) {
            throw new Error("NEXT_PUBLIC_API_BASE_URL no está definido en las variables de entorno.");
          }

          const res = await fetch(`${baseUrl}/api/reservas/${reservaId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Error al eliminar la reserva');
          }

          if (onRefreshData) {
            onRefreshData(); // Llama a la función para refrescar los datos de la tabla
          }
        } catch (err) {
          console.error("Error al eliminar reserva:", err);
          toast.error(err.message || "Error al eliminar la reserva.");
        } finally {
          setIsDeleting(false);
        }
      };

      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Esto eliminará permanentemente la reserva seleccionada.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteReserva(reserva._id)} // <-- Llama la función de eliminación aquí
                disabled={isDeleting} // Opcional: deshabilita el botón de acción mientras elimina
              >
                Continuar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  }
];