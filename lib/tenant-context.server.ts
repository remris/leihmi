import "server-only";
import { headers } from "next/headers";
import { getTenantBySlug } from "@/lib/tenant";

const DEV_FALLBACK_SLUG = process.env.DEV_TENANT_SLUG || "stefan";

export async function getCurrentTenantSlug(): Promise<string | null> {
  const headersList = await headers();
  const slug = headersList.get("x-tenant-slug");
  if (slug) return slug;

  // During local development, allow a fallback tenant so Server Actions can run
  if (process.env.NODE_ENV === "development") {
    return DEV_FALLBACK_SLUG;
  }

  return null;
}

export async function requireTenantSlug(): Promise<string> {
  const slug = await getCurrentTenantSlug();
  if (!slug) {
    throw new Error("No tenant context available - are you on a subdomain?");
  }
  return slug;
}

export async function getCurrentTenant() {
  const slug = await getCurrentTenantSlug();
  if (!slug) return null;
  return getTenantBySlug(slug);
}

