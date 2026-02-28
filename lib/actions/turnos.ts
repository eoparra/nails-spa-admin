"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { AppointmentStatus } from "@prisma/client"

async function requireAuth() {
  const session = await auth()
  if (!session) throw new Error("No autorizado")
  return session
}

export type ServiceSelection = {
  serviceId: string
  priceAtBooking: number
  durationAtBooking: number
}

export type CrearTurnoInput = {
  clientId: string
  date: string // ISO date string YYYY-MM-DD
  startTime: string // ISO datetime string
  services: ServiceSelection[]
  notes?: string
}

export async function crearTurno(input: CrearTurnoInput) {
  await requireAuth()

  const totalPrice = input.services.reduce((sum, s) => sum + s.priceAtBooking, 0)
  const totalDuration = input.services.reduce((sum, s) => sum + s.durationAtBooking, 0)

  const startTime = new Date(input.startTime)
  const endTime = new Date(startTime.getTime() + totalDuration * 60 * 1000)
  const date = new Date(input.date)

  const appointment = await prisma.appointment.create({
    data: {
      clientId: input.clientId,
      date,
      startTime,
      endTime,
      totalPrice,
      notes: input.notes,
      services: {
        create: input.services.map((s) => ({
          serviceId: s.serviceId,
          priceAtBooking: s.priceAtBooking,
          durationAtBooking: s.durationAtBooking,
        })),
      },
    },
  })

  revalidatePath("/turnos")
  revalidatePath("/calendario")
  revalidatePath("/dashboard")
  return appointment
}

export async function actualizarTurno(
  id: string,
  input: Partial<CrearTurnoInput> & {
    status?: AppointmentStatus
    isPaid?: boolean
  }
) {
  await requireAuth()

  const updateData: Record<string, unknown> = {}

  if (input.status !== undefined) updateData.status = input.status
  if (input.isPaid !== undefined) updateData.isPaid = input.isPaid
  if (input.notes !== undefined) updateData.notes = input.notes

  if (input.date) updateData.date = new Date(input.date)

  if (input.services && input.services.length > 0) {
    const totalPrice = input.services.reduce((sum, s) => sum + s.priceAtBooking, 0)
    const totalDuration = input.services.reduce((sum, s) => sum + s.durationAtBooking, 0)
    updateData.totalPrice = totalPrice

    if (input.startTime) {
      const startTime = new Date(input.startTime)
      const endTime = new Date(startTime.getTime() + totalDuration * 60 * 1000)
      updateData.startTime = startTime
      updateData.endTime = endTime
    }

    await prisma.appointmentService.deleteMany({ where: { appointmentId: id } })
    await prisma.appointmentService.createMany({
      data: input.services.map((s) => ({
        appointmentId: id,
        serviceId: s.serviceId,
        priceAtBooking: s.priceAtBooking,
        durationAtBooking: s.durationAtBooking,
      })),
    })
  } else if (input.startTime) {
    const existing = await prisma.appointment.findUnique({
      where: { id },
      include: { services: true },
    })
    if (existing) {
      const totalDuration = existing.services.reduce(
        (sum, s) => sum + s.durationAtBooking,
        0
      )
      const startTime = new Date(input.startTime)
      const endTime = new Date(startTime.getTime() + totalDuration * 60 * 1000)
      updateData.startTime = startTime
      updateData.endTime = endTime
    }
  }

  await prisma.appointment.update({ where: { id }, data: updateData })

  revalidatePath("/turnos")
  revalidatePath("/calendario")
  revalidatePath("/dashboard")
  revalidatePath(`/turnos/${id}`)
}

export async function eliminarTurno(id: string) {
  await requireAuth()
  await prisma.appointment.delete({ where: { id } })
  revalidatePath("/turnos")
  revalidatePath("/calendario")
  revalidatePath("/dashboard")
}
