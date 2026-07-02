"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inventory } from "@/lib/mock-data";
import { eur } from "@/lib/format";

export default function BookItemPage() {
  const params = useParams();
  const router = useRouter();
  const item = inventory.find((i) => i.id === params.id) ?? inventory[0];

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [checked, setChecked] = useState(false);

  const calculatePrice = () => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const itemPrice = item.pricePerDay * days;
    const deliveryFee = 45;
    return { days, itemPrice, deliveryFee, total: itemPrice + deliveryFee };
  };

  const price = calculatePrice();
  const isAvailable = checked && price !== null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!price) return;

    const bookingData = {
      itemId: item.id,
      itemName: item.name,
      startDate,
      endDate,
      days: price.days,
      itemPrice: price.itemPrice,
      deliveryFee: price.deliveryFee,
      totalPrice: price.total,
    };

    sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
    router.push("/book/request");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-4">
          <Link href="/book" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to catalog
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-2xl border border-border">
              <Image src={item.image} alt={item.name} width={1200} height={800} className="h-[500px] w-full object-cover" />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {[item.image, item.image, item.image, item.image].map((src, i) => (
                <button key={i} className={"overflow-hidden rounded-xl border " + (i === 0 ? "border-primary ring-2 ring-primary/20" : "border-border")}>
                  <Image src={src} alt="" width={240} height={160} className="h-24 w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{item.category}</div>
            <h1 className="mt-2 text-[32px] font-semibold tracking-tight">{item.name}</h1>
            <div className="mt-3 text-[28px] font-semibold tabular-nums">
              {eur(item.pricePerDay)}
              <span className="text-[16px] text-muted-foreground font-normal"> / day</span>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>

            <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-border bg-surface p-6">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Calendar className="h-4 w-4 text-primary" /> Check availability
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">From</label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} min={new Date().toISOString().split("T")[0]} required className="mt-1" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">To</label>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate || new Date().toISOString().split("T")[0]} required className="mt-1" />
                </div>
              </div>

              <Button type="button" variant="outline" className="mt-3 w-full" onClick={() => setChecked(true)} disabled={!startDate || !endDate}>
                Check availability
              </Button>

              {checked && price && (
                <div className="mt-4 space-y-2 rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center gap-2">
                    {isAvailable ? (
                      <><Check className="h-5 w-5 text-success" /><span className="font-semibold text-success">Available!</span></>
                    ) : (
                      <><X className="h-5 w-5 text-destructive" /><span className="font-semibold text-destructive">Not available</span></>
                    )}
                  </div>

                  {isAvailable && (
                    <div className="mt-3 space-y-1 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">{eur(item.pricePerDay)} × {price.days} day{price.days > 1 ? "s" : ""}</span><span className="font-medium">{eur(price.itemPrice)}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="font-medium">{eur(price.deliveryFee)}</span></div>
                      <div className="flex justify-between border-t border-border pt-2 text-base"><span className="font-semibold">Total</span><span className="font-semibold tabular-nums">{eur(price.total)}</span></div>
                    </div>
                  )}
                </div>
              )}

              {isAvailable && <Button type="submit" className="mt-4 w-full" size="lg">Request booking</Button>}
            </form>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl border border-border bg-surface p-4">
                <div className="font-semibold">Quantity</div>
                <div className="mt-1 text-2xl font-semibold tabular-nums">{item.quantity}</div>
                <div className="text-xs text-muted-foreground">units available</div>
              </div>
              <div className="rounded-xl border border-border bg-surface p-4">
                <div className="font-semibold">Category</div>
                <div className="mt-1 text-lg font-semibold">{item.category}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
