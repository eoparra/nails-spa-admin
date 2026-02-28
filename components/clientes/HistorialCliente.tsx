"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate, formatPrice } from "@/lib/utils/formatters"
import { CheckCircle2, XCircle } from "lucide-react"

const etiquetasEstado: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  IN_PROGRESS: "En curso",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
  NO_SHOW: "No se presentó",
}

const variantesEstado: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  IN_PROGRESS: "default",
  COMPLETED: "default",
  CANCELLED: "destructive",
  NO_SHOW: "destructive",
}

interface Appointment {
  id: string
  date: Date
  startTime: Date
  status: string
  totalPrice: { toString(): string }
  isPaid: boolean
  services: Array<{ service: { name: string } }>
}

interface HistorialClienteProps {
  appointments: Appointment[]
}

export function HistorialCliente({ appointments }: HistorialClienteProps) {
  if (appointments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        Esta cliente aún no tiene turnos registrados.
      </p>
    )
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Servicios</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-center">Pagado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appt) => (
            <TableRow key={appt.id} className="hover:bg-muted/50">
              <TableCell className="whitespace-nowrap">
                <Link
                  href={`/turnos/${appt.id}`}
                  className="font-medium hover:underline text-primary"
                >
                  {formatDate(appt.date)}
                </Link>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {appt.services.length > 0
                    ? appt.services
                        .map((s) => s.service.name)
                        .join(", ")
                    : "—"}
                </span>
              </TableCell>
              <TableCell className="text-right font-medium whitespace-nowrap">
                {formatPrice(appt.totalPrice)}
              </TableCell>
              <TableCell>
                <Badge variant={variantesEstado[appt.status] ?? "secondary"}>
                  {etiquetasEstado[appt.status] ?? appt.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                {appt.isPaid ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground mx-auto" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
