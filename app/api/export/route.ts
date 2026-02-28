import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { generateRevenueCSV } from "@/lib/utils/export"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return new NextResponse("No autorizado", { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const fromStr = searchParams.get("from")
  const toStr = searchParams.get("to")

  if (!fromStr || !toStr) {
    return new NextResponse("Parámetros 'from' y 'to' son requeridos", { status: 400 })
  }

  const from = new Date(fromStr)
  const to = new Date(toStr)

  if (isNaN(from.getTime()) || isNaN(to.getTime())) {
    return new NextResponse("Fechas inválidas", { status: 400 })
  }

  const csv = await generateRevenueCSV(from, to)
  const filename = `ingresos-${fromStr}-${toStr}.csv`

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}
