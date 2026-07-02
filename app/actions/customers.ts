"use server";

import { prisma } from "@/lib/prisma";
import { requireTenantSlug } from "@/lib/tenant-context.server";
import { getTenantBySlug } from "@/lib/tenant";

export async function createCustomer(formData: FormData): Promise<void> {
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

  const name = String(formData.get("name") || "").trim();
  if (!name) throw new Error("Name ist erforderlich");

  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const company = String(formData.get("company") || "").trim();
  const city = String(formData.get("city") || "").trim();

  await prisma.customer.create({
    data: {
      tenantId: tenant.id,
      phone: phone || null,
      email: email || null,
      name,
      company: company || null,
      city: city || null,
    },
  });
}

export async function updateCustomer(customerId: string, formData: FormData) {
  const tenantSlug = await requireTenantSlug();
  const tenant = await getTenantBySlug(tenantSlug);

  if (!tenant) throw new Error("Tenant nicht gefunden");

  const name = String(formData.get("name") || "").trim();
  if (!name) throw new Error("Name ist erforderlich");

  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();

  const existing = await prisma.customer.findFirst({
    where: { id: customerId, tenantId: tenant.id },
  });
  if (!existing) throw new Error("Customer nicht gefunden");

  return prisma.customer.update({
    where: { id: customerId },
    data: {
      tenantId: tenant.id,
      phone: phone || null,
      email: email || null,
      name,
    },
  });
}

export async function deleteCustomer(customerId: string) {
  const tenantSlug = await requireTenantSlug();
  let tenant = await getTenantBySlug(tenantSlug);

  if (!tenant && process.env.NODE_ENV === "development") {
    tenant = await prisma.tenant.create({ data: { slug: tenantSlug, name: tenantSlug } });
  }

  if (!tenant) throw new Error("Customer nicht gefunden");

  const existing = await prisma.customer.findFirst({
    where: { id: customerId, tenantId: tenant.id },
  });
  if (!existing) throw new Error("Customer nicht gefunden");

  return prisma.customer.delete({
    where: { id: customerId },
  });
}
