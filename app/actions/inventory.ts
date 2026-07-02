"use server";
import "server-only";

import { prisma } from "@/lib/prisma";
import { requireTenantSlug } from "@/lib/tenant-context.server";
import { getTenantBySlug } from "@/lib/tenant";

export async function createInventoryItem(formData: FormData): Promise<void> {
    const name = String(formData.get("name") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const categoryId = String(formData.get("categoryId") || "").trim();
    const pricePerDay = parseFloat(String(formData.get("pricePerDay") || "0"));

    if (!name) {
        throw new Error("Name ist erforderlich");
    }

    // Resolve tenant slug if available; allow missing slug in development
    let tenantSlug: string | null = null;
    try { tenantSlug = await requireTenantSlug(); } catch (e) { /* ignore - fallback for dev */ }
    let tenant = tenantSlug ? await getTenantBySlug(tenantSlug) : null;
    if (!tenant && process.env.NODE_ENV === "development") {
      const slug = process.env.DEV_TENANT_SLUG || "stefan";
      tenant = await prisma.tenant.findUnique({ where: { slug } });
      if (!tenant) tenant = await prisma.tenant.create({ data: { slug, name: slug } });
    }

    if (!tenant) {
        throw new Error("Tenant nicht gefunden");
    }

    // Create the inventory item
    const item = await prisma.inventoryItem.create({
        data: {
            name,
            description: description || null,
            tenantId: tenant.id,
            categoryId: categoryId || null,
            price: pricePerDay > 0 ? pricePerDay : 0,
            available: true,
        },
    });

    // Handle image files - Upload to Vercel Blob
    const imageCount = parseInt(String(formData.get("imageCount") || "0"), 10);
    if (imageCount > 0) {
        const { uploadImages } = await import("@/lib/upload");
        const imageFiles: File[] = [];

        for (let i = 0; i < imageCount; i++) {
            const file = formData.get(`image_${i}`) as File;
            if (file && file.size > 0) {
                imageFiles.push(file);
            }
        }

        if (imageFiles.length > 0) {
            try {
                const urls = await uploadImages(imageFiles, name);
                for (const url of urls) {
                    await prisma.itemImage.create({
                        data: {
                            itemId: item.id,
                            url,
                        },
                    });
                }
            } catch (error) {
                console.error("Image upload failed:", error);
                // Fallback to placeholder if upload fails
                await prisma.itemImage.create({
                    data: {
                        itemId: item.id,
                        url: `https://placehold.co/600x400/e0e0e0/666?text=${encodeURIComponent(name)}`,
                    },
                });
            }
        }
    }

    // Create one inventory unit by default
    await prisma.inventoryUnit.create({
        data: {
            itemId: item.id,
            serialNumber: `${name.substring(0, 3).toUpperCase()}-${Date.now()}`,
            status: 'AVAILABLE',
        },
    });
}

export async function updateInventoryItem(itemId: string, formData: FormData) {
    const name = String(formData.get("name") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const categoryId = String(formData.get("categoryId") || "").trim();

    if (!name) {
        throw new Error("Name ist erforderlich");
    }

    const tenantSlug = await requireTenantSlug();
    const tenant = await getTenantBySlug(tenantSlug);

    if (!tenant) {
        throw new Error("Tenant nicht gefunden");
    }

    const existing = await prisma.inventoryItem.findFirst({
        where: { id: itemId, tenantId: tenant.id },
    });

    if (!existing) {
        throw new Error("Item nicht gefunden");
    }

    return prisma.inventoryItem.update({
        where: { id: itemId },
        data: {
            name,
            description: description || null,
            categoryId: categoryId || null,
        },
    });
}

export async function deleteInventoryItem(itemId: string) {
    const tenantSlug = await requireTenantSlug();
    const tenant = await getTenantBySlug(tenantSlug);

    if (!tenant) {
        throw new Error("Tenant nicht gefunden");
    }

    const existing = await prisma.inventoryItem.findFirst({
        where: { id: itemId, tenantId: tenant.id },
    });

    if (!existing) {
        throw new Error("Item nicht gefunden");
    }

    return prisma.inventoryItem.delete({
        where: { id: itemId },
    });
}
