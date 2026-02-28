"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Users,
  Scissors,
  LogOut,
} from "lucide-react"
import { signOut } from "next-auth/react"

const navItems = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/calendario", label: "Calendario", icon: CalendarDays },
  { href: "/turnos", label: "Turnos", icon: ClipboardList },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/servicios", label: "Servicios", icon: Scissors },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex md:flex-col w-60 min-h-screen bg-card border-r">
      <div className="px-6 py-5 border-b">
        <h1 className="font-bold text-lg tracking-tight">💅 Nails Spa</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Panel de administración</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname.startsWith(href)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="px-3 py-4 border-t">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
