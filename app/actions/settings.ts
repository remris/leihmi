"use server";

import { revalidatePath } from "next/cache";
import { getCurrentTenant } from "@/lib/tenant-context.server";
import { prisma } from "@/lib/prisma";

export async function updateTenantSettings(formData: FormData) {
  const tenant = await getCurrentTenant();
  if (!tenant) {
    throw new Error("Tenant nicht gefunden");
  }

  const name = formData.get("name") as string;
  const contactEmail = formData.get("contactEmail") as string;

  await prisma.tenant.update({
    where: { id: tenant.id },
    data: {
      name: name.trim(),
    },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateBrandingSettings(formData: FormData) {
  const tenant = await getCurrentTenant();
  if (!tenant) {
    throw new Error("Tenant nicht gefunden");
  }

  const brandColor = formData.get("brandColor") as string;

  // TODO: Settings in separatem Model speichern wenn Schema erweitert wird
  // Für jetzt nur Tenant-Name updaten

  revalidatePath("/dashboard/settings");
  return { success: true, message: "Branding settings will be implemented with TenantSettings model" };
}

export async function inviteUser(formData: FormData) {
  const tenant = await getCurrentTenant();
  if (!tenant) {
    throw new Error("Tenant nicht gefunden");
  }

  const email = formData.get("email") as string;
  const role = formData.get("role") as string;

  // TODO: Email-Einladung senden
  // Für jetzt nur validieren

  if (!email || !email.includes("@")) {
    throw new Error("Ungültige E-Mail-Adresse");
  }

  return { success: true, message: "User invitation will be implemented with email service" };
}

