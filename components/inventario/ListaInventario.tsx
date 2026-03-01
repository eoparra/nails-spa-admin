"use client"

import { useState, useTransition, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { ajustarStock, eliminarItem } from "@/lib/actions/inventario"
import { Input } from "@/components/ui/input"
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
import { Minus, Plus, Pencil, Trash2, AlertTriangle, Package } from "lucide-react"
import { cn } from "@/lib/utils"

type Item = {
  id: string
  name: string
  category: string | null
  quantity: number
  minQuantity: number | null
}

interface ListaInventarioProps {
  items: Item[]
}

function StockControls({ item }: { item: Item }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function adjust(delta: number) {
    if (item.quantity + delta < 0) return
    startTransition(async () => {
      try {
        await ajustarStock(item.id, delta)
        router.refresh()
      } catch {
        toast.error("No se pudo actualizar el stock")
      }
    })
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => adjust(-1)}
        disabled={pending || item.quantity <= 0}
        className="h-7 w-7 rounded-md border flex items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Reducir"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span
        className={cn(
          "w-10 text-center font-semibold tabular-nums text-sm",
          item.minQuantity !== null && item.quantity <= item.minQuantity
            ? "text-destructive"
            : ""
        )}
      >
        {pending ? "…" : item.quantity}
      </span>
      <button
        onClick={() => adjust(1)}
        disabled={pending}
        className="h-7 w-7 rounded-md border flex items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Aumentar"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export function ListaInventario({ items }: ListaInventarioProps) {
  const [search, setSearch] = useState("")
  const router = useRouter()

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return items
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        (i.category?.toLowerCase().includes(q) ?? false)
    )
  }, [items, search])

  const lowStockCount = items.filter(
    (i) => i.minQuantity !== null && i.quantity <= i.minQuantity
  ).length

  async function handleDelete(id: string) {
    try {
      await eliminarItem(id)
      toast.success("Ítem eliminado")
      router.refresh()
    } catch {
      toast.error("No se pudo eliminar el ítem")
    }
  }

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, Item[]>()
    for (const item of filtered) {
      const key = item.category ?? "Sin categoría"
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(item)
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  return (
    <div className="space-y-4">
      {/* Search + low-stock summary */}
      <div className="flex items-center gap-3">
        <Input
          placeholder="Buscar por nombre o categoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        {lowStockCount > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4" />
            <span>{lowStockCount} con stock bajo</span>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
          <Package className="h-10 w-10 opacity-30" />
          <p className="text-sm">
            {search ? "No se encontraron ítems" : "No hay ítems en el inventario"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(([category, categoryItems]) => (
            <div key={category}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                {category}
              </h2>
              <div className="rounded-xl border divide-y overflow-hidden">
                {categoryItems.map((item) => {
                  const isLow =
                    item.minQuantity !== null && item.quantity <= item.minQuantity
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center justify-between gap-4 px-4 py-3 bg-card",
                        isLow && "bg-amber-50/50 dark:bg-amber-950/20"
                      )}
                    >
                      {/* Name + low stock badge */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">{item.name}</span>
                          {isLow && (
                            <span className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-400 shrink-0">
                              <AlertTriangle className="h-3 w-3" />
                              Stock bajo
                            </span>
                          )}
                        </div>
                        {item.minQuantity !== null && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Mínimo: {item.minQuantity}
                          </p>
                        )}
                      </div>

                      {/* Stock controls */}
                      <StockControls item={item} />

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                          <Link href={`/inventario/${item.id}/editar`}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar ítem?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Se eliminará <strong>{item.name}</strong> del inventario. Esta acción no se puede deshacer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => handleDelete(item.id)}
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
