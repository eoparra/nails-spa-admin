import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Pencil, Phone, Mail, FileText } from "lucide-react"
import { prisma } from "@/lib/db"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { HistorialCliente } from "@/components/clientes/HistorialCliente"
import { EliminarClienteButton } from "@/components/clientes/EliminarClienteButton"

interface Props {
  params: Promise<{ id: string }>
}

export default async function PerfilClientePage({ params }: Props) {
  const { id } = await params

  const cliente = await prisma.client.findUnique({
    where: { id },
    include: {
      appointments: {
        include: {
          services: {
            include: { service: true },
          },
        },
        orderBy: { date: "desc" },
      },
    },
  })

  if (!cliente) notFound()

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado */}
      <div className="space-y-1">
        <Link
          href="/clientes"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a clientes
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{cliente.name}</h1>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/clientes/${id}/editar`}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
            <EliminarClienteButton clienteId={id} clienteNombre={cliente.name} />
          </div>
        </div>
      </div>

      {/* Tarjeta de información */}
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="text-base">Información de contacto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {cliente.phone ? (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>{cliente.phone}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 shrink-0" />
              <span>Sin teléfono</span>
            </div>
          )}

          {cliente.email ? (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>{cliente.email}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0" />
              <span>Sin correo</span>
            </div>
          )}

          {cliente.notes && (
            <>
              <Separator />
              <div className="flex items-start gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="whitespace-pre-line">{cliente.notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Historial de turnos */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">
          Historial de turnos
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({cliente.appointments.length})
          </span>
        </h2>
        <HistorialCliente appointments={cliente.appointments} />
      </div>
    </div>
  )
}
