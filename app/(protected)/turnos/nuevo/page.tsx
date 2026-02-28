import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/db"
import { FormTurno } from "@/components/turnos/FormTurno"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Nuevo turno",
}

export default async function NuevoTurnoPage() {
  const [clientes, servicios] = await Promise.all([
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
          <Link href="/turnos">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Volver a turnos</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nuevo turno</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Completá los datos para agendar un turno
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="rounded-xl border bg-card p-6">
        <FormTurno
          clientes={clientes}
          servicios={serviciosFormateados}
          mode="crear"
        />
      </div>
    </div>
  )
}
