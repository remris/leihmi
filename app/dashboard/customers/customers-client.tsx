"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Mail, Phone } from "lucide-react";
import { Topbar } from "@/components/app/topbar";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { initials } from "@/lib/format";
import type { getDashboardCustomers } from "@/lib/dashboard-data";
import { triggerCreate } from "@/lib/store";

export default function CustomersClient({ customers }: { customers: Awaited<ReturnType<typeof getDashboardCustomers>> }) {
  return (
    <>
      <Topbar title="Customers" />
      <main className="flex-1 px-4 py-6 lg:px-7 lg:py-8">
        <PageHeader
          title="Customers"
          description="Everyone who has rented from you, plus contact info, rental history and open invoices."
          actions={
            <Button size="sm" onClick={() => triggerCreate("customer")}>
              <Plus className="h-4 w-4" />
              Add customer
            </Button>
          }
        />

        <div className="mt-6 rounded-2xl border border-border bg-surface">
          <div className="flex items-center gap-2 border-b border-border p-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input placeholder="Search customers…" className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="py-2.5 pl-5 pr-3 font-semibold">Customer</th>
                  <th className="px-3 py-2.5 font-semibold">Contact</th>
                  <th className="px-3 py-2.5 font-semibold">City</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Open rentals</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Total rentals</th>
                  <th className="px-3 py-2.5 font-semibold">Customer since</th>
                  <th className="px-3 py-2.5 pr-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/40">
                    <td className="pl-5 pr-3 py-3">
                      <Link href={`/dashboard/customers/${c.id}`} className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold text-background" style={{ background: c.avatarColor }}>
                          {initials(c.name)}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{c.name}</div>
                          {c.company && <div className="text-[11px] text-muted-foreground">{c.company}</div>}
                        </div>
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      <div className="inline-flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        {c.email}
                      </div>
                      <div className="inline-flex items-center gap-1.5 mt-0.5">
                        <Phone className="h-3.5 w-3.5" />
                        {c.phone}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{c.city}</td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      {c.openRentals > 0 ? (
                        <span className="inline-flex rounded-md bg-primary-soft text-primary px-2 py-0.5 text-[12px] font-semibold">{c.openRentals}</span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">{c.totalRentals}</td>
                    <td className="px-3 py-3 text-muted-foreground">{c.since}</td>
                    <td className="pr-5 pl-3 py-3 text-right">
                      <Link href={`/dashboard/customers/${c.id}`} className="text-xs font-medium text-primary hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center text-muted-foreground">
                      No customers yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}

