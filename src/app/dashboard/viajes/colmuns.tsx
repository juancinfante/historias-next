"use client"

import { Button } from "@/components/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Link, Loader2, MoreHorizontalIcon, Pencil, Trash2 } from "lucide-react"
import { MoreHorizontal } from "lucide-react"
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
import { useRouter } from "next/navigation"
import { useState } from "react"
import { set } from "react-hook-form"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type Payment = {
//   id: string
//   amount: number
//   status: "pending" | "processing" | "success" | "failed"
//   email: string
// }


export const columns = [
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "origen",
    header: "Origen",
  },
  {
    accessorKey: "destino",
    header: "Destino",
  },
  {
    accessorKey: "precio",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Precio
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    header: "Ver/Editar",
    cell: ({ row }) => {
      const payment = row.original
      const router = useRouter()
      const [isLoading, setIsLoading] = useState(false);

      return (
        <Button
          disabled={isLoading}
          onClick={() => {
            setIsLoading(true);
            router.push(`/dashboard/viajes/${payment._id}`)
          }}
          className="hover-pointer">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Pencil className="h-4 w-4n" />
          )}

        </Button>
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

          const res = await fetch(`${baseUrl}/api/admin/trips/${reservaId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Error al eliminar la reserva');
          }
          // F5 aquí
          window.location.reload();

        } catch (err) {
          console.error("Error al eliminar reserva:", err);
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

]
