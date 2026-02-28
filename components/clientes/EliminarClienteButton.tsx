"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { eliminarCliente } from "@/lib/actions/clientes"
import { Button } from "@/components/ui/button"
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
} from "@/components/ui/alert-dialog"
import { Trash2, Loader2 } from "lucide-react"

interface EliminarClienteButtonProps {
  clienteId: string
  clienteNombre: string
}

export function EliminarClienteButton({
  clienteId,
  clienteNombre,
}: EliminarClienteButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleEliminar() {
    setLoading(true)
    try {
      await eliminarCliente(clienteId)
      toast.success(`Cliente "${clienteNombre}" eliminada`)
      router.push("/clientes")
    } catch (err) {
      console.error(err)
      toast.error("No se pudo eliminar la cliente. Intente nuevamente.")
      setLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="mr-2 h-4 w-4" />
          )}
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
          <AlertDialogDescription>
            Estás a punto de eliminar a{" "}
            <strong className="text-foreground">{clienteNombre}</strong>. Esta
            acción no se puede deshacer y también eliminará todos sus turnos
            asociados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleEliminar}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sí, eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
