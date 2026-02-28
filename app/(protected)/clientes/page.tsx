import Link from "next/link"
import { UserPlus } from "lucide-react"
import { prisma } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { ListaClientes } from "@/components/clientes/ListaClientes"

export default async function ClientesPage() {
  const clientes = await prisma.client.findMany({
    include: { _count: { select: { appointments: true } } },
    orderBy: { name: "asc" },
  })

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {clientes.length}{" "}
            {clientes.length === 1
              ? "cliente registrada"
              : "clientes registradas"}
          </p>
        </div>
        <Button asChild>
          <Link href="/clientes/nuevo">
            <UserPlus className="mr-2 h-4 w-4" />
            Nueva cliente
          </Link>
        </Button>
      </div>

      {/* Lista con búsqueda */}
      <ListaClientes clientes={clientes} />
    </div>
  )
}
