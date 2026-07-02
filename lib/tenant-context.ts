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

// client-safe tenant context helpers
export function getCurrentTenantSlugClient(): string | null {
  // Client code can't access request headers directly.
  // Use X-Tenant-Slug header set by middleware on server responses (e.g. via fetch) or rely on runtime config.
  // For now, read from a global injected window variable if present (useful in CSR during development).
  if (typeof window === "undefined") return null;
  // window.__LEIHMI_TENANT__ can be injected in server HTML if needed
  // @ts-ignore
  return (window.__LEIHMI_TENANT__ && window.__LEIHMI_TENANT__.slug) || null;
}

export function requireTenantSlugClient(): string {
  const s = getCurrentTenantSlugClient();
  if (!s) throw new Error("No tenant context available on client. Use server APIs or ensure middleware injects tenant headers.");
  return s;
}

export async function getCurrentTenantClient(): Promise<null | { id: string; slug: string; name: string }> {
  const slug = getCurrentTenantSlugClient();
  if (!slug) return null;
  // call server API to get tenant details
  try {
    const res = await fetch(`/api/tenant?slug=${encodeURIComponent(slug)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}
