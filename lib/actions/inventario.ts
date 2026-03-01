"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

async function requireAuth() {
  const session = await auth()
  if (!session) throw new Error("No autorizado")
}

export async function crearItem(data: {
  name: string
  category?: string
  quantity: number
  minQuantity?: number
}) {
  await requireAuth()
  await prisma.inventoryItem.create({ data })
  revalidatePath("/inventario")
}

export async function actualizarItem(
  id: string,
  data: {
    name?: string
    category?: string
    quantity?: number
    minQuantity?: number
  }
) {
  await requireAuth()
  await prisma.inventoryItem.update({ where: { id }, data })
  revalidatePath("/inventario")
}

export async function ajustarStock(id: string, delta: number) {
  await requireAuth()
  await prisma.inventoryItem.update({
    where: { id },
    data: { quantity: { increment: delta } },
  })
  revalidatePath("/inventario")
}

export async function eliminarItem(id: string) {
  await requireAuth()
  await prisma.inventoryItem.delete({ where: { id } })
  revalidatePath("/inventario")
}
