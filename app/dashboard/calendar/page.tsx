import { getCurrentTenant } from "@/lib/tenant-context.server";
import { prisma } from "@/lib/prisma";
import CalendarClient from "./calendar-client";

type RentalWithRelations = {
  id: string;
  status: string;
  startDate: Date;
  endDate: Date | null;
  items: Array<{
    unit: {
      item: {
        name: string;
      } | null;
    } | null;
  }>;
};

type ReservationWithRelations = {
  id: string;
  status: string;
  startDate: Date;
  endDate: Date;
  items: Array<{
    unit: {
      item: {
        name: string;
      } | null;
    } | null;
  }>;
};

export default async function CalendarPage() {
  const tenant = await getCurrentTenant();

  // Lade Rentals und Reservations für diesen Tenant
  const [rentalsRaw, reservationsRaw] = await Promise.all([
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

  // Type-safe mapping
  const rentals: RentalWithRelations[] = rentalsRaw.map(r => ({
    id: r.id,
    status: r.status,
    startDate: r.startDate,
    endDate: r.endDate,
    items: r.items.map(item => ({
      unit: item.unit ? {
        item: item.unit.item ? {
          name: item.unit.item.name
        } : null
      } : null
    }))
  }));

  const reservations: ReservationWithRelations[] = reservationsRaw.map(r => ({
    id: r.id,
    status: r.status,
    startDate: r.startDate,
    endDate: r.endDate,
    items: r.items.map(item => ({
      unit: item.unit ? {
        item: item.unit.item ? {
          name: item.unit.item.name
        } : null
      } : null
    }))
  }));

  return <CalendarClient rentals={rentals} reservations={reservations} />;
}
