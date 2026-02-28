"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface Cliente {
  id: string
  name: string
  phone?: string | null
}

interface BuscadorClienteProps {
  clientes: Cliente[]
  value: string
  onChange: (id: string) => void
  placeholder?: string
}

export function BuscadorCliente({
  clientes,
  value,
  onChange,
  placeholder = "Buscar cliente...",
}: BuscadorClienteProps) {
  const [open, setOpen] = useState(false)

  const selectedCliente = clientes.find((c) => c.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className="truncate">
            {selectedCliente ? (
              <>
                {selectedCliente.name}
                {selectedCliente.phone && (
                  <span className="text-muted-foreground ml-1.5 text-xs">
                    {selectedCliente.phone}
                  </span>
                )}
              </>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Buscar por nombre..." />
          <CommandList>
            <CommandEmpty>No se encontraron clientes.</CommandEmpty>
            <CommandGroup>
              {clientes.map((cliente) => (
                <CommandItem
                  key={cliente.id}
                  value={cliente.name}
                  onSelect={() => {
                    onChange(cliente.id === value ? "" : cliente.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === cliente.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="flex-1">
                    <span className="font-medium">{cliente.name}</span>
                    {cliente.phone && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {cliente.phone}
                      </span>
                    )}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
