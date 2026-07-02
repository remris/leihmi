import Link from "next/link";
import {
  ArrowUpRight, ArrowDownRight, Plus, Receipt, UserPlus,
  Package, ChevronRight, CalendarClock,
  AlertTriangle, Clock, Bell, PhoneCall,
} from "lucide-react";
import { Topbar } from "@/components/app/topbar";
import { PageHeader } from "@/components/app/page-header";
import { StatusPill } from "@/components/app/status-pill";
import { Button } from "@/components/ui/button";
import {
  activity, monthlyRevenue, rentalsOverTime,
  statusTone,
} from "@/lib/mock-data";
import { getDashboardSummary, getDashboardReservations } from "@/lib/dashboard-data";
import { eur, shortDate } from "@/lib/format";
import { RentalsChart, UtilizationChart, RevenueChart } from "@/components/charts/dashboard-charts";
import QuickActionsClient from "@/components/dashboard/quick-actions-client";
import NewRentalButton from "@/components/dashboard/new-rental-button";

export default async function DashboardPage() {
  const [summary, reservations] = await Promise.all([
    getDashboardSummary().catch(() => ({
      activeRentals: 0,
      availableItems: 0,
      reservationsToday: 0,
      revenueMonthToDate: 0,
    })),
    getDashboardReservations().catch(() => []),
  ]);

  return (
    <>
      <Topbar title="Dashboard" subtitle="Tuesday, 30 June 2026" />
      <main className="flex-1 px-4 py-6 lg:px-7 lg:py-8">
        <PageHeader
          title="Good morning, Stefan"
          description="Here's how Stefan Events is performing this week."
          actions={
            <>
              {/* <Button variant="outline" size="sm"><Sparkles className="h-4 w-4" />AI insights</Button> */}
              <NewRentalButton />
            </>
          }
        />

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Active rentals", value: summary.activeRentals.toString(), delta: "", up: true, hint: "currently active" },
            { label: "Available items", value: summary.availableItems.toString(), delta: "", up: false, hint: "ready to rent" },
            { label: "Reservations today", value: summary.reservationsToday.toString(), delta: "", up: true, hint: "new bookings" },
            { label: "Revenue (MTD)", value: eur(summary.revenueMonthToDate), delta: "", up: true, hint: "this month" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-surface p-5 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
              <div className="text-[12px] font-medium text-muted-foreground">{s.label}</div>
              <div className="mt-2 flex items-baseline justify-between gap-2">
                <div className="text-[28px] font-semibold tracking-tight text-foreground">{s.value}</div>
                <span className={"inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold " + (s.up ? "bg-[oklch(0.94_0.05_158)] text-[oklch(0.34_0.09_158)] dark:bg-[oklch(0.3_0.06_158)] dark:text-[oklch(0.88_0.1_158)]" : "bg-[oklch(0.95_0.04_27)] text-[oklch(0.45_0.18_27)] dark:bg-[oklch(0.3_0.08_27)] dark:text-[oklch(0.85_0.15_27)]")}>{s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}{s.delta}</span>
              </div>
              <div className="mt-1 text-[11.5px] text-muted-foreground">{s.hint}</div>
            </div>
          ))}
        </div>

        <AlertsCard />

        <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2 rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold text-foreground">Rentals over time</div>
                <div className="text-xs text-muted-foreground">Pickups vs returns, last 7 days</div>
              </div>
              <div className="flex gap-1.5 text-[11px]"><Pill dot="primary">Rentals</Pill><Pill dot="accent">Returns</Pill></div>
            </div>
            <div className="mt-4"><RentalsChart data={rentalsOverTime} /></div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-start justify-between">
              <div><div className="text-sm font-semibold text-foreground">Utilization</div><div className="text-xs text-muted-foreground">by category, this month</div></div>
            </div>
            <div className="mt-4"><UtilizationChart data={[]} /></div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface lg:col-span-2">
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <div className="text-sm font-semibold text-foreground">Upcoming reservations</div>
              <Link href="/dashboard/reservations" className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-0.5">View all <ChevronRight className="h-3.5 w-3.5" /></Link>
            </div>
            <ul className="divide-y divide-border">
              {reservations.slice(0, 5).map((r) => (
                <li key={r.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted"><CalendarClock className="h-4 w-4 text-muted-foreground" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13.5px] font-medium text-foreground">{r.itemsLabel}</div>
                    <div className="truncate text-[12px] text-muted-foreground">{r.customerName} · {shortDate(r.start)} → {shortDate(r.end)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-semibold tabular-nums">{eur(r.total)}</div>
                    <StatusPill tone={statusTone(r.status) as never} className="mt-0.5">{r.status}</StatusPill>
                  </div>
                </li>
              ))}
              {reservations.length === 0 && <li className="px-5 py-10 text-center text-muted-foreground">No reservations yet.</li>}
            </ul>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="text-sm font-semibold text-foreground">Quick actions</div>
              <div className="mt-3 grid grid-cols-1 gap-2">
                <QuickActionsClient />
              </div>
            </div>

            {/* Activity wird später mit echten Daten implementiert
            <div className="rounded-2xl border border-border bg-surface">
              <div className="border-b border-border px-5 py-3.5 text-sm font-semibold text-foreground">Recent activity</div>
              <ul className="divide-y divide-border">
                {activity.slice(0, 5).map((a, i) => (<li key={i} className="px-5 py-3 text-[13px]"><div className="text-foreground"><span className="font-medium">{a.who}</span> <span className="text-muted-foreground">{a.what}</span></div><div className="mt-0.5 text-[11.5px] text-muted-foreground">{a.when}</div></li>))}
              </ul>
            </div>
            */}

            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="text-sm font-semibold text-foreground">Revenue, last 12 months</div>
              <div className="mt-1 text-2xl font-semibold tracking-tight">{eur(412800)}</div>
              <div className="mt-2"><RevenueChart data={monthlyRevenue} /></div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function Pill({ dot, children }: { dot: "primary" | "accent"; children: React.ReactNode }) { return <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-muted-foreground"><span className={"h-1.5 w-1.5 rounded-full " + (dot === "primary" ? "bg-primary" : "bg-chart-2")} />{children}</span>; }
function QuickAction({ icon: Icon, label, hint }: { icon: typeof Plus; label: string; hint: string; }) { return <button className="group flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5 text-left transition-colors hover:bg-muted"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary"><Icon className="h-4 w-4" /></div><div className="min-w-0 flex-1"><div className="text-[13px] font-semibold text-foreground">{label}</div><div className="text-[11.5px] text-muted-foreground">{hint}</div></div><ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></button>; }
function AlertsCard() { return <div className="mt-6 rounded-2xl border border-border bg-surface p-5"><div className="flex items-center gap-2 text-sm font-semibold text-foreground"><Bell className="h-4 w-4 text-primary" /> Alerts</div><div className="mt-3 grid gap-2 md:grid-cols-3"><AlertItem icon={AlertTriangle} title="3 late returns" text="Two are overdue by 2+ days." tone="destructive" /><AlertItem icon={Clock} title="5 pickups today" text="First pickup at 09:30." tone="warning" /><AlertItem icon={PhoneCall} title="2 delivery calls" text="Follow up with customers before 12:00." tone="primary" /></div></div>; }
function AlertItem({ icon: Icon, title, text, tone }: { icon: typeof AlertTriangle; title: string; text: string; tone: "destructive" | "warning" | "primary"; }) { const toneClasses = tone === "primary" ? "bg-primary-soft text-primary" : tone === "warning" ? "bg-[oklch(0.96_0.06_75)] text-[oklch(0.4_0.14_75)]" : "bg-[oklch(0.95_0.04_27)] text-[oklch(0.45_0.18_27)]"; return <div className={"rounded-xl border border-border p-3 " + toneClasses}><div className="flex items-center gap-2 text-[13px] font-semibold"><Icon className="h-4 w-4" /> {title}</div><div className="mt-1 text-[11.5px] opacity-80">{text}</div></div>; }
