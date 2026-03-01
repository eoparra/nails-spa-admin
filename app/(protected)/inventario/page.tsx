import { prisma } from "@/lib/db"
import { ListaInventario } from "@/components/inventario/ListaInventario"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function InventarioPage() {
  const items = await prisma.inventoryItem.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  })

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventario</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {items.length} {items.length === 1 ? "ítem" : "ítems"} en total
          </p>
        </div>
        <Button asChild>
          <Link href="/inventario/nuevo">
            <Plus className="h-4 w-4 mr-1.5" />
            Nuevo ítem
          </Link>
        </Button>
      </div>

      <ListaInventario items={items} />
    </div>
  )
}
