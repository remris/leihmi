import { prisma } from "@/lib/prisma";
import { requireTenantSlug } from "@/lib/tenant-context.server";
import { getTenantBySlug } from "@/lib/tenant";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function InventoryItemPage({ params }: { params: { id: string } }) {
  const slug = await requireTenantSlug();
  const tenant = await getTenantBySlug(slug);
  if (!tenant) return notFound();

  const item = await prisma.inventoryItem.findFirst({
    where: { id: params.id, tenantId: tenant.id },
    include: {
      category: true,
      images: true,
      units: true,
    },
  });

  if (!item) return notFound();

  const images = item.images?.map((img: { url: string }) => img.url) || [];
  const mainImage = images[0] || `https://placehold.co/800x600/e0e0e0/666?text=${encodeURIComponent(item.name)}`;

  const availableUnits = item.units?.filter((u: { status: string }) => u.status === "AVAILABLE").length || 0;
  const rentedUnits = item.units?.filter((u: { status: string }) => u.status === "RENTED").length || 0;
  const reservedUnits = item.units?.filter((u: { status: string }) => u.status === "RESERVED").length || 0;

  return (
    <main className="flex-1 px-4 py-6 lg:px-7 lg:py-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-border relative">
              <Image src={mainImage} alt={item.name} fill className="object-cover" />
            </div>
            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {images.slice(1, 4).map((img: string, idx: number) => (
                  <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-border relative">
                    <Image src={img} alt={`${item.name} ${idx + 2}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{item.name}</h1>
                {item.category && (
                  <div className="text-sm text-muted-foreground mt-1">{item.category.name}</div>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">€{item.price.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">pro Tag</div>
              </div>
            </div>

            {item.description && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-2">Beschreibung</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="rounded-lg bg-muted p-3 text-center">
                <div className="text-xl font-bold text-green-600">{availableUnits}</div>
                <div className="text-xs text-muted-foreground">Verfügbar</div>
              </div>
              <div className="rounded-lg bg-muted p-3 text-center">
                <div className="text-xl font-bold text-blue-600">{rentedUnits}</div>
                <div className="text-xs text-muted-foreground">Vermietet</div>
              </div>
              <div className="rounded-lg bg-muted p-3 text-center">
                <div className="text-xl font-bold text-orange-600">{reservedUnits}</div>
                <div className="text-xs text-muted-foreground">Reserviert</div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Einheiten ({item.units?.length || 0})</h3>
              {item.units?.map((unit: { id: string; serialNumber: string | null; status: string }) => (
                <div key={unit.id} className="flex items-center justify-between p-2 rounded-lg border border-border">
                  <div>
                    <div className="text-sm font-medium">{unit.serialNumber || "No S/N"}</div>
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded-full ${
                      unit.status === "AVAILABLE"
                        ? "bg-green-100 text-green-800"
                        : unit.status === "RENTED"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {unit.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

