import { prisma } from "@/lib/db"
import { formatPrice, formatTime } from "@/lib/utils/formatters"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CalendarDays, DollarSign, Users, TrendingUp } from "lucide-react"
import { EstadoBadge } from "@/components/turnos/EstadoBadge"
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays } from "date-fns"

export default async function DashboardPage() {
  const now = new Date()
  const todayStart = startOfDay(now)
  const todayEnd = endOfDay(now)
  const tomorrowStart = startOfDay(addDays(now, 1))
  const tomorrowEnd = endOfDay(addDays(now, 1))
  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 })
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  const [todayAppts, tomorrowAppts, weekCount, monthRevenue, clientCount] = await Promise.all([
    prisma.appointment.findMany({
      where: { date: { gte: todayStart, lte: todayEnd } },
      include: { client: true, services: { include: { service: true } } },
      orderBy: { startTime: "asc" },
    }),
    prisma.appointment.findMany({
      where: { date: { gte: tomorrowStart, lte: tomorrowEnd } },
      include: { client: true },
      orderBy: { startTime: "asc" },
    }),
    prisma.appointment.count({
      where: {
        date: { gte: weekStart, lte: weekEnd },
        status: { not: "CANCELLED" },
      },
    }),
    prisma.appointment.aggregate({
      where: {
        date: { gte: monthStart, lte: monthEnd },
        status: "COMPLETED",
        isPaid: true,
      },
      _sum: { totalPrice: true },
    }),
    prisma.client.count(),
  ])

  const monthRevenueVal = monthRevenue._sum.totalPrice?.toString() ?? "0"

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Inicio</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {new Date().toLocaleDateString("es-AR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" /> Turnos hoy
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">{todayAppts.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" /> Esta semana
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">{weekCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5" /> Ingresos del mes
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">{formatPrice(monthRevenueVal)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> Clientes
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">{clientCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Today */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Turnos de hoy</CardTitle>
              <Link href="/turnos/nuevo" className="text-xs text-primary hover:underline">
                + Nuevo
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayAppts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin turnos para hoy</p>
            ) : (
              todayAppts.map((apt) => (
                <Link key={apt.id} href={`/turnos/${apt.id}`} className="block">
                  <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium text-sm">{apt.client.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(apt.startTime)} · {apt.services.map((s) => s.service.name).join(", ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <EstadoBadge status={apt.status} />
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatPrice(apt.totalPrice.toString())}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Tomorrow */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Turnos de mañana</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tomorrowAppts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin turnos para mañana</p>
            ) : (
              tomorrowAppts.map((apt) => (
                <Link key={apt.id} href={`/turnos/${apt.id}`} className="block">
                  <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium text-sm">{apt.client.name}</p>
                      <p className="text-xs text-muted-foreground">{formatTime(apt.startTime)}</p>
                    </div>
                    <EstadoBadge status={apt.status} />
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
