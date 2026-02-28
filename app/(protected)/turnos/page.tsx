import Link from "next/link"
import { Plus, CalendarX } from "lucide-react"
import { prisma } from "@/lib/db"
import { TarjetaTurno } from "@/components/turnos/TarjetaTurno"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Turnos",
}

export default async function TurnosPage() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const turnos = await prisma.appointment.findMany({
    where: {
      date: { gte: thirtyDaysAgo },
    },
    include: {
      client: true,
      services: {
        include: {
          service: true,
        },
      },
    },
    orderBy: [{ date: "desc" }, { startTime: "desc" }],
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Turnos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Últimos 30 días y próximos turnos
          </p>
        </div>
        <Button asChild>
          <Link href="/turnos/nuevo">
            <Plus className="h-4 w-4" />
            Nuevo turno
          </Link>
        </Button>
      </div>

      {/* Lista de turnos */}
      {turnos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
          <CalendarX className="h-10 w-10 text-muted-foreground/50 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">
            No hay turnos registrados
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Creá el primer turno usando el botón de arriba.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {turnos.map((turno) => (
            <TarjetaTurno key={turno.id} appointment={turno} />
          ))}
        </div>
      )}
    </div>
  )
}
