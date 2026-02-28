"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BuscadorCliente } from "@/components/clientes/BuscadorCliente"
import { crearTurno, actualizarTurno } from "@/lib/actions/turnos"
import { formatDuration, formatPrice } from "@/lib/utils/formatters"
import { cn } from "@/lib/utils"

interface Servicio {
  id: string
  name: string
  duration: number
  price: number
  category?: string | null
  colorTag?: string | null
}

interface Cliente {
  id: string
  name: string
  phone?: string | null
}

interface FormTurnoProps {
  clientes: Cliente[]
  servicios: Servicio[]
  initialData?: {
    id?: string
    clientId?: string
    date?: string
    startTime?: string
    notes?: string
    selectedServices?: string[]
  }
  mode: "crear" | "editar"
}

function getTodayString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function FormTurno({ clientes, servicios, initialData, mode }: FormTurnoProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [clientId, setClientId] = useState(initialData?.clientId ?? "")
  const [date, setDate] = useState(initialData?.date ?? getTodayString())
  const [time, setTime] = useState(initialData?.startTime ?? "10:00")
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(
    initialData?.selectedServices ?? []
  )
  const [notes, setNotes] = useState(initialData?.notes ?? "")

  // Computed totals based on selected services
  const selectedServicios = servicios.filter((s) => selectedServiceIds.includes(s.id))
  const totalPrecio = selectedServicios.reduce((sum, s) => sum + s.price, 0)
  const totalDuracion = selectedServicios.reduce((sum, s) => sum + s.duration, 0)

  function toggleServicio(id: string) {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!clientId) {
      toast.error("Por favor seleccioná un cliente.")
      return
    }
    if (selectedServiceIds.length === 0) {
      toast.error("Por favor seleccioná al menos un servicio.")
      return
    }

    setLoading(true)

    const startTimeISO = new Date(`${date}T${time}`).toISOString()
    const services = selectedServicios.map((s) => ({
      serviceId: s.id,
      priceAtBooking: s.price,
      durationAtBooking: s.duration,
    }))

    try {
      if (mode === "crear") {
        const appointment = await crearTurno({
          clientId,
          date,
          startTime: startTimeISO,
          services,
          notes: notes.trim() || undefined,
        })
        toast.success("Turno creado correctamente.")
        router.push(`/turnos/${appointment.id}`)
      } else {
        if (!initialData?.id) throw new Error("ID de turno no encontrado.")
        await actualizarTurno(initialData.id, {
          clientId,
          date,
          startTime: startTimeISO,
          services,
          notes: notes.trim() || undefined,
        })
        toast.success("Turno actualizado correctamente.")
        router.push(`/turnos/${initialData.id}`)
      }
    } catch (error) {
      console.error(error)
      toast.error("Ocurrió un error. Intentá de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Cliente */}
      <div className="space-y-1.5">
        <Label>
          Cliente <span className="text-destructive">*</span>
        </Label>
        <BuscadorCliente
          clientes={clientes}
          value={clientId}
          onChange={setClientId}
          placeholder="Seleccioná un cliente..."
        />
      </div>

      {/* Fecha y hora */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="fecha">
            Fecha <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fecha"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hora">
            Hora de inicio <span className="text-destructive">*</span>
          </Label>
          <Input
            id="hora"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Servicios */}
      <div className="space-y-2">
        <Label>
          Servicios <span className="text-destructive">*</span>
        </Label>
        <div className="rounded-md border divide-y">
          {servicios.map((servicio) => {
            const checked = selectedServiceIds.includes(servicio.id)
            return (
              <label
                key={servicio.id}
                className={cn(
                  "flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors",
                  "hover:bg-muted/50",
                  checked && "bg-muted/30"
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleServicio(servicio.id)}
                  className="mt-0.5 h-4 w-4 rounded border-input accent-primary"
                />
                <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{servicio.name}</p>
                    {servicio.category && (
                      <p className="text-xs text-muted-foreground">{servicio.category}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium">{formatPrice(servicio.price)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDuration(servicio.duration)}
                    </p>
                  </div>
                </div>
              </label>
            )
          })}
        </div>

        {/* Totales de servicios seleccionados */}
        {selectedServiceIds.length > 0 && (
          <div className="rounded-md bg-muted/50 px-4 py-2.5 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {selectedServiceIds.length}{" "}
              {selectedServiceIds.length === 1 ? "servicio" : "servicios"} &middot;{" "}
              {formatDuration(totalDuracion)}
            </span>
            <span className="font-semibold">{formatPrice(totalPrecio)}</span>
          </div>
        )}
      </div>

      {/* Notas */}
      <div className="space-y-1.5">
        <Label htmlFor="notas">Notas</Label>
        <Textarea
          id="notas"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Observaciones, preferencias del cliente, etc."
          rows={3}
        />
      </div>

      {/* Submit */}
      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {mode === "crear" ? "Guardar turno" : "Actualizar turno"}
      </Button>
    </form>
  )
}
