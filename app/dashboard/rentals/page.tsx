import { Search } from "lucide-react";
import { Topbar } from "@/components/app/topbar";
import { PageHeader } from "@/components/app/page-header";
import { StatusPill } from "@/components/app/status-pill";
import { Button } from "@/components/ui/button";
import { statusTone } from "@/lib/mock-data";
import { eur, shortDate, initials } from "@/lib/format";
import { getDashboardRentals } from "@/lib/dashboard-data";
import RentalsActionButton from "./rentals-action-button";

export default async function RentalsPage() {
  const rentals = await getDashboardRentals().catch(() => []);
  return <RentalsClient rentals={rentals} />;
}

function RentalsClient({ rentals }: { rentals: Awaited<ReturnType<typeof getDashboardRentals>> }) {
  const counts = {
    active: rentals.filter((r) => r.status === "active").length,
    upcoming: rentals.filter((r) => r.status === "upcoming").length,
    late: rentals.filter((r) => r.status === "late").length,
    revenue: rentals.reduce((s, r) => s + r.total, 0),
  };

  return (
    <>
      <Topbar title="Vermietungen" />
      <main className="flex-1 px-4 py-6 lg:px-7 lg:py-8">
        <PageHeader
          title="Vermietungen"
          description="Behalte aktive Vermietungen, Abholtermine und verspätete Rückgaben in einer Übersicht im Blick."
          actions={<RentalsActionButton />}
        />

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Aktiv" value={counts.active.toString()} />
          <Stat label="Bevorstehend" value={counts.upcoming.toString()} />
          <Stat label="Verspätete Rückgaben" value={counts.late.toString()} />
          <Stat label="Gesamtumsatz" value={eur(counts.revenue)} />
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-surface">
          <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input placeholder="Vermietungen durchsuchen…" className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="py-2.5 pl-5 pr-3 font-semibold">ID</th>
                  <th className="px-3 py-2.5 font-semibold">Kunde</th>
                  <th className="px-3 py-2.5 font-semibold">Gegenstände</th>
                  <th className="px-3 py-2.5 font-semibold">Zeitraum</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Summe</th>
                  <th className="px-3 py-2.5 font-semibold">Status</th>
                  <th className="px-3 py-2.5 pr-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rentals.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/40">
                    <td className="pl-5 pr-3 py-3 font-mono text-[12.5px] text-muted-foreground">{r.id.slice(0, 8)}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-[11px] font-semibold text-primary">{initials(r.customerName)}</div>
                        <span className="font-medium">{r.customerName}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{r.itemsLabel || "—"}</td>
                    <td className="px-3 py-3 text-muted-foreground">{shortDate(r.start)} → {shortDate(r.end)}</td>
                    <td className="px-3 py-3 text-right tabular-nums font-medium">{eur(r.total)}</td>
                    <td className="px-3 py-3"><StatusPill tone={statusTone(r.status) as never}>{r.status}</StatusPill></td>
                    <td className="pr-5 pl-3 py-3 text-right"><Button variant="outline" size="sm">Ansehen</Button></td>
                  </tr>
                ))}
                {rentals.length === 0 && <tr><td colSpan={7} className="px-5 py-16 text-center text-muted-foreground">Noch keine Vermietungen.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-border bg-surface p-4"><div className="text-[11px] font-medium text-muted-foreground">{label}</div><div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div></div>;
}
