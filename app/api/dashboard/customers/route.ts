import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentTenant } from "@/lib/tenant-context.server";

export async function GET() {
  const tenant = await getCurrentTenant();
  if (!tenant) return NextResponse.json({ items: [] });

  const items = await prisma.customer.findMany({ where: { tenantId: tenant.id }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  try {
    let tenant = await getCurrentTenant();
    if (!tenant && process.env.NODE_ENV === "development") {
      const slug = process.env.DEV_TENANT_SLUG || "stefan";
      tenant = await prisma.tenant.findUnique({ where: { slug } });
      if (!tenant) {
        tenant = await prisma.tenant.create({ data: { slug, name: slug } });
      }
    }

    if (!tenant) return NextResponse.json({ error: "Tenant context missing" }, { status: 400 });

    const body = await req.json();
    const name = String(body.name || "").trim();
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const customer = await prisma.customer.create({
      data: {
        tenantId: tenant.id,
        name,
        email: body.email ? String(body.email).trim().toLowerCase() : null,
        phone: body.phone ? String(body.phone).trim() : null,
      },
    });

    return NextResponse.json({ success: true, customer });
  } catch (error) {
    console.error("Customer create error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) return NextResponse.json({ error: "Tenant context missing" }, { status: 400 });

    const body = await req.json();
    const id = String(body.id || "").trim();
    if (!id) return NextResponse.json({ error: "Customer id is required" }, { status: 400 });

    const existing = await prisma.customer.findFirst({ where: { id, tenantId: tenant.id } });
    if (!existing) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

    const updated = await prisma.customer.update({
      where: { id },
      data: {
        name: body.name ? String(body.name).trim() : existing.name,
        email: body.email !== undefined ? (body.email ? String(body.email).trim().toLowerCase() : null) : existing.email,
        phone: body.phone !== undefined ? (body.phone ? String(body.phone).trim() : null) : existing.phone,
      },
    });

    return NextResponse.json({ success: true, customer: updated });
  } catch (error) {
    console.error("Customer update error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) return NextResponse.json({ error: "Tenant context missing" }, { status: 400 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Customer id is required" }, { status: 400 });

    const existing = await prisma.customer.findFirst({ where: { id, tenantId: tenant.id } });
    if (!existing) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

    await prisma.customer.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Customer delete error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
