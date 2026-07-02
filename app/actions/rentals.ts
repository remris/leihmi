"use server";

import { prisma } from "@/lib/prisma";
import { requireTenantSlug } from "@/lib/tenant-context.server";
import { getTenantBySlug } from "@/lib/tenant";

export async function createRental(formData: FormData): Promise<void> {
  // Resolve tenant slug if available; allow missing slug in development
  let tenantSlug: string | null = null;
  try { tenantSlug = await requireTenantSlug(); } catch (e) { /* ignore - fallback for dev */ }

  let tenant = tenantSlug ? await getTenantBySlug(tenantSlug) : null;
  // In dev, create fallback tenant so local dev forms/server-actions work
  if (!tenant && process.env.NODE_ENV === "development") {
    const slug = process.env.DEV_TENANT_SLUG || "stefan";
    tenant = await prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) tenant = await prisma.tenant.create({ data: { slug, name: slug } });
  }

  if (!tenant) throw new Error("Tenant nicht gefunden");

  const customerId = String(formData.get("customerId") || "").trim();
  const startDate = formData.get("start") ? new Date(String(formData.get("start"))) : null;
  const endDate = formData.get("end") ? new Date(String(formData.get("end"))) : null;

  if (!customerId || !startDate || !endDate) {
    throw new Error("Missing required fields");
  }

  await prisma.rental.create({
    data: {
      tenantId: tenant.id,
      customerId,
      startDate,
      endDate,
      status: "ACTIVE",
    },
  });
}
