"use server";
import { prisma } from "@/lib/prisma";
import { requireTenantSlug } from "@/lib/tenant-context.server";
import { getTenantBySlug } from "@/lib/tenant";

export async function createCategory(formData: FormData): Promise<void> {
  const name = String(formData.get("name") || "").trim();
  if (!name) throw new Error("Name is required");

  // Resolve tenant slug if available; allow missing slug in development
  let tenantSlug: string | null = null;
  try { tenantSlug = await requireTenantSlug(); } catch (e) { /* ignore - fallback for dev */ }
  let tenant = tenantSlug ? await getTenantBySlug(tenantSlug) : null;
  if (!tenant && process.env.NODE_ENV === "development") {
    const slug = process.env.DEV_TENANT_SLUG || "stefan";
    tenant = await prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) tenant = await prisma.tenant.create({ data: { slug, name: slug } });
  }

  if (!tenant) throw new Error("Tenant not found");

  await prisma.category.create({ data: { name, tenantId: tenant.id } });
  // no return value - form action expects void/Promise<void>
}
