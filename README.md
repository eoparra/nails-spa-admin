# Nails Spa Admin

Panel de administración para un salón de uñas. App privada para la dueña del salón.

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Prisma v7** + PostgreSQL (Neon)
- **Auth.js v5** (credentials provider)
- **shadcn/ui** + Tailwind CSS v4
- **react-big-calendar** (calendario en español)
- Deployment: Vercel + Neon (costo: $0)

## Setup inicial

### 1. Clonar e instalar dependencias

```bash
git clone <repo>
cd nails-spa-admin
npm install
```

### 2. Crear base de datos en Neon

1. Ir a [neon.tech](https://neon.tech) → crear proyecto gratuito
2. Copiar el **connection string** (modo pooled para producción, directo para dev)

### 3. Configurar variables de entorno

Editar `.env.local` con tus valores:

```
DATABASE_URL="postgresql://user:pass@host/nails_spa?sslmode=require"
AUTH_SECRET="<openssl rand -base64 32>"
AUTH_URL="http://localhost:3000"
```

### 4. Crear tablas y usuario admin

```bash
# Crear el esquema en la base de datos
npm run db:push

# Poblar con datos de prueba (incluye usuario admin)
npm run db:seed
```

Credenciales del seed: `admin@nailsspa.com` / `admin123`

### 5. Iniciar en desarrollo

```bash
npm run dev
```

## Deploy en Vercel

1. Subir a GitHub
2. Conectar repo en [vercel.com](https://vercel.com)
3. Agregar variables de entorno en Vercel:
   - `DATABASE_URL` (usar la URL pooled de Neon)
   - `AUTH_SECRET` (openssl rand -base64 32)
   - `AUTH_URL` (https://tu-app.vercel.app)
4. Deploy → automático en cada `git push`

## Comandos útiles

```bash
npm run dev          # Dev server
npm run db:push      # Aplicar cambios del schema a la DB
npm run db:seed      # Poblar con datos de prueba
npm run db:studio    # Abrir Prisma Studio (GUI)
npm run build        # Build de producción
```

## Exportar ingresos a CSV

```
GET /api/export?from=2026-01-01&to=2026-01-31
```

Retorna un archivo CSV con columnas: Fecha, Cliente, Teléfono, Servicios, Total, Estado, Pagado, Notas.

## Post-MVP (futuro)

- Recordatorios por WhatsApp (Twilio)
- Asignación de técnica por turno
- Roles (staff con acceso limitado)
- Reporte PDF (react-pdf)
- Seguimiento de depósitos
