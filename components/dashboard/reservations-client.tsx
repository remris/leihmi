"use client";

import React from "react";
import { Plus, CalendarClock, AlertCircle } from "lucide-react";
import { Topbar } from "@/components/app/topbar";
import { PageHeader } from "@/components/app/page-header";
import { StatusPill } from "@/components/app/status-pill";
import { Button } from "@/components/ui/button";
import { reservations as mockReservations, statusTone } from "@/lib/mock-data";
import { eur, shortDate } from "@/lib/format";
import { triggerCreate } from "@/lib/store";

export default function ReservationsClient({ reservations }: { reservations: typeof mockReservations }) {
  const counts = {
    total: reservations.length,
    pending: reservations.filter((r) => r.status === "pending").length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
    conflict: reservations.filter((r) => r.status === "conflict").length,
  };

  return (
    <>
      <Topbar title="Reservierungen" subtitle={`${counts.total} Reservierungen`} />
      <main className="flex-1 px-4 py-6 lg:px-7 lg:py-8">
        <PageHeader
          title="Reservierungen"
          description="Anstehende Buchungen, die bestätigt werden müssen oder Termin-Konflikte haben."
          actions={
            <Button size="sm" onClick={() => triggerCreate("reservation")}>
              <Plus className="h-4 w-4" />Neue Reservierung
            </Button>
          }
        />

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard label="Ausstehend" value={counts.pending} tone="warning" icon={<AlertCircle className="h-4 w-4" />} />
          <StatCard label="Bestätigt" value={counts.confirmed} tone="success" icon={<CalendarClock className="h-4 w-4" />} />
          <StatCard label="Konflikte" value={counts.conflict} tone="destructive" icon={<AlertCircle className="h-4 w-4" />} />
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-surface">
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
                {reservations.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/40">
                    <td className="pl-5 pr-3 py-3 font-mono text-[12.5px] text-muted-foreground">{r.id}</td>
                    <td className="px-3 py-3 font-medium text-foreground">{r.customerName}</td>
                    <td className="px-3 py-3 text-muted-foreground">{r.itemsLabel}</td>
                    <td className="px-3 py-3 text-muted-foreground">{shortDate(r.start)} → {shortDate(r.end)}</td>
                    <td className="px-3 py-3 text-right tabular-nums font-medium">{eur(r.total)}</td>
                    <td className="px-3 py-3"><StatusPill tone={statusTone(r.status) as never}>{r.status}</StatusPill></td>
                    <td className="pr-5 pl-3 py-3 text-right"><Button variant="outline" size="sm">Ansehen</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}

function StatCard({ label, value, tone, icon }: { label: string; value: number; tone: "warning" | "success" | "destructive"; icon: React.ReactNode; }) {
  const styles =
    tone === "warning"
      ? "bg-[oklch(0.96_0.06_75)] text-[oklch(0.4_0.14_75)] border-[oklch(0.4_0.14_75)]/15 dark:bg-[oklch(0.32_0.08_75)] dark:text-[oklch(0.88_0.12_75)]"
      : tone === "success"
      ? "bg-[oklch(0.94_0.05_158)] text-[oklch(0.34_0.09_158)] border-[oklch(0.34_0.09_158)]/15 dark:bg-[oklch(0.3_0.06_158)] dark:text-[oklch(0.88_0.1_158)]"
      : "bg-[oklch(0.95_0.04_27)] text-[oklch(0.45_0.18_27)] border-[oklch(0.45_0.18_27)]/15 dark:bg-[oklch(0.3_0.08_27)] dark:text-[oklch(0.85_0.15_27)]";

  return (
    <div className={"rounded-2xl border p-5 " + styles}>
      <div className="flex items-center gap-1.5 text-[12px] font-medium opacity-80">{icon}{label}</div>
      <div className="mt-1.5 text-3xl font-semibold tabular-nums tracking-tight">{value}</div>
    </div>
  );
}
