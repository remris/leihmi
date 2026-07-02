import { prisma } from "@/lib/prisma";

export type TenantSettings = {
  companyName: string;
  contactEmail: string;
  vatId: string;
  address: string;
  brandColor: string;
  logo: string | null;
  font: string;
  howItWorks: string | null;
  reviews: Array<{ text: string; who: string }>;
  faq: Array<{ q: string; a: string }>;
};

export async function getTenantSettings(tenantSlug: string): Promise<TenantSettings> {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
  });

  // Settings werden später in einem separaten Model gespeichert
  // Für jetzt returnen wir Default-Werte
  return {
    companyName: tenant?.name ?? "",
    contactEmail: "",
    vatId: "",
    address: "",
    brandColor: "#1d6e4b",
    logo: null,
    font: "Urbanist + Epilogue",
    // Public page settings
    howItWorks: null,
    reviews: [],
    faq: [],
  };
}

export async function saveTenantSettings(tenantSlug: string, settings: any) {
  // Für jetzt speichern wir nur den Tenant-Namen
  // In Zukunft: Separate TenantSettings-Tabelle anlegen
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
  });

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  // Update tenant name if provided
  if (settings.companyName) {
    await prisma.tenant.update({
      where: { id: tenant.id },
      data: { name: settings.companyName },
    });
  }

  // TODO: Speichere weitere Settings in TenantSettings-Model
  // wenn dieses implementiert ist

  return { success: true };
}
