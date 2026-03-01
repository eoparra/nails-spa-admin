"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { crearItem, actualizarItem } from "@/lib/actions/inventario"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface FormItemProps {
  initialData?: {
    id?: string
    name?: string
    category?: string
    quantity?: number
    minQuantity?: number | null
  }
  mode: "crear" | "editar"
}

export function FormItem({ initialData, mode }: FormItemProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    category: initialData?.category ?? "",
    quantity: initialData?.quantity ?? 0,
    minQuantity: initialData?.minQuantity ?? "",
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error("El nombre es obligatorio")
      return
    }
    setLoading(true)
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category.trim() || undefined,
        quantity: Number(form.quantity) || 0,
        minQuantity: form.minQuantity !== "" ? Number(form.minQuantity) : undefined,
      }
      if (mode === "crear") {
        await crearItem(payload)
        toast.success("Ítem creado")
      } else {
        await actualizarItem(initialData!.id!, payload)
        toast.success("Ítem actualizado")
      }
      router.push("/inventario")
      router.refresh()
    } catch {
      toast.error("Ocurrió un error. Intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle className="text-base">
          {mode === "crear" ? "Nuevo ítem" : "Editar ítem"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="name">
              Nombre <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej: Esmalte rojo rubí"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category">Categoría</Label>
            <Input
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Ej: Esmaltes, Herramientas, Consumibles..."
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="quantity">Stock actual</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min={0}
                value={form.quantity}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="minQuantity">
                Stock mínimo
                <span className="ml-1 text-xs text-muted-foreground">(alerta)</span>
              </Label>
              <Input
                id="minQuantity"
                name="minQuantity"
                type="number"
                min={0}
                value={form.minQuantity}
                onChange={handleChange}
                placeholder="Opcional"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "crear" ? "Crear ítem" : "Guardar cambios"}
            </Button>
            <Button type="button" variant="outline" disabled={loading} onClick={() => router.back()}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
