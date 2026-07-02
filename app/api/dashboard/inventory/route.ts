import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentTenant } from "@/lib/tenant-context.server";

export async function GET() {
  const tenant = await getCurrentTenant();
  if (!tenant) return NextResponse.json({ items: [] });
  const items = await prisma.inventoryItem.findMany({ where: { tenantId: tenant.id }, orderBy: { createdAt: "desc" } });
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

    const item = await prisma.inventoryItem.create({
      data: {
        tenantId: tenant.id,
        name,
        description: String(body.description || "").trim() || null,
        categoryId: body.categoryId ? String(body.categoryId) : null,
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("Inventory create error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) return NextResponse.json({ error: "Tenant context missing" }, { status: 400 });

    const body = await req.json();
    const id = String(body.id || "").trim();
    if (!id) return NextResponse.json({ error: "Item id is required" }, { status: 400 });

    const existing = await prisma.inventoryItem.findFirst({ where: { id, tenantId: tenant.id } });
    if (!existing) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    const updated = await prisma.inventoryItem.update({
      where: { id },
      data: {
        name: body.name ? String(body.name).trim() : existing.name,
        description: body.description !== undefined ? (String(body.description).trim() || null) : existing.description,
        categoryId: body.categoryId !== undefined ? (body.categoryId || null) : existing.categoryId,
      },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error("Inventory update error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) return NextResponse.json({ error: "Tenant context missing" }, { status: 400 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Item id is required" }, { status: 400 });

    const existing = await prisma.inventoryItem.findFirst({ where: { id, tenantId: tenant.id } });
    if (!existing) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    await prisma.inventoryItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inventory delete error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
