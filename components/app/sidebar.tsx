"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Tags, Receipt, CalendarClock,
  Users, Calendar as CalendarIcon, BarChart3, Settings,
  Boxes,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { tenant } from "@/lib/mock-data";

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard; badge?: number };

const nav: { section: string; items: NavItem[] }[] = [
  {
    section: "Betrieb",
    items: [
      { href: "/dashboard", label: "Übersicht", icon: LayoutDashboard },
      { href: "/dashboard/rentals", label: "Vermietungen", icon: Receipt },
      { href: "/dashboard/reservations", label: "Reservierungen", icon: CalendarClock},
      { href: "/dashboard/calendar", label: "Kalender", icon: CalendarIcon },
    ],
  },
  {
    section: "Katalog",
    items: [
      { href: "/dashboard/inventory", label: "Inventar", icon: Package },
      { href: "/dashboard/categories", label: "Kategorien", icon: Tags },
    ],
  },
  {
    section: "Beziehungen",
    items: [
      { href: "/dashboard/customers", label: "Kunden", icon: Users },
      { href: "/dashboard/analytics", label: "Analysen", icon: BarChart3 },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Boxes className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold tracking-tight text-sidebar-foreground truncate">
            {tenant.name}
          </div>
          <div className="text-[11px] text-muted-foreground truncate">
            {tenant.slug}.leihmi.de
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {nav.map((group) => (
          <div key={group.section} className="mt-5 first:mt-2">
            <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {group.section}
            </div>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium transition-colors",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-[17px] w-[17px] shrink-0 transition-colors",
                          active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                        )}
                      />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="rounded-md bg-background px-1.5 py-0.5 text-[10.5px] font-semibold text-muted-foreground ring-1 ring-border">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div className="mt-6 pt-4 border-t border-sidebar-border space-y-0.5">
          <Link
            href="/dashboard/settings"
            className={cn(
              "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium transition-colors",
              pathname === "/dashboard/settings"
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <Settings className="h-[17px] w-[17px] shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate">Einstellungen</span>
          </Link>
          <Link
              href="/book"
              className={cn(
                  "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium transition-colors",
                  pathname === "/book"
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
          >
            <Settings className="h-[17px] w-[17px] shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate">Öffentliche Buchung</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
}
