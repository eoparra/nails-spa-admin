"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

async function requireAuth() {
  const session = await auth()
  if (!session) throw new Error("No autorizado")
  return session
}

export async function crearServicio(data: {
  name: string
  duration: number
  price: number
  category?: string
  colorTag?: string
}) {
  await requireAuth()
  await prisma.service.create({ data })
  revalidatePath("/servicios")
}

export async function actualizarServicio(
  id: string,
  data: {
    name?: string
    duration?: number
    price?: number
    category?: string
    colorTag?: string
    isActive?: boolean
  }
) {
  await requireAuth()
  await prisma.service.update({ where: { id }, data })
  revalidatePath("/servicios")
}

export async function eliminarServicio(id: string) {
  await requireAuth()
  await prisma.service.update({ where: { id }, data: { isActive: false } })
  revalidatePath("/servicios")
}
