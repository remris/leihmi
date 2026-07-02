import { getCurrentTenant } from "@/lib/tenant-context.server";
import { prisma } from "@/lib/prisma";
import CalendarClient from "./calendar-client";

export default async function CalendarPage() {
  const tenant = await getCurrentTenant();

  // Lade Rentals und Reservations für diesen Tenant
  const [rentals, reservations] = await Promise.all([
    tenant ? prisma.rental.findMany({
      where: { tenantId: tenant.id },
      include: {
        items: {
          include: {
            unit: {
              include: {
                item: true,
              },
            },
          },
        },
      },
    }) : [],
    tenant ? prisma.reservation.findMany({
      where: { tenantId: tenant.id },
      include: {
        items: {
          include: {
            unit: {
              include: {
                item: true,
              },
            },
          },
        },
      },
    }) : [],
  ]);

  return <CalendarClient rentals={rentals} reservations={reservations} />;
}
