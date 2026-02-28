import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { FormCliente } from "@/components/clientes/FormCliente"

export default function NuevaClientePage() {
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
        <h1 className="text-2xl font-bold tracking-tight">Nueva cliente</h1>
      </div>

      {/* Formulario */}
      <FormCliente mode="crear" />
    </div>
  )
}
