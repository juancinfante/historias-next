"use client"

import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { CheckCircle2Icon, LoaderIcon, MoreHorizontal, Landmark, Handshake, Banknote } from "lucide-react"
 
import { Button } from "@/components/components/ui/button"
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/components/ui/dropdown-menu"
import { ArrowUpDown } from "lucide-react"
import { Badge } from "@/components/components/ui/badge"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type Payment = {
//   id: string
//   amount: number
//   status: "pending" | "processing" | "success" | "failed"
//   email: string
// }

// export const columns: ColumnDef<Payment>[] = [
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
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
