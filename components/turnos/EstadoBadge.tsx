import { AppointmentStatus } from "@prisma/client"
import { cn } from "@/lib/utils"

const estadoConfig: Record<
  AppointmentStatus,
  { label: string; className: string }
> = {
  SCHEDULED: {
    label: "Agendado",
    className:
      "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700",
  },
  COMPLETED: {
    label: "Completado",
    className:
      "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700",
  },
  CANCELLED: {
    label: "Cancelado",
    className:
      "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
  },
  NO_SHOW: {
    label: "No se presentó",
    className:
      "bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600",
  },
}

interface EstadoBadgeProps {
  status: AppointmentStatus
  className?: string
}

export function EstadoBadge({ status, className }: EstadoBadgeProps) {
  const config = estadoConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
