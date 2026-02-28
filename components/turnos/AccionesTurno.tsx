"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { CheckCircle, XCircle, UserX, CreditCard, Pencil, Trash2, Loader2 } from "lucide-react"
import { AppointmentStatus } from "@prisma/client"
import { actualizarTurno, eliminarTurno } from "@/lib/actions/turnos"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface AccionesTurnoProps {
  id: string
  status: AppointmentStatus
  isPaid: boolean
}

export function AccionesTurno({ id, status, isPaid }: AccionesTurnoProps) {
  const router = useRouter()
  const [loadingStatus, setLoadingStatus] = useState<AppointmentStatus | null>(null)
  const [loadingPago, setLoadingPago] = useState(false)
  const [loadingEliminar, setLoadingEliminar] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  async function cambiarEstado(nuevoEstado: AppointmentStatus) {
    setLoadingStatus(nuevoEstado)
    try {
      await actualizarTurno(id, { status: nuevoEstado })
      toast.success("Estado del turno actualizado.")
      router.refresh()
    } catch {
      toast.error("No se pudo actualizar el estado.")
    } finally {
      setLoadingStatus(null)
    }
  }

  async function togglePago() {
    setLoadingPago(true)
    try {
      await actualizarTurno(id, { isPaid: !isPaid })
      toast.success(isPaid ? "Marcado como pendiente." : "Marcado como pagado.")
      router.refresh()
    } catch {
      toast.error("No se pudo actualizar el estado de pago.")
    } finally {
      setLoadingPago(false)
    }
  }

  async function confirmarEliminar() {
    setLoadingEliminar(true)
    try {
      await eliminarTurno(id)
      toast.success("Turno eliminado.")
      router.push("/turnos")
    } catch {
      toast.error("No se pudo eliminar el turno.")
      setLoadingEliminar(false)
    }
  }

  const isClosed =
    status === "COMPLETED" || status === "CANCELLED" || status === "NO_SHOW"

  return (
    <div className="space-y-3">
      {/* Cambiar estado */}
      {!isClosed && (
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Cambiar estado
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => cambiarEstado("COMPLETED")}
              disabled={loadingStatus !== null}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors border",
                "bg-green-100 text-green-800 border-green-300 hover:bg-green-200",
                "dark:bg-green-900/30 dark:text-green-400 dark:border-green-700 dark:hover:bg-green-900/50",
                "disabled:pointer-events-none disabled:opacity-60"
              )}
            >
              {loadingStatus === "COMPLETED" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle className="h-3.5 w-3.5" />
              )}
              Completar
            </button>
            <button
              type="button"
              onClick={() => cambiarEstado("CANCELLED")}
              disabled={loadingStatus !== null}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors border",
                "bg-red-100 text-red-800 border-red-300 hover:bg-red-200",
                "dark:bg-red-900/30 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/50",
                "disabled:pointer-events-none disabled:opacity-60"
              )}
            >
              {loadingStatus === "CANCELLED" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <XCircle className="h-3.5 w-3.5" />
              )}
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => cambiarEstado("NO_SHOW")}
              disabled={loadingStatus !== null}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors border",
                "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
                "dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700",
                "disabled:pointer-events-none disabled:opacity-60"
              )}
            >
              {loadingStatus === "NO_SHOW" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <UserX className="h-3.5 w-3.5" />
              )}
              No se presentó
            </button>
          </div>
        </div>
      )}

      {/* Pago */}
      <div className="rounded-xl border bg-card p-4 space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Pago
        </p>
        <button
          type="button"
          onClick={togglePago}
          disabled={loadingPago}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors border",
            isPaid
              ? "bg-green-100 text-green-800 border-green-300 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600",
            "disabled:pointer-events-none disabled:opacity-60"
          )}
        >
          {loadingPago ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <CreditCard className="h-3.5 w-3.5" />
          )}
          {isPaid ? "Pagado — marcar como pendiente" : "Pendiente — marcar como pagado"}
        </button>
      </div>

      {/* Editar / Eliminar */}
      <div className="rounded-xl border bg-card p-4 space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Acciones
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/turnos/${id}/editar`}>
              <Pencil className="h-3.5 w-3.5" />
              Editar turno
            </Link>
          </Button>

          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-3.5 w-3.5" />
                Eliminar turno
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Eliminar turno</DialogTitle>
                <DialogDescription>
                  Esta acción no se puede deshacer. El turno será eliminado permanentemente del sistema.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={confirmarEliminar}
                  disabled={loadingEliminar}
                >
                  {loadingEliminar && <Loader2 className="h-4 w-4 animate-spin" />}
                  Eliminar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
