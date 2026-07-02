import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, Building, MapPin } from "lucide-react";
import Link from "next/link";
import { Topbar } from "@/components/app/topbar";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/app/status-pill";
import { prisma } from "@/lib/prisma";
import { getCurrentTenant } from "@/lib/tenant-context.server";
import { eur, shortDate } from "@/lib/format";

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  const tenant = await getCurrentTenant();
  if (!tenant) notFound();

  const customer = await prisma.customer.findUnique({
    where: { id: params.id, tenantId: tenant.id },
    include: {
      rentals: {
        include: {
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
      },
      reservations: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!customer) {
    notFound();
  }

  // Berechne totalSpent basierend auf den Item-Preisen
  // Da wir keine totalPrice im Rental haben, summieren wir die Item-Preise
  const totalSpent = customer.rentals.reduce((sum, rental) => {
    const rentalTotal = rental.items.reduce((itemSum, rentalItem) => {
      const itemPrice = rentalItem.unit?.item?.price ?? 0;
      // Berechne Tage zwischen startDate und endDate (oder jetzt falls noch aktiv)
      const start = new Date(rental.startDate);
      const end = rental.endDate ? new Date(rental.endDate) : new Date();
      const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
      return itemSum + (itemPrice * days);
    }, 0);
    return sum + rentalTotal;
  }, 0);

  const activeRentals = customer.rentals.filter((r) => r.status === "ACTIVE").length;

  return (
    <>
      <Topbar title={customer.name} />
      <main className="flex-1 px-4 py-6 lg:px-7 lg:py-8">
        <div className="mb-4">
          <Link href="/dashboard/customers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to customers
          </Link>
        </div>

        <PageHeader
          title={customer.name}
          description={`Customer since ${shortDate(customer.createdAt.toISOString())}`}
        />

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Customer Info */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <h3 className="text-sm font-semibold">Contact Information</h3>
              <div className="mt-4 space-y-3">
                {customer.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${customer.email}`} className="text-sm hover:text-primary">
                      {customer.email}
                    </a>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${customer.phone}`} className="text-sm hover:text-primary">
                      {customer.phone}
                    </a>
                  </div>
                )}
                {customer.company && (
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{customer.company}</span>
                  </div>
                )}
                {customer.city && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{customer.city}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
              <h3 className="text-sm font-semibold">Statistics</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total spent</span>
                  <span className="text-sm font-semibold">{eur(totalSpent)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active rentals</span>
                  <span className="text-sm font-semibold">{activeRentals}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total bookings</span>
                  <span className="text-sm font-semibold">{customer.rentals.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rentals & Reservations */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border bg-surface">
              <div className="border-b border-border px-5 py-3.5">
                <h3 className="text-sm font-semibold">Recent Rentals</h3>
              </div>
              <div className="divide-y divide-border">
                {customer.rentals.slice(0, 10).map((rental) => {
                  // Berechne Preis für dieses Rental
                  const rentalPrice = rental.items.reduce((sum, rentalItem) => {
                    const itemPrice = rentalItem.unit?.item?.price ?? 0;
                    const start = new Date(rental.startDate);
                    const end = rental.endDate ? new Date(rental.endDate) : new Date();
                    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
                    return sum + (itemPrice * days);
                  }, 0);

                  return (
                    <div key={rental.id} className="flex items-center justify-between px-5 py-3.5">
                      <div>
                        <div className="text-sm font-medium">
                          {rental.items.map((ri) => ri.unit?.item?.name).filter(Boolean).join(", ") || "Items"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {shortDate(rental.startDate.toISOString())} → {rental.endDate ? shortDate(rental.endDate.toISOString()) : "Ongoing"}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold">{eur(rentalPrice)}</span>
                        <StatusPill tone={rental.status === "ACTIVE" ? "primary" : rental.status === "RETURNED" ? "accent" : "destructive"}>
                          {rental.status.toLowerCase()}
                        </StatusPill>
                      </div>
                    </div>
                  );
                })}
                {customer.rentals.length === 0 && (
                  <div className="px-5 py-10 text-center text-sm text-muted-foreground">
                    No rentals yet
                  </div>
                )}
              </div>
            </div>

            {customer.reservations.length > 0 && (
              <div className="rounded-2xl border border-border bg-surface">
                <div className="border-b border-border px-5 py-3.5">
                  <h3 className="text-sm font-semibold">Reservations</h3>
                </div>
                <div className="divide-y divide-border">
                  {customer.reservations.slice(0, 5).map((res) => (
                    <div key={res.id} className="flex items-center justify-between px-5 py-3.5">
                      <div>
                        <div className="text-sm font-medium">Reservation #{res.id.slice(0, 8)}</div>
                        <div className="text-xs text-muted-foreground">
                          {shortDate(res.startDate.toISOString())} → {shortDate(res.endDate.toISOString())}
                        </div>
                      </div>
                      <StatusPill tone="accent">{res.status.toLowerCase()}</StatusPill>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

