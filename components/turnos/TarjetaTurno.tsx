import Link from "next/link"
import { Appointment, Client, AppointmentService, Service } from "@prisma/client"
import { EstadoBadge } from "@/components/turnos/EstadoBadge"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatTime, formatPrice } from "@/lib/utils/formatters"
import { Clock, CreditCard } from "lucide-react"

type AppointmentWithRelations = Appointment & {
  client: Client
  services: (AppointmentService & {
    service: Service
  })[]
}

interface TarjetaTurnoProps {
  appointment: AppointmentWithRelations
  className?: string
}

export function TarjetaTurno({ appointment, className }: TarjetaTurnoProps) {
  const { client, services, status, isPaid, date, startTime, totalPrice } = appointment
  const serviceNames = services.map((s) => s.service.name).join(", ")

  return (
    <Link href={`/turnos/${appointment.id}`} className="block group">
      <Card className={className}>
        <CardContent className="px-4 py-4 space-y-3">
          {/* Header: client name + status */}
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-base leading-tight">{client.name}</p>
            <EstadoBadge status={status} />
          </div>

          {/* Date & time */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>
              {formatDate(date)} &middot; {formatTime(startTime)}
            </span>
          </div>

          {/* Services */}
          {serviceNames && (
            <p className="text-sm text-muted-foreground line-clamp-1">{serviceNames}</p>
          )}

          {/* Footer: total price + payment status */}
          <div className="flex items-center justify-between pt-1 border-t">
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{formatPrice(totalPrice.toString())}</span>
            </div>
            <Badge
              className={
                isPaid
                  ? "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700"
                  : "bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600"
              }
              variant="outline"
            >
              {isPaid ? "Pagado" : "Pendiente"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
