import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/db"
import { FormCliente } from "@/components/clientes/FormCliente"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarClientePage({ params }: Props) {
  const { id } = await params

  const cliente = await prisma.client.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      notes: true,
    },
  })

  if (!cliente) notFound()

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado */}
      <div className="space-y-1">
        <Link
          href={`/clientes/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al perfil
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">
          Editar: {cliente.name}
        </h1>
      </div>

      {/* Formulario */}
      <FormCliente
        mode="editar"
        initialData={{
          id: cliente.id,
          name: cliente.name,
          phone: cliente.phone ?? undefined,
          email: cliente.email ?? undefined,
          notes: cliente.notes ?? undefined,
        }}
      />
    </div>
  )
}
