import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentTenant } from "@/lib/tenant-context.server";

export async function POST(req: NextRequest) {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) {
      return NextResponse.json({ error: "Tenant context missing" }, { status: 400 });
    }

    const body = await req.json();
    const customerName = String(body.customerName || "").trim();
    if (!customerName) {
      return NextResponse.json({ error: "customerName is required" }, { status: 400 });
    }

    const data: any = {
      tenantId: tenant.id,
      customerName,
      email: body.customerEmail ? String(body.customerEmail).trim().toLowerCase() : null,
      phone: body.customerPhone ? String(body.customerPhone).trim() : null,
      message: [body.notes, body.street, body.postalCode, body.city].filter(Boolean).join(" | ") || null,
      status: "OPEN",
    };

    const bookingRequest = await prisma.bookingRequest.create({ data });

    return NextResponse.json({ success: true, requestId: bookingRequest.id });
  } catch (error) {
    console.error("Booking request error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
