"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

async function requireAuth() {
  const session = await auth()
  if (!session) throw new Error("No autorizado")
  return session
}

export async function crearCliente(data: {
  name: string
  phone?: string
  email?: string
  notes?: string
}) {
  await requireAuth()
  const client = await prisma.client.create({ data })
  revalidatePath("/clientes")
  return client
}

export async function actualizarCliente(
  id: string,
  data: {
    name?: string
    phone?: string
    email?: string
    notes?: string
  }
) {
  await requireAuth()
  await prisma.client.update({ where: { id }, data })
  revalidatePath("/clientes")
  revalidatePath(`/clientes/${id}`)
}

export async function eliminarCliente(id: string) {
  await requireAuth()
  await prisma.client.delete({ where: { id } })
  revalidatePath("/clientes")
}
