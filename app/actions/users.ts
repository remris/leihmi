"use server";

import { getCurrentTenant } from "@/lib/tenant-context.server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTeamMembers() {
  const tenant = await getCurrentTenant();
  if (!tenant) {
    throw new Error("Tenant nicht gefunden");
  }

  const users = await prisma.user.findMany({
    where: { tenantId: tenant.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return users;
}

export async function updateUserRole(userId: string, role: string) {
  const tenant = await getCurrentTenant();
  if (!tenant) {
    throw new Error("Tenant nicht gefunden");
  }

  // Validiere dass User zum Tenant gehört
  const user = await prisma.user.findFirst({
    where: { id: userId, tenantId: tenant.id },
  });

  if (!user) {
    throw new Error("User nicht gefunden");
  }

  // Validiere Role
  const validRoles = ["OWNER", "ADMIN", "OPERATOR", "VIEWER"];
  if (!validRoles.includes(role)) {
    throw new Error("Ungültige Rolle");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: role as any },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function removeUser(userId: string) {
  const tenant = await getCurrentTenant();
  if (!tenant) {
    throw new Error("Tenant nicht gefunden");
  }

  // Validiere dass User zum Tenant gehört
  const user = await prisma.user.findFirst({
    where: { id: userId, tenantId: tenant.id },
  });

  if (!user) {
    throw new Error("User nicht gefunden");
  }

  // Verhindere Löschen des letzten Owners
  if (user.role === "OWNER") {
    const ownerCount = await prisma.user.count({
      where: { tenantId: tenant.id, role: "OWNER" },
    });

    if (ownerCount <= 1) {
      throw new Error("Kann den letzten Owner nicht löschen");
    }
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function inviteTeamMember(formData: FormData) {
  const tenant = await getCurrentTenant();
  if (!tenant) {
    throw new Error("Tenant nicht gefunden");
  }

  const email = formData.get("email") as string;
  const role = formData.get("role") as string;

  if (!email || !email.includes("@")) {
    throw new Error("Ungültige E-Mail-Adresse");
  }

  // Prüfe ob User bereits existiert
  const existing = await prisma.user.findFirst({
    where: { email, tenantId: tenant.id },
  });

  if (existing) {
    throw new Error("User mit dieser E-Mail existiert bereits");
  }

  // TODO: In Production würde hier eine Einladungs-Email gesendet
  // Für jetzt erstellen wir den User direkt ohne Passwort
  await prisma.user.create({
    data: {
      email,
      name: email.split("@")[0],
      tenantId: tenant.id,
      role: role as any,
      emailVerified: null,
    },
  });

  revalidatePath("/dashboard/settings");
  return { success: true, message: "User eingeladen (Email-Service noch nicht implementiert)" };
}

