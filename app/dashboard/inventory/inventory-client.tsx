"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Filter, Download, MoreHorizontal, Edit, Copy, Archive, Trash2, ChevronDown } from "lucide-react";
import { Topbar } from "@/components/app/topbar";
import { PageHeader } from "@/components/app/page-header";
import { StatusPill } from "@/components/app/status-pill";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { statusTone } from "@/lib/mock-data";
import { eur } from "@/lib/format";
import type { getDashboardInventory, getDashboardCategories } from "@/lib/dashboard-data";
import { NewInventoryDialog } from "@/components/dialogs/new-inventory-dialog";

function translateStatus(s: string) {
  switch (s) {
    case "available":
      return "Verfügbar";
    case "rented":
      return "Vermietet";
    case "reserved":
      return "Reserviert";
    case "maintenance":
      return "Wartung";
    case "archived":
      return "Archiviert";
    default:
      return s;
  }
}

export default function InventoryClientComponent({
  inventory,
  categories,
}: {
  inventory: Awaited<ReturnType<typeof getDashboardInventory>>;
  categories: Awaited<ReturnType<typeof getDashboardCategories>>;
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [showNewDialog, setShowNewDialog] = useState(false);

  const filtered = useMemo(
    () =>
      inventory.filter((i) => {
        if (q && !i.name.toLowerCase().includes(q.toLowerCase()) && !i.sku.toLowerCase().includes(q.toLowerCase())) return false;
        if (cat && i.category !== cat) return false;
        if (status === null || status === i.status) return true;
        return false;
      }),
    [q, cat, status, inventory]
  );

  return (
    <>
      <Topbar title="Inventar" subtitle={`${inventory.length} Artikel`} />
      <main className="flex-1 px-4 py-6 lg:px-7 lg:py-8">
        <PageHeader
          title="Inventar"
          description="Alle Artikel in deinem Mietkatalog. Klicke ein Objekt, um Verfügbarkeit, Historie und Buchungen zu sehen."
          actions={
            <>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
                Exportieren
              </Button>
              <Button size="sm" onClick={() => setShowNewDialog(true)}>
                <Plus className="h-4 w-4" />
                Objekt hinzufügen
              </Button>
            </>
          }
        />

        <div className="mt-6 rounded-2xl border border-border bg-surface">
          <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Suche nach Name oder SKU…"
                className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>

            <FilterMenu label={cat ?? "Kategorie"} active={!!cat}>
              <DropdownMenuItem onClick={() => setCat(null)}>Alle Kategorien</DropdownMenuItem>
              <DropdownMenuSeparator />
              {categories.map((c) => (
                <DropdownMenuItem key={c.id} onClick={() => setCat(c.name)}>
                  {c.name}
                </DropdownMenuItem>
              ))}
            </FilterMenu>

            <FilterMenu label={status ?? "Status"} active={!!status}>
              <DropdownMenuItem onClick={() => setStatus(null)}>Beliebiger Status</DropdownMenuItem>
              <DropdownMenuSeparator />
              {["available", "rented", "reserved", "maintenance", "archived"].map((s) => (
                <DropdownMenuItem key={s} onClick={() => setStatus(s)} className="capitalize">
                  {translateStatus(s)}
                </DropdownMenuItem>
              ))}
            </FilterMenu>

            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Filter className="h-4 w-4" />
              Mehr Filter
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="py-2.5 pl-5 pr-3 font-semibold">
                    <input type="checkbox" className="rounded border-border" />
                  </th>
                  <th className="px-3 py-2.5 font-semibold">Objekt</th>
                  <th className="px-3 py-2.5 font-semibold">Kategorie</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Preis / Tag</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Menge</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Verfügbar</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Reserviert</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Vermietet</th>
                  <th className="px-3 py-2.5 font-semibold">Status</th>
                  <th className="px-3 py-2.5 pr-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/40">
                    <td className="pl-5 pr-3 py-3">
                      <input type="checkbox" className="rounded border-border" />
                    </td>
                    <td className="px-3 py-3">
                      <Link href={`/dashboard/inventory/${item.id}`} className="flex items-center gap-3 group">
                        <Image src={item.image} alt="" width={40} height={40} className="h-10 w-10 rounded-lg object-cover ring-1 ring-border" />
                        <div className="min-w-0">
                          <div className="font-medium text-foreground group-hover:text-primary">{item.name}</div>
                          <div className="text-[11px] text-muted-foreground">{item.sku}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{item.category}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{eur(item.pricePerDay)}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{item.quantity}</td>
                    <td className="px-3 py-3 text-right tabular-nums font-medium text-foreground">{item.available}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">{item.reserved}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">{item.rented}</td>
                    <td className="px-3 py-3">
                      <StatusPill tone={statusTone(item.status) as never}>{translateStatus(item.status)}</StatusPill>
                    </td>
                    <td className="pr-5 pl-3 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem>
                            <Edit className="h-3.5 w-3.5" />
                            Bearbeiten
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-3.5 w-3.5" />
                            Duplizieren
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="h-3.5 w-3.5" />
                            Archivieren
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                            Löschen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-5 py-16 text-center text-muted-foreground">
                      Keine Artikel passen zu deinen Filtern.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
            <div>
              Zeige <span className="font-medium text-foreground">{filtered.length}</span> von {inventory.length}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Vorherige
              </Button>
              <Button variant="outline" size="sm">Nächste</Button>
            </div>
          </div>
        </div>
      </main>

      {/* Dialog für neues Item */}
      <NewInventoryDialog open={showNewDialog} onOpenChange={setShowNewDialog} />
    </>
  );
}

function FilterMenu({ label, active, children }: { label: string; active?: boolean; children: React.ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={
            "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-colors " +
            (active ? "border-primary/30 bg-primary-soft text-primary" : "border-border bg-background text-foreground hover:bg-muted")
          }
        >
          {label}
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
