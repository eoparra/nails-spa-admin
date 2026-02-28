"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, ChevronRight } from "lucide-react"

export type ClienteConConteo = {
  id: string
  name: string
  phone: string | null
  email: string | null
  _count: { appointments: number }
}

interface ListaClientesProps {
  clientes: ClienteConConteo[]
}

export function ListaClientes({ clientes }: ListaClientesProps) {
  const [busqueda, setBusqueda] = useState("")

  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim()
    if (!q) return clientes
    return clientes.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.phone ?? "").toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q)
    )
  }, [busqueda, clientes])

  return (
    <div className="space-y-4">
      {/* Buscador */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, teléfono..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tabla / vacío */}
      {filtrados.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          {busqueda
            ? "No se encontraron clientes con ese criterio."
            : "No hay clientes registradas."}
        </p>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Turnos</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrados.map((cliente) => (
                <TableRow key={cliente.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{cliente.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {cliente.phone ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {cliente.email ?? "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">
                      {cliente._count.appointments}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/clientes/${cliente.id}`}
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      Ver perfil
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
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
