import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentTenant } from "@/lib/tenant-context.server";

export async function GET() {
  const tenant = await getCurrentTenant();
  if (!tenant) return NextResponse.json({ items: [] });

  const items = await prisma.reservation.findMany({ where: { tenantId: tenant.id }, include: { customer: true }, orderBy: { startDate: "desc" } });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) return NextResponse.json({ error: "Tenant context missing" }, { status: 400 });

    const body = await req.json();
    const customerId = String(body.customerId || "").trim();
    const startDate = body.startDate ? new Date(body.startDate) : null;
    const endDate = body.endDate ? new Date(body.endDate) : null;
    if (!customerId || !startDate || !endDate) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const customer = await prisma.customer.findFirst({ where: { id: customerId, tenantId: tenant.id } });
    if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

    const reservation = await prisma.reservation.create({
      data: {
        tenantId: tenant.id,
        customerId,
        startDate,
        endDate,
        status: body.status || "PENDING",
      },
    });

    return NextResponse.json({ success: true, reservation });
  } catch (error) {
    console.error("Reservation create error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) return NextResponse.json({ error: "Tenant context missing" }, { status: 400 });

    const body = await req.json();
    const id = String(body.id || "").trim();
    if (!id) return NextResponse.json({ error: "Reservation id is required" }, { status: 400 });

    const existing = await prisma.reservation.findFirst({ where: { id, tenantId: tenant.id } });
    if (!existing) return NextResponse.json({ error: "Reservation not found" }, { status: 404 });

    const updated = await prisma.reservation.update({
      where: { id },
      data: {
        status: body.status ?? existing.status,
        startDate: body.startDate ? new Date(body.startDate) : existing.startDate,
        endDate: body.endDate ? new Date(body.endDate) : existing.endDate,
      },
    });

    return NextResponse.json({ success: true, reservation: updated });
  } catch (error) {
    console.error("Reservation update error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) return NextResponse.json({ error: "Tenant context missing" }, { status: 400 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Reservation id is required" }, { status: 400 });

    const existing = await prisma.reservation.findFirst({ where: { id, tenantId: tenant.id } });
    if (!existing) return NextResponse.json({ error: "Reservation not found" }, { status: 404 });

    await prisma.reservation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reservation delete error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
