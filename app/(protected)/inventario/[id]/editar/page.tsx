import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { FormItem } from "@/components/inventario/FormItem"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function EditarItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await prisma.inventoryItem.findUnique({ where: { id } })
  if (!item) notFound()

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/inventario">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Editar ítem</h1>
      </div>
      <FormItem
        mode="editar"
        initialData={{
          id: item.id,
          name: item.name,
          category: item.category ?? undefined,
          quantity: item.quantity,
          minQuantity: item.minQuantity,
        }}
      />
    </div>
  )
}
