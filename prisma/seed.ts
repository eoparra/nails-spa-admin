import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { addDays, subDays, setHours, setMinutes } from "date-fns"

const prisma = new PrismaClient()

function makeTime(base: Date, hour: number, minute = 0) {
  return setMinutes(setHours(base, hour), minute)
}

async function main() {
  console.log("Limpiando base de datos...")
  await prisma.appointmentService.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.service.deleteMany()
  await prisma.client.deleteMany()
  await prisma.user.deleteMany()

  // Admin user
  const passwordHash = await bcrypt.hash("admin123", 12)
  await prisma.user.create({
    data: {
      email: "admin@nailsspa.com",
      passwordHash,
      name: "Administradora",
    },
  })
  console.log("✓ Usuario admin creado (admin@nailsspa.com / admin123)")

  // Services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: "Manicura básica",
        duration: 45,
        price: 2500,
        category: "Manos",
        colorTag: "#f9a8d4",
      },
    }),
    prisma.service.create({
      data: {
        name: "Manicura gel",
        duration: 60,
        price: 4000,
        category: "Manos",
        colorTag: "#f472b6",
      },
    }),
    prisma.service.create({
      data: {
        name: "Pedicura básica",
        duration: 60,
        price: 3000,
        category: "Pies",
        colorTag: "#a78bfa",
      },
    }),
    prisma.service.create({
      data: {
        name: "Pedicura spa",
        duration: 90,
        price: 5000,
        category: "Pies",
        colorTag: "#818cf8",
      },
    }),
    prisma.service.create({
      data: {
        name: "Diseño de uñas",
        duration: 30,
        price: 1500,
        category: "Diseño",
        colorTag: "#34d399",
      },
    }),
    prisma.service.create({
      data: {
        name: "Esmaltado semipermanente",
        duration: 45,
        price: 3500,
        category: "Manos",
        colorTag: "#fb923c",
      },
    }),
    prisma.service.create({
      data: {
        name: "Retiro de gel",
        duration: 20,
        price: 800,
        category: "Manos",
        colorTag: "#94a3b8",
      },
    }),
  ])
  console.log(`✓ ${services.length} servicios creados`)

  // Clients
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: "María González",
        phone: "+54 9 11 2345-6789",
        email: "maria.gonzalez@gmail.com",
        notes: "Prefiere colores neutros. Uñas largas.",
      },
    }),
    prisma.client.create({
      data: {
        name: "Luciana Pérez",
        phone: "+54 9 11 3456-7890",
        email: "luci.perez@hotmail.com",
      },
    }),
    prisma.client.create({
      data: {
        name: "Valentina Rodríguez",
        phone: "+54 9 11 4567-8901",
        notes: "Alérgica al metil metacrilato. Usar gel sin acrílico.",
      },
    }),
    prisma.client.create({
      data: {
        name: "Carolina López",
        phone: "+54 9 11 5678-9012",
        email: "caro.lopez@gmail.com",
      },
    }),
    prisma.client.create({
      data: {
        name: "Sofía Martínez",
        phone: "+54 9 11 6789-0123",
      },
    }),
    prisma.client.create({
      data: {
        name: "Daniela Sánchez",
        phone: "+54 9 11 7890-1234",
        email: "daniela.s@gmail.com",
        notes: "Trabaja como médica. Uñas cortas sin diseños.",
      },
    }),
    prisma.client.create({
      data: {
        name: "Camila Torres",
        phone: "+54 9 11 8901-2345",
      },
    }),
    prisma.client.create({
      data: {
        name: "Florencia Díaz",
        phone: "+54 9 11 9012-3456",
        email: "flor.diaz@outlook.com",
      },
    }),
  ])
  console.log(`✓ ${clients.length} clientes creadas`)

  const today = new Date()

  // Appointments - past (completed/paid)
  const pastAppointments = [
    {
      client: clients[0],
      daysAgo: 14,
      hour: 10,
      svcIndices: [0, 4],
      status: "COMPLETED" as const,
      isPaid: true,
    },
    {
      client: clients[1],
      daysAgo: 12,
      hour: 14,
      svcIndices: [2],
      status: "COMPLETED" as const,
      isPaid: true,
    },
    {
      client: clients[2],
      daysAgo: 10,
      hour: 11,
      svcIndices: [1],
      status: "COMPLETED" as const,
      isPaid: true,
    },
    {
      client: clients[3],
      daysAgo: 8,
      hour: 15,
      svcIndices: [3],
      status: "COMPLETED" as const,
      isPaid: false,
      notes: "Quiere pagar la próxima vez",
    },
    {
      client: clients[4],
      daysAgo: 7,
      hour: 9,
      svcIndices: [5],
      status: "CANCELLED" as const,
      isPaid: false,
    },
    {
      client: clients[5],
      daysAgo: 5,
      hour: 16,
      svcIndices: [0, 6],
      status: "COMPLETED" as const,
      isPaid: true,
    },
    {
      client: clients[0],
      daysAgo: 3,
      hour: 10,
      svcIndices: [5],
      status: "COMPLETED" as const,
      isPaid: true,
    },
    {
      client: clients[6],
      daysAgo: 2,
      hour: 13,
      svcIndices: [2, 4],
      status: "NO_SHOW" as const,
      isPaid: false,
    },
    {
      client: clients[7],
      daysAgo: 1,
      hour: 11,
      svcIndices: [1, 4],
      status: "COMPLETED" as const,
      isPaid: true,
    },
  ]

  for (const appt of pastAppointments) {
    const baseDate = subDays(today, appt.daysAgo)
    const date = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate())
    const startTime = makeTime(baseDate, appt.hour)
    const selectedServices = appt.svcIndices.map((i) => services[i])
    const totalDuration = selectedServices.reduce((s, svc) => s + svc.duration, 0)
    const totalPrice = selectedServices.reduce(
      (s, svc) => s + Number(svc.price),
      0
    )
    const endTime = new Date(startTime.getTime() + totalDuration * 60 * 1000)

    await prisma.appointment.create({
      data: {
        clientId: appt.client.id,
        date,
        startTime,
        endTime,
        status: appt.status,
        totalPrice,
        isPaid: appt.isPaid,
        notes: appt.notes,
        services: {
          create: selectedServices.map((svc) => ({
            serviceId: svc.id,
            priceAtBooking: svc.price,
            durationAtBooking: svc.duration,
          })),
        },
      },
    })
  }

  // Today's appointments
  const todayAppointments = [
    { client: clients[1], hour: 9, svcIndices: [0] },
    { client: clients[3], hour: 10, svcIndices: [1, 4] },
    { client: clients[5], hour: 12, svcIndices: [3] },
    { client: clients[2], hour: 15, svcIndices: [5] },
  ]

  for (const appt of todayAppointments) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const startTime = makeTime(today, appt.hour)
    const selectedServices = appt.svcIndices.map((i) => services[i])
    const totalDuration = selectedServices.reduce((s, svc) => s + svc.duration, 0)
    const totalPrice = selectedServices.reduce(
      (s, svc) => s + Number(svc.price),
      0
    )
    const endTime = new Date(startTime.getTime() + totalDuration * 60 * 1000)

    await prisma.appointment.create({
      data: {
        clientId: appt.client.id,
        date,
        startTime,
        endTime,
        status: "SCHEDULED",
        totalPrice,
        isPaid: false,
        services: {
          create: selectedServices.map((svc) => ({
            serviceId: svc.id,
            priceAtBooking: svc.price,
            durationAtBooking: svc.duration,
          })),
        },
      },
    })
  }

  // Future appointments
  const futureAppointments = [
    { client: clients[0], daysAhead: 1, hour: 10, svcIndices: [1] },
    { client: clients[4], daysAhead: 1, hour: 14, svcIndices: [2] },
    { client: clients[6], daysAhead: 2, hour: 11, svcIndices: [0, 4] },
    { client: clients[7], daysAhead: 3, hour: 9, svcIndices: [3] },
    { client: clients[1], daysAhead: 4, hour: 16, svcIndices: [5] },
    { client: clients[3], daysAhead: 7, hour: 10, svcIndices: [1, 6] },
  ]

  for (const appt of futureAppointments) {
    const baseDate = addDays(today, appt.daysAhead)
    const date = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate())
    const startTime = makeTime(baseDate, appt.hour)
    const selectedServices = appt.svcIndices.map((i) => services[i])
    const totalDuration = selectedServices.reduce((s, svc) => s + svc.duration, 0)
    const totalPrice = selectedServices.reduce(
      (s, svc) => s + Number(svc.price),
      0
    )
    const endTime = new Date(startTime.getTime() + totalDuration * 60 * 1000)

    await prisma.appointment.create({
      data: {
        clientId: appt.client.id,
        date,
        startTime,
        endTime,
        status: "SCHEDULED",
        totalPrice,
        isPaid: false,
        services: {
          create: selectedServices.map((svc) => ({
            serviceId: svc.id,
            priceAtBooking: svc.price,
            durationAtBooking: svc.duration,
          })),
        },
      },
    })
  }

  const totalAppts = pastAppointments.length + todayAppointments.length + futureAppointments.length
  console.log(`✓ ${totalAppts} turnos creados`)
  console.log("\n✅ Base de datos seed completada!")
  console.log("   Login: admin@nailsspa.com / admin123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
