"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { crearCliente, actualizarCliente } from "@/lib/actions/clientes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface FormClienteProps {
  initialData?: {
    id?: string
    name?: string
    phone?: string
    email?: string
    notes?: string
  }
  mode: "crear" | "editar"
}

export function FormCliente({ initialData, mode }: FormClienteProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: initialData?.name ?? "",
    phone: initialData?.phone ?? "",
    email: initialData?.email ?? "",
    notes: initialData?.notes ?? "",
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error("El nombre es obligatorio")
      return
    }

    setLoading(true)

    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim() || undefined,
        email: formData.email.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      }

      if (mode === "crear") {
        const cliente = await crearCliente(payload)
        toast.success("Cliente creada exitosamente")
        router.push(`/clientes/${cliente.id}`)
      } else {
        if (!initialData?.id) throw new Error("ID no disponible")
        await actualizarCliente(initialData.id, payload)
        toast.success("Cliente actualizada exitosamente")
        router.push(`/clientes/${initialData.id}`)
      }
    } catch (err) {
      console.error(err)
      toast.error("Ocurrió un error. Intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle className="text-base">
          {mode === "crear" ? "Datos de la cliente" : "Editar datos"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
          <div className="space-y-1.5">
            <Label htmlFor="name">
              Nombre <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre completo"
              disabled={loading}
              required
            />
          </div>

          {/* Teléfono */}
          <div className="space-y-1.5">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+54 9 11 1234-5678"
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              disabled={loading}
            />
          </div>

          {/* Notas */}
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Observaciones, alergias, preferencias..."
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "crear" ? "Crear cliente" : "Guardar cambios"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
