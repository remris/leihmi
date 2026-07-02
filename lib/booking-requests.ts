import "server-only";
import { prisma } from "@/lib/prisma";
import { requireTenantSlug } from "@/lib/tenant-context.server";
import { getTenantBySlug } from "@/lib/tenant";

async function resolveTenant() {
  const slug = await requireTenantSlug();
  const tenant = await getTenantBySlug(slug);
  if (!tenant) throw new Error("Tenant nicht gefunden");
  return tenant;
}

export async function getBookingRequests() {
  const tenant = await resolveTenant();
  return prisma.bookingRequest.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: "desc" },
  });
}
