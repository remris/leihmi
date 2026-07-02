"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowLeft, FileText, CreditCard, Truck, MessageSquare } from "lucide-react";
import { Topbar } from "@/components/app/topbar";
import { StatusPill } from "@/components/app/status-pill";
import { Button } from "@/components/ui/button";
import { rentals, inventory, customers, statusTone, type InventoryItem } from "@/lib/mock-data";
import { eur, longDate, initials } from "@/lib/format";

export default function RentalDetailPage() {
  const params = useParams();
  const rental = rentals.find((x) => x.id === params.id);

  if (!rental) {
    return <div className="flex flex-1 items-center justify-center p-10 text-muted-foreground">Rental not found.</div>;
  }

  const cust = customers.find((c) => c.id === rental.customerId)!;
  const items = inventory.filter((i) => rental.itemIds.includes(i.id));
  const days = Math.max(1, Math.round((+new Date(rental.end) - +new Date(rental.start)) / 86400000));
  const subtotal = items.reduce((s: number, i: InventoryItem) => s + i.pricePerDay * days, 0);

  return (
    <>
      <Topbar title={rental.id} />
      <main className="flex-1 px-4 py-6 lg:px-7 lg:py-8">
        <Link href="/dashboard/rentals" className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to rentals
        </Link>

        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[28px] font-semibold tracking-tight">Rental {rental.id}</h1>
              <StatusPill tone={statusTone(rental.status) as never}>{rental.status}</StatusPill>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{longDate(rental.start)} → {longDate(rental.end)} · {days} day{days > 1 ? "s" : ""}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm"><FileText className="h-4 w-4" />Invoice</Button>
            <Button variant="outline" size="sm"><Truck className="h-4 w-4" />Mark picked up</Button>
            <Button size="sm">Mark returned</Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border bg-surface">
              <div className="border-b border-border px-5 py-3.5 text-sm font-semibold">Items</div>
              <ul className="divide-y divide-border">
                {items.map((i: InventoryItem) => (
                  <li key={i.id} className="flex items-center gap-4 px-5 py-3.5">
                    <Image src={i.image} alt="" width={48} height={48} className="h-12 w-12 rounded-lg object-cover ring-1 ring-border" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] font-medium">{i.name}</div>
                      <div className="text-[11.5px] text-muted-foreground">{i.sku} · {i.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[13px] font-semibold tabular-nums">{eur(i.pricePerDay)}<span className="text-muted-foreground font-normal">/day</span></div>
                      <div className="text-[11px] text-muted-foreground">×{days} days</div>
                    </div>
                    <div className="w-20 text-right tabular-nums font-medium">{eur(i.pricePerDay * days)}</div>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border px-5 py-4 text-sm">
                <Row label="Subtotal" value={eur(subtotal)} />
                <Row label="Delivery" value={eur(45)} />
                <Row label="Damage waiver" value={eur(0)} muted />
                <Row label="Total" value={eur(subtotal + 45)} bold />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-center gap-2 text-sm font-semibold"><MessageSquare className="h-4 w-4 text-muted-foreground" />Internal notes</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{rental.notes ?? "No internal notes yet. Add pickup time, contact info or special instructions here."}</p>
            </div>

            <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
              <CreditCard className="mx-auto h-6 w-6 text-muted-foreground" />
              <div className="mt-3 text-sm font-medium">Payments coming soon</div>
              <p className="mt-1 text-xs text-muted-foreground">Connect Stripe to collect deposits and balance payments automatically.</p>
              <Button size="sm" variant="outline" className="mt-3">Connect Stripe</Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Customer</div>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-[13px] font-semibold text-background">{initials(cust.name)}</div>
                <div>
                  <Link href={`/dashboard/customers/${cust.id}`} className="text-[15px] font-semibold hover:text-primary">{cust.name}</Link>
                  <div className="text-[12px] text-muted-foreground">{cust.company ?? cust.city}</div>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-[13px]">
                <Field label="Email" value={cust.email} />
                <Field label="Phone" value={cust.phone} />
                <Field label="City" value={cust.city} />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Documents</div>
              <ul className="mt-3 space-y-2 text-sm">
                {['Rental agreement.pdf', 'ID copy.jpg', 'Pickup checklist.pdf'].map((d) => (
                  <li key={d} className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 truncate">{d}</span>
                    <span className="text-[11px] text-muted-foreground">PDF</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function Row({ label, value, bold, muted }: { label: string; value: string; bold?: boolean; muted?: boolean }) {
  return <div className={"flex items-center justify-between py-1 " + (bold ? "border-t border-border mt-2 pt-3 text-[15px] font-semibold" : "")}><span className={muted ? "text-muted-foreground" : "text-foreground"}>{label}</span><span className="tabular-nums">{value}</span></div>;
}

function Field({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-3"><span className="text-muted-foreground">{label}</span><span className="text-foreground truncate">{value}</span></div>;
}
