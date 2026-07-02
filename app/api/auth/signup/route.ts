import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, companyName, slug } = await req.json();

    if (!name || !email || !password || !companyName || !slug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedSlug = String(slug).trim().toLowerCase();
    const normalizedCompanyName = String(companyName).trim();
    const normalizedName = String(name).trim();

    const existingTenant = await prisma.tenant.findUnique({ where: { slug: normalizedSlug } });
    if (existingTenant) {
      return NextResponse.json({ error: "This workspace URL is already taken" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const tenant = await prisma.tenant.create({
      data: {
        slug: normalizedSlug,
        name: normalizedCompanyName,
      },
    });

    const passwordHash = await hash(String(password), 12);

    await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: normalizedName,
        passwordHash,
        tenantId: tenant.id,
        role: "OWNER",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
