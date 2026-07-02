import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCurrentTenant } from "@/lib/tenant-context.server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenant = await getCurrentTenant();
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const categories = await prisma.category.findMany({
      where: { tenantId: tenant.id },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ items: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

