import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

export function formatDate(date: Date | string, fmt = "d 'de' MMMM, yyyy") {
  const d = typeof date === "string" ? parseISO(date) : date
  return format(d, fmt, { locale: es })
}

export function formatTime(date: Date | string) {
  const d = typeof date === "string" ? parseISO(date) : date
  return format(d, "HH:mm", { locale: es })
}

export function formatDateTime(date: Date | string) {
  const d = typeof date === "string" ? parseISO(date) : date
  return format(d, "d MMM, HH:mm", { locale: es })
}

export function formatPrice(amount: number | string | { toString(): string }) {
  const num = typeof amount === "number" ? amount : parseFloat(amount.toString())
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(num)
}

export function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}
