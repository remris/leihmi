import { prisma } from "./prisma";

export async function getTenantBySlug(slug: string) {
  return prisma.tenant.findUnique({
    where: { slug },
  });
}

export async function requireTenantBySlug(slug: string) {
  const tenant = await getTenantBySlug(slug);
  if (!tenant) {
    throw new Error("Tenant nicht gefunden");
  }
  return tenant;
}