import { notFound } from "next/navigation";
import "server-only";
import { getCurrentTenant } from "@/lib/tenant-context.server";
import { prisma } from "@/lib/prisma";
import BookItemClient from "./book-item-client";

export default async function BookItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const tenant = await getCurrentTenant();
  if (!tenant) return notFound();

  const item = await prisma.inventoryItem.findFirst({
    where: { id, tenantId: tenant.id },
    include: { category: true, images: true, units: true },
  });

  if (!item) return notFound();

  const images = item.images.length > 0
    ? item.images.map((img) => img.url)
    : [`https://placehold.co/1200x800/e0e0e0/666?text=${encodeURIComponent(item.name)}`];

  const available = item.units.filter((u) => u.status === "AVAILABLE").length;

  return (
    <BookItemClient
      item={{
        id: item.id,
        name: item.name,
        category: item.category?.name ?? "",
        description: item.description ?? "",
        pricePerDay: item.price,
        quantity: item.units.length,
        available,
        images,
      }}
    />
  );
}


