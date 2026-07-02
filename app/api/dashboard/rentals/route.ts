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

    const rentals = await prisma.rental.findMany({
      where: { tenantId: tenant.id },
      include: {
        customer: true,
        items: {
          include: {
            unit: {
              include: {
                item: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(rentals);
  } catch (error) {
    console.error("Error fetching rentals:", error);
    return NextResponse.json({ error: "Failed to fetch rentals" }, { status: 500 });
  }
}

