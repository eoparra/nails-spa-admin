# Architectural Patterns

Patterns that appear across multiple files. Follow these when adding new features.

---

## 1. Server Action (all DB writes)

Every mutation goes through a `"use server"` file in `lib/actions/`. Pattern used in all four action files.

```
"use server" directive at top
requireAuth() called first in every exported function — lib/actions/turnos.ts:8–12
Prisma operation
revalidatePath() called for every route that shows the changed data
Return value only when the caller needs an ID (e.g. crearCliente returns the new record)
```

Reference: `lib/actions/turnos.ts`, `lib/actions/clientes.ts`, `lib/actions/inventario.ts`

**Stock increment uses Prisma atomic operator** — don't read-then-write:
`lib/actions/inventario.ts:32` — `{ quantity: { increment: delta } }`

---

## 2. Server Component Page (all data reads)

Pages in `app/(protected)/*/page.tsx` are async server components. They query Prisma directly — no API routes, no `useEffect`, no loading state.

```
export default async function Page() pattern
prisma.model.findMany({ include: { relations }, orderBy, where })
Pass serializable data down to client components as props
Parallel fetches via Promise.all() when page needs multiple queries
```

Reference: `app/(protected)/dashboard/page.tsx:14–36` (parallel queries), `app/(protected)/turnos/page.tsx`

**Dynamic route params** must be awaited in Next.js 16:
`app/(protected)/turnos/[id]/page.tsx` — `const { id } = await params`

---

## 3. Client Component Form

All create/edit forms follow the same shell. Pattern in every `Form*.tsx` component.

```
"use client"
useState for each field (controlled inputs)
handleSubmit: e.preventDefault() → setLoading(true) → try/catch server action → toast → router.push → finally setLoading(false)
Loader2 spinner on submit button while loading
router.refresh() after mutations that don't navigate away
```

Reference: `components/turnos/FormTurno.tsx`, `components/clientes/FormCliente.tsx`, `components/inventario/FormItem.tsx`

---

## 4. Destructive Action with Confirmation

Delete buttons always wrap in AlertDialog before calling a delete server action.

Reference: `components/clientes/EliminarClienteButton.tsx`, `components/inventario/ListaInventario.tsx:57–82`, `components/turnos/AccionesTurno.tsx`

---

## 5. Status / Label Mapping

Enum values are never shown raw in the UI. Each domain enum has a local `Record<Status, config>` object mapping to Spanish label + Tailwind color classes.

Reference: `components/turnos/EstadoBadge.tsx:4–25` (AppointmentStatus → label + className)

Same pattern used inline in `components/clientes/HistorialCliente.tsx:20–34` for status badges in tables.

---

## 6. cn() for Conditional Classes

`cn()` from `lib/utils.ts` (re-exports clsx + tailwind-merge) is used everywhere Tailwind classes are conditional. Never string-concatenate class names.

Reference: `lib/utils.ts:1`, used in virtually every component file.

---

## 7. Price Snapshot on Booking

When creating an `AppointmentService`, always copy current price and duration from `Service` into `priceAtBooking` / `durationAtBooking`. This preserves historical accuracy if service prices change later.

Reference: `lib/actions/turnos.ts:38–53`, `prisma/schema.prisma:57–64`

---

## 8. Responsive Layout Split

Desktop and mobile navigation are two separate components mounted simultaneously; CSS hides the appropriate one.

- `components/layout/Sidebar.tsx` — `hidden md:flex` (desktop only)
- `components/layout/BottomNav.tsx` — `md:hidden` (mobile only)
- Protected layout adds `pb-16 md:pb-0` to main content to clear the bottom nav

Reference: `app/(protected)/layout.tsx`, `components/layout/Sidebar.tsx:28`, `components/layout/BottomNav.tsx:26`

---

## 9. Prisma Client Singleton

One PrismaClient instance is reused across hot reloads in development via `globalThis`. In production a fresh instance is created per cold start.

The adapter (`PrismaPg`) is constructed with `process.env.DATABASE_URL` — required by Prisma v7 since the URL no longer lives in `schema.prisma`.

Reference: `lib/db.ts:1–17`

---

## 10. Auth Split: Edge vs Node

Auth.js config is split across two files to keep the middleware edge-compatible:

- `auth.config.ts` — no Node.js imports (no Prisma, no bcrypt). Used by `proxy.ts` (edge runtime).
- `lib/auth.ts` — imports Prisma + bcrypt. Used by server actions and API routes (Node.js runtime).

Reference: `auth.config.ts`, `lib/auth.ts`, `proxy.ts:1–4`

---

## 11. CSV Export via Route Handler

Revenue export is a GET route handler (not a server action) because it returns a file download response with custom headers.

Reference: `app/api/export/route.ts`, `lib/utils/export.ts`

---

## 12. es-AR Locale

All user-facing dates, times, and prices go through `lib/utils/formatters.ts`. Never call `Date.toLocaleDateString()` or `Intl.NumberFormat` inline in components.

Reference: `lib/utils/formatters.ts:1–35`
