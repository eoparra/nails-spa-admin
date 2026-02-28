import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { FormServicio } from "@/components/servicios/FormServicio"

export default function NuevoServicioPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Encabezado */}
      <div className="space-y-1">
        <Link
          href="/servicios"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a servicios
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Nuevo servicio</h1>
      </div>

      {/* Formulario */}
      <FormServicio mode="crear" />
    </div>
  )
}
