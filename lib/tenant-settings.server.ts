import { prisma } from "@/lib/prisma";

export async function getTenantSettings(tenantSlug: string) {
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

