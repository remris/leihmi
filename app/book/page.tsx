import Link from "next/link";
import { Boxes, ChevronRight, Calendar, Check, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import "server-only";
import { getCurrentTenant } from "@/lib/tenant-context.server";
import { prisma } from "@/lib/prisma";
import { eur } from "@/lib/format";
import { getTenantBySlug } from "@/lib/tenant";
import { getTenantSettings } from "@/lib/tenant-settings.server";

export default async function BookLandingPage() {
  const tenant = await getCurrentTenant();
  const tenantName = tenant?.name ?? "Leihmi";

  // load public settings
  const settings = tenant ? await getTenantSettings(tenant.slug) : {};

  // Fetch featured inventory for this tenant
  const items = tenant
    ? await prisma.inventoryItem.findMany({ where: { tenantId: tenant.id }, include: { units: true, category: true, images: true }, orderBy: { createdAt: "desc" }, take: 8 })
    : [];

  const featured = items.map((it) => ({
    id: it.id,
    name: it.name,
    category: it.category?.name ?? "",
    image: it.images?.[0]?.url ?? "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&q=80",
    pricePerDay: it.price ?? 0,
    available: it.units?.filter((u) => u.status === "AVAILABLE").length ?? 0,
  }));

  const defaultHow = "From bouncy castles to cinema kits — pick your dates, check availability in real time and lock it in. No back-and-forth, no hold music.";
  const defaultReviews = [
    { text: "The booking flow is the smoothest I've used — saved us hours of phone calls every weekend.", who: "Marie S., Partyzeit Hamburg" },
    { text: "Real-time availability is a game changer. We finally stopped double-booking the DJ booth.", who: "Tobias K., Event freelancer" },
    { text: "Setup, pickup, return — everything just works. The team is incredibly responsive.", who: "Jana H., Hoffmann Catering" },
  ];
  const defaultFAQ = [
    { q: "How far in advance should I book?", a: "For weekend bookings we recommend 2 weeks ahead. Last-minute is often possible — check live availability." },
    { q: "Do you deliver?", a: "Free delivery within Berlin city limits. For NRW and surrounding areas, a delivery fee applies based on distance." },
    { q: "What if something breaks?", a: "Damage waiver is included on every rental. Normal wear and tear is covered. We'll let you know if anything is outside the waiver." },
  ];

  const howText = settings.howItWorks || defaultHow;
  const reviews = settings.reviews && settings.reviews.length ? settings.reviews : defaultReviews;
  const faq = settings.faq && settings.faq.length ? settings.faq : defaultFAQ;

  return (
    <div className="min-h-screen bg-background">
      {/* Public top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Boxes className="h-4 w-4" />
            </div>
            <div className="text-[15px] font-semibold tracking-tight">{tenantName}</div>
          </div>
          <nav className="ml-6 hidden md:flex items-center gap-5 text-[13.5px] text-muted-foreground">
            <a href="#catalog" className="hover:text-foreground">Catalog</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#reviews" className="hover:text-foreground">Reviews</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/dashboard" className="hidden sm:inline-flex text-[13px] font-medium text-muted-foreground hover:text-foreground">Operator dashboard</Link>
            <Button size="sm">Book now</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-soft/40 via-background to-background" />
        <div className="mx-auto max-w-7xl px-5 pt-16 pb-12 lg:pt-24 lg:pb-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[12px] font-medium text-muted-foreground">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                Live availability — book in 2 minutes
              </div>
              <h1 className="mt-5 text-[42px] font-semibold leading-[1.05] tracking-tight text-foreground sm:text-[56px]">
                Rent event equipment without the phone tag.
              </h1>
              <p className="mt-5 max-w-lg text-[15.5px] leading-relaxed text-muted-foreground">
                From bouncy castles to cinema kits — pick your dates, check availability in real time and lock it in. No back-and-forth, no hold music.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button size="lg">
                  Browse the catalog <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  <Calendar className="h-4 w-4" />Check availability
                </Button>
              </div>
              <div className="mt-8 flex items-center gap-5 text-[12.5px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="flex">{[0,1,2,3,4].map(i => <Star key={i} className="h-4 w-4 fill-[oklch(0.78_0.15_75)] text-[oklch(0.78_0.15_75)]" />)}</div>
                  4.9 · 312 reviews
                </div>
                <div className="hidden sm:block">·</div>
                <div className="hidden sm:block">Free delivery in Berlin</div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl border border-border bg-surface p-3 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)]">
                <img
                  src={featured[0]?.image}
                  alt="Event rental"
                  className="h-[420px] w-full rounded-2xl object-cover"
                />
              </div>
              {featured[0] && (
                <div className="absolute -bottom-6 -left-4 hidden sm:flex w-64 items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-lg">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/15 text-success">
                    <Check className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold">Confirmed in 47s</div>
                    <div className="text-[11.5px] text-muted-foreground">Real customer booking · today</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section id="catalog" className="mx-auto max-w-7xl px-5 py-14">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-[28px] font-semibold tracking-tight">Popular right now</h2>
            <p className="mt-1 text-sm text-muted-foreground">Available for pickup this weekend.</p>
          </div>
          <a href="#" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            See all categories <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((it) => (
            <div key={it.id} className="group overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-[0_18px_40px_-22px_rgba(0,0,0,0.22)]">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={it.image} alt={it.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{it.category}</div>
                <div className="mt-1 text-[15px] font-semibold tracking-tight">{it.name}</div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[18px] font-semibold tabular-nums">{eur(it.pricePerDay)}</span>
                    <span className="text-[12px] text-muted-foreground"> / day</span>
                  </div>
                  <Button size="sm">Book</Button>
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 text-[11.5px] text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  {it.available} available this weekend
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-surface-muted/70 border-y border-border">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <h2 className="text-[28px] font-semibold tracking-tight">How it works</h2>
          <div className="mt-8">
            <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">{howText}</p>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-surface p-6">
                <div className="text-[11px] font-bold tracking-[0.18em] text-primary">01</div>
                <div className="mt-2 text-[18px] font-semibold tracking-tight">Pick your dates</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">Check live availability across all our equipment.</p>
              </div>
              <div className="rounded-2xl border border-border bg-surface p-6">
                <div className="text-[11px] font-bold tracking-[0.18em] text-primary">02</div>
                <div className="mt-2 text-[18px] font-semibold tracking-tight">Confirm online</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">Instant confirmation — no calls, no waiting.</p>
              </div>
              <div className="rounded-2xl border border-border bg-surface p-6">
                <div className="text-[11px] font-bold tracking-[0.18em] text-primary">03</div>
                <div className="mt-2 text-[18px] font-semibold tracking-tight">We deliver or you pick up</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">Free delivery in Berlin, or grab it at our warehouse.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking form / Reviews / FAQ */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-[28px] font-semibold tracking-tight">Request a booking</h2>
            <p className="mt-3 max-w-md text-sm text-muted-foreground leading-relaxed">
              Tell us what you need and when. We'll confirm within an hour during business days, or instantly if the item is available.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm">
              {[("Free cancellation up to 7 days before"), ("Damage waiver included"), ("Delivery available across NRW")].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-success" />{t}
                </li>
              ))}
            </ul>
          </div>
          <form action="/book/request" method="post" className="rounded-2xl border border-border bg-surface p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[12.5px] font-medium text-foreground">First name</label>
                <input name="first" placeholder="Anna" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
              </div>
              <div>
                <label className="mb-1 block text-[12.5px] font-medium text-foreground">Last name</label>
                <input name="last" placeholder="Bauer" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[12.5px] font-medium text-foreground">Email</label>
              <input name="customerEmail" placeholder="you@example.com" type="email" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
            </div>
            <div>
              <label className="mb-1 block text-[12.5px] font-medium text-foreground">Phone</label>
              <input name="customerPhone" placeholder="+49 …" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[12.5px] font-medium text-foreground">Pickup date</label>
                <input name="startDate" type="date" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
              </div>
              <div>
                <label className="mb-1 block text-[12.5px] font-medium text-foreground">Return date</label>
                <input name="endDate" type="date" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[12.5px] font-medium text-foreground">Items needed</label>
              <textarea
                name="items"
                rows={3}
                placeholder="e.g. Castle Royal XL + 50 chairs + Round Tent 8m"
                className="w-full rounded-lg border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <Button size="lg" className="w-full">Request booking</Button>
            <p className="text-center text-[11.5px] text-muted-foreground">No payment required to reserve.</p>
          </form>
        </div>

        {/* Reviews */}
        <div className="mt-12">
          <h2 className="text-[28px] font-semibold tracking-tight">Loved by event pros</h2>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {reviews.map((r, i) => (
              <div key={i} className="rounded-2xl border border-border bg-surface p-6">
                <div className="text-[12px] font-bold tracking-[0.18em] text-primary">{i + 1}</div>
                <p className="mt-3 text-sm leading-relaxed text-foreground">"{r.text}"</p>
                <div className="mt-4 text-[12px] font-medium text-muted-foreground">{r.who}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-[28px] font-semibold tracking-tight text-center">Frequently asked</h2>
          <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-surface">
            {faq.map(({ q, a }) => (
              <details key={q} className="group p-5">
                <summary className="flex cursor-pointer items-center justify-between text-[14px] font-semibold list-none">
                  {q}
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>

      </section>

      <footer className="border-t border-border bg-surface-muted/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Boxes className="h-3.5 w-3.5" />
            </div>
            <span className="text-[13px] font-semibold">{tenantName}</span>
            <span className="text-[12px] text-muted-foreground">· {tenant?.slug}.leihmi.de</span>
          </div>
          <div className="text-[12px] text-muted-foreground">
            Powered by <span className="font-semibold text-foreground">Leihmi</span> · © 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
