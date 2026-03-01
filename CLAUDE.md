# Nails Spa Admin — CLAUDE.md

## Project Overview

Private admin panel for a nails spa owner. Manages appointments, clients, services, and inventory. Single-user (owner only), Spanish-only UI, deployed on Vercel + Neon (free tier).

## Tech Stack

| Layer | Tech | Version |
|-------|------|---------|
| Framework | Next.js App Router | 16.1.6 |
| Language | TypeScript (strict) | 5.x |
| UI | shadcn/ui + Tailwind CSS | 4.x |
| ORM | Prisma + `@prisma/adapter-pg` | 7.4.2 |
| Database | PostgreSQL (Neon) | — |
| Auth | Auth.js (next-auth) credentials | v5 beta |
| Toasts | sonner | 2.x |
| Calendar | react-big-calendar | 1.x |
| Date utils | date-fns (es-AR locale) | 4.x |
| Icons | lucide-react | — |

> **Prisma v7 note:** URL goes in `prisma.config.ts`, not `schema.prisma`. PrismaClient requires `new PrismaPg({ connectionString })` adapter passed to constructor — see `lib/db.ts:1`.

## Key Directories

```
app/(auth)/          Public routes (login only)
app/(protected)/     Auth-guarded pages — one subdir per domain entity
app/api/             Route handlers: auth [...nextauth] and CSV export
components/ui/       shadcn primitives (auto-generated, don't edit manually)
components/layout/   Sidebar (desktop) + BottomNav (mobile)
components/{entity}/ Domain components per entity (turnos, clientes, etc.)
lib/actions/         Server Actions — all DB writes live here
lib/utils/           formatters.ts (es-AR locale), export.ts (CSV)
prisma/              schema.prisma, seed.ts
```

## Domain Entities

`Appointment` → `AppointmentService` ← `Service` (junction with price/duration snapshot)
`Client` → `Appointment[]`
`InventoryItem` (standalone)
`User` (single admin, auth only)

## Essential Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run db:push      # Apply schema changes to DB (no migration files)
npm run db:seed      # Seed DB with test data (admin@nailsspa.com / admin123)
npm run db:studio    # Open Prisma Studio GUI
npx tsc --noEmit     # Type check without building
```

## Environment Variables

Required in `.env` (Prisma CLI) **and** `.env.local` (Next.js runtime):

```
DATABASE_URL    Neon pooled connection string (?sslmode=require)
AUTH_SECRET     Random 32-byte base64 string
AUTH_URL        Full URL with https:// prefix (e.g. https://app.vercel.app)
```

## Auth & Route Protection

- `proxy.ts` — Next.js 16 route guard (renamed from `middleware.ts`)
- `auth.config.ts` — edge-compatible config (no Prisma/bcrypt)
- `lib/auth.ts` — full config with credentials provider
- All server actions call `requireAuth()` at `lib/actions/*.ts:1–6`

## Deployment

Git push to `main` → Vercel auto-deploys. Neon DB is shared between dev and prod (use pooled URL in `DATABASE_URL`).

## Additional Documentation

| File | When to check |
|------|--------------|
| `.claude/docs/architectural_patterns.md` | Before adding new pages, actions, or components — covers the patterns used throughout |
