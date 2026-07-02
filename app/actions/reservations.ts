"use server";
import { prisma } from "@/lib/prisma";
import { requireTenantSlug } from "@/lib/tenant-context.server";
import { getTenantBySlug } from "@/lib/tenant";

export async function createReservation(formData: FormData): Promise<void> {
  const customerId = String(formData.get("customerId") || "").trim();
  const itemId = String(formData.get("itemId") || "").trim();
  const startDate = formData.get("startDate") ? new Date(String(formData.get("startDate"))) : null;
  const endDate = formData.get("endDate") ? new Date(String(formData.get("endDate"))) : null;
  const notes = String(formData.get("notes") || "").trim();

  if (!customerId || !itemId || !startDate || !endDate) throw new Error("Missing required fields");

  // Resolve tenant slug if available; allow missing slug in development
  let tenantSlug: string | null = null;
  try { tenantSlug = await requireTenantSlug(); } catch (e) { /* ignore - fallback for dev */ }
  let tenant = tenantSlug ? await getTenantBySlug(tenantSlug) : null;
  if (!tenant && process.env.NODE_ENV === "development") {
    const slug = process.env.DEV_TENANT_SLUG || "stefan";
    tenant = await prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) tenant = await prisma.tenant.create({ data: { slug, name: slug } });
  }

  if (!tenant) throw new Error("Tenant nicht gefunden");

  // Create reservation with item
  const reservation = await prisma.reservation.create({
    data: {
      tenantId: tenant.id,
      customerId,
      startDate,
      endDate,
      status: "PENDING",
      notes: notes || null,
    },
  });

  // Find an available unit for the requested item
  const availableUnit = await prisma.inventoryUnit.findFirst({
    where: {
      itemId: itemId,
      status: "AVAILABLE",
    },
  });

  if (!availableUnit) {
    throw new Error("Keine verfügbare Einheit für dieses Item gefunden");
  }

  // Add item to reservation and mark unit as reserved
  await prisma.reservationItem.create({
    data: {
      reservationId: reservation.id,
      unitId: availableUnit.id,
    },
  });

  // Update unit status to RESERVED
  await prisma.inventoryUnit.update({
    where: { id: availableUnit.id },
    data: { status: "RESERVED" },
  });
}
