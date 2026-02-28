"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { crearServicio, actualizarServicio } from "@/lib/actions/servicios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface FormServicioProps {
  initialData?: {
    id?: string
    name?: string
    duration?: number
    price?: number
    category?: string
    colorTag?: string
  }
  mode: "crear" | "editar"
}

export function FormServicio({ initialData, mode }: FormServicioProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: initialData?.name ?? "",
    duration: initialData?.duration?.toString() ?? "",
    price: initialData?.price?.toString() ?? "",
    category: initialData?.category ?? "",
    colorTag: initialData?.colorTag ?? "#f9a8d4",
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error("El nombre del servicio es obligatorio")
      return
    }

    const duration = parseInt(formData.duration, 10)
    const price = parseFloat(formData.price)

    if (!formData.duration || isNaN(duration) || duration <= 0) {
      toast.error("Ingresá una duración válida en minutos")
      return
    }

    if (!formData.price || isNaN(price) || price < 0) {
      toast.error("Ingresá un precio válido")
      return
    }

    setLoading(true)

    try {
      const payload = {
        name: formData.name.trim(),
        duration,
        price,
        category: formData.category.trim() || undefined,
        colorTag: formData.colorTag || undefined,
      }

      if (mode === "crear") {
        await crearServicio(payload)
        toast.success("Servicio creado exitosamente")
      } else {
        if (!initialData?.id) throw new Error("ID no disponible")
        await actualizarServicio(initialData.id, payload)
        toast.success("Servicio actualizado exitosamente")
      }

      router.push("/servicios")
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
          {mode === "crear" ? "Datos del servicio" : "Editar servicio"}
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
              placeholder="Ej: Manicura semipermanente"
              disabled={loading}
              required
            />
          </div>

          {/* Duración */}
          <div className="space-y-1.5">
            <Label htmlFor="duration">
              Duración (minutos) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              min={1}
              step={5}
              value={formData.duration}
              onChange={handleChange}
              placeholder="60"
              disabled={loading}
              required
            />
          </div>

          {/* Precio */}
          <div className="space-y-1.5">
            <Label htmlFor="price">
              Precio <span className="text-destructive">*</span>
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              min={0}
              step={0.01}
              value={formData.price}
              onChange={handleChange}
              placeholder="5000"
              disabled={loading}
              required
            />
          </div>

          {/* Categoría */}
          <div className="space-y-1.5">
            <Label htmlFor="category">Categoría</Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Ej: Manos, Pies, Diseño..."
              disabled={loading}
            />
          </div>

          {/* Color */}
          <div className="space-y-1.5">
            <Label htmlFor="colorTag">Color identificador</Label>
            <div className="flex items-center gap-3">
              <input
                id="colorTag"
                name="colorTag"
                type="color"
                value={formData.colorTag}
                onChange={handleChange}
                disabled={loading}
                className="h-9 w-14 cursor-pointer rounded-md border border-input bg-transparent p-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <span className="text-sm text-muted-foreground">
                {formData.colorTag}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "crear" ? "Crear servicio" : "Guardar cambios"}
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
