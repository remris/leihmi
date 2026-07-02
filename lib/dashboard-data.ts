import "server-only";
import { prisma } from "@/lib/prisma";
import { requireTenantSlug } from "@/lib/tenant-context.server";
import { getTenantBySlug } from "@/lib/tenant";

export type DashboardInventoryItem = {
  id: string;
  sku: string;
  name: string;
  category: string;
  image: string;
  pricePerDay: number;
  quantity: number;
  available: number;
  reserved: number;
  rented: number;
  status: "available" | "rented" | "reserved" | "maintenance" | "archived";
  description: string;
};

export type DashboardCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  city: string;
  openRentals: number;
  totalRentals: number;
  since: string;
  avatarColor: string;
};

export type DashboardRental = {
  id: string;
  customerId: string;
  customerName: string;
  itemIds: string[];
  itemsLabel: string;
  start: string;
  end: string;
  status: "active" | "upcoming" | "returned" | "late";
  total: number;
  notes?: string;
};

export type DashboardReservation = {
  id: string;
  customerName: string;
  itemsLabel: string;
  start: string;
  end: string;
  status: "pending" | "confirmed" | "conflict";
  total: number;
};

export type DashboardCategory = {
  id: string;
  name: string;
  color: string;
  count: number;
  available: number;
  out: number;
  reserved: number;
};

export type DashboardSummary = {
  activeRentals: number;
  availableItems: number;
  reservationsToday: number;
  revenueMonthToDate: number;
};

async function resolveTenant() {
  const slug = await requireTenantSlug();
  const tenant = await getTenantBySlug(slug);
  if (!tenant) throw new Error("Tenant nicht gefunden");
  return tenant;
}

export async function getDashboardInventory(): Promise<DashboardInventoryItem[]> {
  const tenant = await resolveTenant();
  const items = await prisma.inventoryItem.findMany({
    where: { tenantId: tenant.id },
    include: {
      category: true,
      units: true,
      images: true, // Lade auch die Bilder
    },
    orderBy: { createdAt: "desc" },
  });

  return items.map((item, index) => {
    const quantity = item.units.length || 0;
    const available = item.units.filter((unit) => unit.status === "AVAILABLE").length;
    const reserved = item.units.filter((unit) => unit.status === "RESERVED").length;
    const rented = item.units.filter((unit) => unit.status === "RENTED").length;
    const status = rented > 0 ? "rented" : reserved > 0 ? "reserved" : "available";

    // Verwende das erste Bild aus dem images Array, oder Fallback
    const imageUrl = item.images && item.images.length > 0
      ? item.images[0].url
      : "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&q=70";

    return {
      id: item.id,
      sku: `LHM-${String(index + 1000)}`,
      name: item.name,
      category: item.category?.name ?? "Uncategorized",
      image: imageUrl,
      pricePerDay: item.price ?? 0, // Verwende den echten Preis
      quantity,
      available,
      reserved,
      rented,
      status,
      description: item.description ?? "",
    };
  });
}

export async function getDashboardCustomers(): Promise<DashboardCustomer[]> {
  const tenant = await resolveTenant();
  const customers = await prisma.customer.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: "desc" },
  });

  return customers.map((customer, index) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email ?? "",
    phone: customer.phone ?? "",
    company: undefined,
    city: "",
    openRentals: 0,
    totalRentals: 0,
    since: customer.createdAt.toLocaleDateString("de-DE", { month: "short", year: "numeric" }),
    avatarColor: ["oklch(0.78 0.15 75)", "oklch(0.55 0.1 158)", "oklch(0.65 0.15 30)", "oklch(0.55 0.08 220)", "oklch(0.5 0.1 280)"][index % 5] ?? "oklch(0.55 0.1 158)",
  }));
}

export async function getDashboardRentals(): Promise<DashboardRental[]> {
  const tenant = await resolveTenant();
  const rentals = await prisma.rental.findMany({
    where: { tenantId: tenant.id },
    include: { customer: true },
    orderBy: { startDate: "desc" },
  });

  return rentals.map((rental) => ({
    id: rental.id,
    customerId: rental.customerId,
    customerName: rental.customer.name,
    itemIds: [],
    itemsLabel: "",
    start: rental.startDate.toISOString(),
    end: rental.endDate?.toISOString() ?? rental.startDate.toISOString(),
    status: rental.status === "ACTIVE" ? "active" : rental.status === "RETURNED" ? "returned" : "late",
    total: 0,
  }));
}

export async function getDashboardReservations(): Promise<DashboardReservation[]> {
  const tenant = await resolveTenant();
  const reservations = await prisma.reservation.findMany({
    where: { tenantId: tenant.id },
    include: { customer: true, items: true },
    orderBy: { startDate: "desc" },
  });

  return reservations.map((reservation) => ({
    id: reservation.id,
    customerName: reservation.customer.name,
    itemsLabel: reservation.items?.length ? `${reservation.items.length} item(s)` : "",
    start: reservation.startDate.toISOString(),
    end: reservation.endDate.toISOString(),
    status: reservation.status === "CONFIRMED" ? "confirmed" : reservation.status === "CANCELLED" ? "conflict" : "pending",
    total: 0,
  }));
}

export async function getDashboardCategories(): Promise<DashboardCategory[]> {
  const tenant = await resolveTenant();
  const categories = await prisma.category.findMany({
    where: { tenantId: tenant.id },
    include: { items: { include: { units: true } } },
    orderBy: { name: "asc" },
  });

  return categories.map((category, index) => {
    const count = category.items.length;
    const available = category.items.reduce((sum, item) => sum + item.units.filter((unit) => unit.status === "AVAILABLE").length, 0);
    const out = category.items.reduce((sum, item) => sum + item.units.filter((unit) => unit.status === "RENTED").length, 0);
    const reserved = category.items.reduce((sum, item) => sum + item.units.filter((unit) => unit.status === "RESERVED").length, 0);

    return {
      id: category.id,
      name: category.name,
      color: ["oklch(0.78 0.15 75)", "oklch(0.55 0.1 158)", "oklch(0.55 0.08 220)", "oklch(0.65 0.15 30)", "oklch(0.5 0.1 280)", "oklch(0.5 0.05 95)"][index % 6] ?? "oklch(0.55 0.1 158)",
      count,
      available,
      out,
      reserved,
    };
  });
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const tenant = await resolveTenant();
  const [rentals, reservations, inventory] = await Promise.all([
    prisma.rental.findMany({ where: { tenantId: tenant.id }, select: { status: true } }),
    prisma.reservation.findMany({ where: { tenantId: tenant.id }, select: { startDate: true } }),
    prisma.inventoryItem.findMany({ where: { tenantId: tenant.id }, select: { units: { select: { status: true } } } }),
  ]);

  const activeRentals = rentals.filter((r) => r.status === "ACTIVE").length;
  const availableItems = inventory.reduce((sum, item) => sum + item.units.filter((unit) => unit.status === "AVAILABLE").length, 0);
  const reservationsToday = reservations.filter((r) => {
    const today = new Date();
    const d = new Date(r.startDate);
    return d.toDateString() === today.toDateString();
  }).length;
  // No monetary data is stored on Rental yet; return 0 for now.
  const revenueMonthToDate = 0;

  return { activeRentals, availableItems, reservationsToday, revenueMonthToDate };
}
