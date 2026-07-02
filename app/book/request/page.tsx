"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { eur } from "@/lib/format";

type BookingData = {
  itemId: string;
  itemName: string;
  startDate: string;
  endDate: string;
  days: number;
  itemPrice: number;
  deliveryFee: number;
  totalPrice: number;
};

export default function BookingRequestPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const data = sessionStorage.getItem("bookingData");
    if (!data) {
      router.push("/book");
      return;
    }

    const parsed = JSON.parse(data) as BookingData;
    window.requestAnimationFrame(() => setBookingData(parsed));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!bookingData) return;
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/book/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...bookingData,
        customerName: formData.get("name"),
        customerEmail: formData.get("email"),
        customerPhone: formData.get("phone"),
        customerCompany: formData.get("company"),
        street: formData.get("street"),
        postalCode: formData.get("postalCode"),
        city: formData.get("city"),
        notes: formData.get("notes"),
      }),
    });

    if (!res.ok) {
      setError("Your request could not be submitted.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    sessionStorage.removeItem("bookingData");
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-5">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold">Request submitted!</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            We&apos;ve received your rental request and will get back to you within 24 hours via email.
          </p>
          <div className="mt-8 space-y-3">
            <Button asChild className="w-full">
              <Link href="/book">Back to catalog</Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              Check your email for confirmation details
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto max-w-3xl px-5 py-4">
          <Link href="/book" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to catalog
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-8">
        <h1 className="text-2xl font-semibold">Complete your rental request</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Fill in your details and we&apos;ll confirm availability and get back to you.
        </p>

        {/* Booking Summary */}
        <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
          <div className="text-sm font-semibold">Booking summary</div>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Item</span>
              <span className="font-medium">{bookingData.itemName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Period</span>
              <span className="font-medium">
                {new Date(bookingData.startDate).toLocaleDateString()} - {new Date(bookingData.endDate).toLocaleDateString()}
                <span className="ml-1 text-muted-foreground">({bookingData.days} day{bookingData.days > 1 ? "s" : ""})</span>
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="font-semibold">Total</span>
              <span className="font-semibold tabular-nums">{eur(bookingData.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Request Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {error ? <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div> : null}
          <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
            <div className="text-sm font-semibold">Your contact information</div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Name *</label>
                <Input name="name" required className="mt-1" placeholder="Max Mustermann" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Company (optional)</label>
                <Input name="company" className="mt-1" placeholder="My Company GmbH" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Email *</label>
                <Input name="email" type="email" required className="mt-1" placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Phone *</label>
                <Input name="phone" type="tel" required className="mt-1" placeholder="+49 123 456789" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
            <div className="text-sm font-semibold">Delivery address</div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Street & Number *</label>
              <Input name="street" required className="mt-1" placeholder="Hauptstraße 123" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Postal Code *</label>
                <Input name="postalCode" required className="mt-1" placeholder="10115" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">City *</label>
                <Input name="city" required className="mt-1" placeholder="Berlin" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
            <div className="text-sm font-semibold">Additional information (optional)</div>
            <Textarea
              name="notes"
              placeholder="Any special requests or notes for us..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
            <input type="checkbox" required className="mt-0.5 rounded border-border" />
            <label className="text-sm text-muted-foreground">
              I accept the <a href="#" className="text-primary hover:underline">terms and conditions</a> and <a href="#" className="text-primary hover:underline">privacy policy</a>.
            </label>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit rental request"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            We&apos;ll review your request and confirm availability within 24 hours.
          </p>
        </form>
      </main>
    </div>
  );
}
