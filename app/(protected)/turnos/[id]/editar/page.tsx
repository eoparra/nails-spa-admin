import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/db"
import { FormTurno } from "@/components/turnos/FormTurno"
import { Button } from "@/components/ui/button"

interface EditarTurnoPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EditarTurnoPageProps) {
  const { id } = await params
  const turno = await prisma.appointment.findUnique({
    where: { id },
    include: { client: true },
  })
  if (!turno) return { title: "Turno no encontrado" }
  return { title: `Editar turno — ${turno.client.name}` }
}

export default async function EditarTurnoPage({ params }: EditarTurnoPageProps) {
  const { id } = await params

  const [turno, clientes, servicios] = await Promise.all([
    prisma.appointment.findUnique({
      where: { id },
      include: {
        client: true,
        services: {
          include: { service: true },
        },
      },
    }),
    prisma.client.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, phone: true },
    }),
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        duration: true,
        price: true,
        category: true,
        colorTag: true,
      },
    }),
  ])

  if (!turno) notFound()

  // Construir string de fecha YYYY-MM-DD desde el campo date almacenado
  const dateStr = new Date(turno.date).toISOString().slice(0, 10)

  // Construir string de hora HH:MM desde startTime
  const startTimeObj = new Date(turno.startTime)
  const timeStr = startTimeObj.toTimeString().slice(0, 5)

  // IDs de servicios actualmente seleccionados
  const selectedServices = turno.services.map((s) => s.serviceId)

  // Convertir Decimal a number antes de pasar al componente cliente
  const serviciosFormateados = servicios.map((s) => ({
    ...s,
    price: parseFloat(s.price.toString()),
  }))

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
      {/* Encabezado */}
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="icon">
          <Link href={`/turnos/${id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Volver al turno</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Editar turno</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{turno.client.name}</p>
        </div>
      </div>

      {/* Formulario */}
      <div className="rounded-xl border bg-card p-6">
        <FormTurno
          clientes={clientes}
          servicios={serviciosFormateados}
          mode="editar"
          initialData={{
            id: turno.id,
            clientId: turno.clientId,
            date: dateStr,
            startTime: timeStr,
            notes: turno.notes ?? "",
            selectedServices,
          }}
        />
      </div>
    </div>
  )
}
