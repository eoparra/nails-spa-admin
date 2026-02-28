import { prisma } from "@/lib/db"
import { CalendarioTurnos, type CalendarEvent } from "@/components/calendar/CalendarioTurnos"
import { subMonths, addMonths } from "date-fns"

export default async function CalendarioPage() {
  const from = subMonths(new Date(), 1)
  const to = addMonths(new Date(), 2)

  const appointments = await prisma.appointment.findMany({
    where: { date: { gte: from, lte: to } },
    include: { client: true, services: { include: { service: true } } },
    orderBy: { startTime: "asc" },
  })

  const events: CalendarEvent[] = appointments.map((apt) => ({
    id: apt.id,
    title: `${apt.client.name} · ${apt.services.map((s) => s.service.name).join(", ")}`,
    start: apt.startTime,
    end: apt.endTime,
    status: apt.status,
    clientName: apt.client.name,
  }))

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Calendario</h1>
      </div>
      <CalendarioTurnos events={events} />
    </div>
  )
}
