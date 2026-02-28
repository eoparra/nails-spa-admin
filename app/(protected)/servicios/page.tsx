import Link from "next/link"
import { Plus } from "lucide-react"
import { prisma } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatPrice, formatDuration } from "@/lib/utils/formatters"
import { AccionesServicio } from "@/components/servicios/AccionesServicio"

export default async function ServiciosPage() {
  const servicios = await prisma.service.findMany({
    orderBy: { name: "asc" },
  })

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Servicios</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {servicios.length}{" "}
            {servicios.length === 1 ? "servicio registrado" : "servicios registrados"}
          </p>
        </div>
        <Button asChild>
          <Link href="/servicios/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo servicio
          </Link>
        </Button>
      </div>

      {/* Tabla */}
      {servicios.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No hay servicios registrados.
        </p>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-center">Color</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servicios.map((servicio) => (
                <TableRow key={servicio.id} className="hover:bg-muted/50">
                  {/* Nombre */}
                  <TableCell className="font-medium">{servicio.name}</TableCell>

                  {/* Categoría */}
                  <TableCell className="text-muted-foreground">
                    {servicio.category ?? "—"}
                  </TableCell>

                  {/* Duración */}
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {formatDuration(servicio.duration)}
                  </TableCell>

                  {/* Precio */}
                  <TableCell className="text-right font-medium whitespace-nowrap">
                    {formatPrice(servicio.price)}
                  </TableCell>

                  {/* Color */}
                  <TableCell className="text-center">
                    {servicio.colorTag ? (
                      <span
                        style={{ backgroundColor: servicio.colorTag }}
                        className="inline-block w-4 h-4 rounded-full border"
                        title={servicio.colorTag}
                      />
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>

                  {/* Estado */}
                  <TableCell className="text-center">
                    <Badge
                      variant={servicio.isActive ? "default" : "secondary"}
                    >
                      {servicio.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>

                  {/* Acciones */}
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/servicios/${servicio.id}/editar`}>
                          Editar
                        </Link>
                      </Button>
                      <AccionesServicio
                        servicioId={servicio.id}
                        servicioNombre={servicio.name}
                        isActive={servicio.isActive}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
