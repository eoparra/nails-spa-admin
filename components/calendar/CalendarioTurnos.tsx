"use client"

import { Calendar, dateFnsLocalizer, Views, type View } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { es } from "date-fns/locale"
import { useState } from "react"
import { useRouter } from "next/navigation"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { AppointmentStatus } from "@prisma/client"

const locales = { es }
const localizer = dateFnsLocalizer({ format, parse, startOfWeek: (d: Date) => startOfWeek(d, { weekStartsOn: 1 }), getDay, locales })

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  SCHEDULED: "#f59e0b",
  COMPLETED: "#22c55e",
  CANCELLED: "#ef4444",
  NO_SHOW: "#6b7280",
}

const messages = {
  allDay: "Todo el día",
  previous: "Anterior",
  next: "Siguiente",
  today: "Hoy",
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Turno",
  noEventsInRange: "Sin turnos en este período",
  showMore: (total: number) => `+${total} más`,
}

export type CalendarEvent = {
  id: string
  title: string
  start: Date
  end: Date
  status: AppointmentStatus
  clientName: string
}

interface CalendarioTurnosProps {
  events: CalendarEvent[]
}

export function CalendarioTurnos({ events }: CalendarioTurnosProps) {
  const router = useRouter()
  const [view, setView] = useState<View>(Views.WEEK)
  const [date, setDate] = useState(new Date())

  const calendarEvents = events.map((e) => ({
    ...e,
    resource: { status: e.status },
  }))

  function eventStyleGetter(event: CalendarEvent) {
    const color = STATUS_COLORS[event.status] ?? "#f59e0b"
    return {
      style: {
        backgroundColor: color,
        borderColor: color,
        color: "#fff",
        borderRadius: "6px",
        fontSize: "12px",
        padding: "2px 4px",
      },
    }
  }

  return (
    <div className="h-[calc(100vh-140px)] min-h-[500px]">
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        view={view}
        date={date}
        onView={setView}
        onNavigate={setDate}
        messages={messages}
        culture="es"
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        eventPropGetter={eventStyleGetter as never}
        onSelectEvent={(event) => router.push(`/turnos/${(event as CalendarEvent).id}`)}
        onSelectSlot={(slot) => {
          const d = slot.start as Date
          const dateStr = format(d, "yyyy-MM-dd")
          const timeStr = format(d, "HH:mm")
          router.push(`/turnos/nuevo?date=${dateStr}&time=${timeStr}`)
        }}
        selectable
        step={30}
        timeslots={2}
        min={new Date(0, 0, 0, 8, 0)}
        max={new Date(0, 0, 0, 21, 0)}
        defaultView={Views.WEEK}
        popup
      />
    </div>
  )
}
