"use client";

import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Topbar } from "@/components/app/topbar";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { categories, monthlyRevenue, rentalsOverTime, utilizationByCategory } from "@/lib/mock-data";
import { eur } from "@/lib/format";

const CHART_COLORS = ["var(--color-chart-1)","var(--color-chart-2)","var(--color-chart-3)","var(--color-chart-4)","var(--color-chart-5)","var(--color-primary)"];

export default function AnalyticsPage() {
  return (
    <>
      <Topbar title="Analytics" />
      <main className="flex-1 px-4 py-6 lg:px-7 lg:py-8">
        <PageHeader
          title="Analytics"
          description="Performance across rentals, revenue and inventory utilization."
          actions={
            <>
              <Button variant="outline" size="sm">Last 30 days</Button>
              <Button variant="outline" size="sm">Export CSV</Button>
            </>
          }
        />

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { l: "Revenue", v: eur(412800), d: "+22% YoY" },
            { l: "Bookings", v: "1,284", d: "+14% YoY" },
            { l: "Avg. rental value", v: eur(321), d: "+6% YoY" },
            { l: "Utilization", v: "68%", d: "+4 pts YoY" },
          ].map((k) => (
            <div key={k.l} className="rounded-2xl border border-border bg-surface p-5">
              <div className="text-[12px] font-medium text-muted-foreground">{k.l}</div>
              <div className="mt-1.5 text-[26px] font-semibold tracking-tight">{k.v}</div>
              <div className="text-[11.5px] text-muted-foreground mt-0.5">{k.d}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2 rounded-2xl border border-border bg-surface p-5">
            <div className="text-sm font-semibold">Revenue, last 12 months</div>
            <div className="text-xs text-muted-foreground">Monthly net rental income</div>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenue} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: "1px solid var(--color-border)", background: "var(--color-popover)", fontSize: 12 }}
                    formatter={(v: unknown) => {
                      const num = typeof v === "number" ? v : Number(v as any);
                      return num ? eur(num) : "";
                    }}
                  />
                  <Line type="monotone" dataKey="rev" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="text-sm font-semibold">Mix by category</div>
            <div className="text-xs text-muted-foreground">Share of bookings</div>
            <div className="mt-2 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categories} dataKey="count" nameKey="name" innerRadius={48} outerRadius={84} stroke="var(--color-surface)" strokeWidth={2}>
                    {categories.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="text-sm font-semibold">Pickups vs returns</div>
            <div className="text-xs text-muted-foreground">Last 7 days</div>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rentalsOverTime} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--color-border)", background: "var(--color-popover)", fontSize: 12 }} />
                  <Bar dataKey="rentals" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="returns" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="text-sm font-semibold">Utilization by category</div>
            <div className="text-xs text-muted-foreground">This month</div>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={utilizationByCategory} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: "1px solid var(--color-border)", background: "var(--color-popover)", fontSize: 12 }}
                    formatter={(v: unknown) => {
                      const num = typeof v === "number" ? v : Number(v as any);
                      return `${Number.isFinite(num) ? num : 0}%`;
                    }}
                  />
                  <Bar dataKey="utilization" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
