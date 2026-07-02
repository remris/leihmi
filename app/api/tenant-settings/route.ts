import { NextRequest, NextResponse } from "next/server";
import { getCurrentTenant } from "@/lib/tenant-context.server";
import { getTenantBySlug, requireTenantBySlug } from "@/lib/tenant";
import { getTenantSettings, saveTenantSettings } from "@/lib/tenant-settings.server";

export async function GET(req: NextRequest) {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) return NextResponse.json({ error: "Tenant context missing" }, { status: 400 });

    const settings = await getTenantSettings(tenant.slug);
    return NextResponse.json({ settings });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not load settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) return NextResponse.json({ error: "Tenant context missing" }, { status: 400 });

    const body = await req.json();
    // minimal validation
    const settings = {
      howItWorks: typeof body.howItWorks === "string" ? body.howItWorks : undefined,
      reviews: Array.isArray(body.reviews) ? body.reviews : undefined,
      faq: Array.isArray(body.faq) ? body.faq : undefined,
    };

    await saveTenantSettings(tenant.slug, settings as any);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not save settings" }, { status: 500 });
  }
}

