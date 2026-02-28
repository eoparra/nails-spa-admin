import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar, FileText, CreditCard } from "lucide-react"
import { prisma } from "@/lib/db"
import { EstadoBadge } from "@/components/turnos/EstadoBadge"
import { AccionesTurno } from "@/components/turnos/AccionesTurno"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatDate, formatTime, formatPrice, formatDuration } from "@/lib/utils/formatters"

interface TurnoDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: TurnoDetailPageProps) {
  const { id } = await params
  const turno = await prisma.appointment.findUnique({
    where: { id },
    include: { client: true },
  })
  if (!turno) return { title: "Turno no encontrado" }
  return { title: `Turno — ${turno.client.name}` }
}

export default async function TurnoDetailPage({ params }: TurnoDetailPageProps) {
  const { id } = await params

  const turno = await prisma.appointment.findUnique({
    where: { id },
    include: {
      client: true,
      services: {
        include: {
          service: true,
        },
      },
    },
  })

  if (!turno) notFound()

  const { client, services, status, isPaid, date, startTime, totalPrice, notes } = turno

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
      {/* Encabezado */}
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="icon">
          <Link href="/turnos">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Volver a turnos</span>
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">{client.name}</h1>
            <EstadoBadge status={status} />
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">Detalle del turno</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        {/* Columna principal */}
        <div className="space-y-4">
          {/* Fecha y hora */}
          <div className="rounded-xl border bg-card p-4 space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Fecha y hora
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">{formatDate(date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">{formatTime(startTime)}</span>
              </div>
            </div>
          </div>

          {/* Servicios */}
          <div className="rounded-xl border bg-card p-4 space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Servicios
            </p>
            <div className="space-y-2">
              {services.map((s) => (
                <div key={s.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{s.service.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDuration(s.durationAtBooking)}
                    </p>
                  </div>
                  <span className="font-medium tabular-nums">
                    {formatPrice(s.priceAtBooking.toString())}
                  </span>
                </div>
              ))}
              <Separator />
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>Total</span>
                <span className="tabular-nums">{formatPrice(totalPrice.toString())}</span>
              </div>
            </div>
          </div>

          {/* Estado de pago */}
          <div className="rounded-xl border bg-card p-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Estado de pago
            </p>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <Badge
                variant="outline"
                className={
                  isPaid
                    ? "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700"
                    : "bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600"
                }
              >
                {isPaid ? "Pagado" : "Pendiente"}
              </Badge>
            </div>
          </div>

          {/* Notas */}
          {notes && (
            <div className="rounded-xl border bg-card p-4 space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Notas
              </p>
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Columna de acciones */}
        <div>
          <AccionesTurno id={id} status={status} isPaid={isPaid} />
        </div>
      </div>
    </div>
  )
}
