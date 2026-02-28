"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { eliminarServicio, actualizarServicio } from "@/lib/actions/servicios"
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
import { Loader2, PowerOff, Power } from "lucide-react"

interface AccionesServicioProps {
  servicioId: string
  servicioNombre: string
  isActive: boolean
}

export function AccionesServicio({
  servicioId,
  servicioNombre,
  isActive,
}: AccionesServicioProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    setLoading(true)
    try {
      if (isActive) {
        await eliminarServicio(servicioId)
        toast.success(`Servicio "${servicioNombre}" desactivado`)
      } else {
        await actualizarServicio(servicioId, { isActive: true })
        toast.success(`Servicio "${servicioNombre}" activado`)
      }
      router.refresh()
    } catch (err) {
      console.error(err)
      toast.error("No se pudo actualizar el servicio. Intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={isActive ? "outline" : "secondary"}
          size="sm"
          disabled={loading}
          className="gap-1.5"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : isActive ? (
            <PowerOff className="h-3.5 w-3.5" />
          ) : (
            <Power className="h-3.5 w-3.5" />
          )}
          {isActive ? "Desactivar" : "Activar"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isActive ? "¿Desactivar servicio?" : "¿Activar servicio?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isActive ? (
              <>
                El servicio{" "}
                <strong className="text-foreground">{servicioNombre}</strong> ya
                no estará disponible para nuevos turnos.
              </>
            ) : (
              <>
                El servicio{" "}
                <strong className="text-foreground">{servicioNombre}</strong>{" "}
                volverá a estar disponible para nuevos turnos.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleToggle} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isActive ? "Sí, desactivar" : "Sí, activar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
