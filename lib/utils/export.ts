import { prisma } from "@/lib/db"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const STATUS_LABELS: Record<string, string> = {
  SCHEDULED: "Agendado",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
  NO_SHOW: "No se presentó",
}

export async function generateRevenueCSV(from: Date, to: Date): Promise<string> {
  const appointments = await prisma.appointment.findMany({
    where: {
      date: { gte: from, lte: to },
    },
    include: {
      client: true,
      services: { include: { service: true } },
    },
    orderBy: { date: "asc" },
  })

  const rows = appointments.map((apt) => {
    const servicios = apt.services.map((s) => s.service.name).join(" + ")
    return [
      format(apt.date, "dd/MM/yyyy", { locale: es }),
      apt.client.name,
      apt.client.phone ?? "",
      servicios,
      apt.totalPrice.toString(),
      STATUS_LABELS[apt.status] ?? apt.status,
      apt.isPaid ? "Sí" : "No",
      apt.notes ?? "",
    ]
      .map((v) => `"${v.replace(/"/g, '""')}"`)
      .join(",")
  })

  const header = [
    "Fecha",
    "Cliente",
    "Teléfono",
    "Servicios",
    "Total",
    "Estado",
    "Pagado",
    "Notas",
  ]
    .map((h) => `"${h}"`)
    .join(",")

  return [header, ...rows].join("\n")
}
