"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus, CalendarDays, LayoutGrid, Rows3 } from "lucide-react";
import { Topbar } from "@/components/app/topbar";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { triggerCreate } from "@/lib/store";

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

type Rental = {
  id: string;
  status: string;
  startDate: Date;
  endDate: Date;
  items: Array<{
    unit: {
      item: {
        name: string;
      } | null;
    } | null;
  }>;
};

type Reservation = {
  id: string;
  status: string;
  startDate: Date;
  endDate: Date;
  items: Array<{
    unit: {
      item: {
        name: string;
      } | null;
    } | null;
  }>;
};

export default function CalendarClient({
  rentals,
  reservations
}: {
  rentals: Rental[];
  reservations: Reservation[];
}) {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "timeline">("month");

  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const startWeekday = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  // Gruppiere Events nach Tag
  const events = useMemo(() => {
    const eventsByDay: Record<number, { label: string; tone: "primary" | "accent" | "destructive" }[]> = {};

    // Füge Rentals hinzu
    rentals.forEach((rental) => {
      const start = new Date(rental.startDate);
      const end = new Date(rental.endDate);

      // Nur Events im aktuellen Monat
      if (start.getMonth() === date.getMonth() && start.getFullYear() === date.getFullYear()) {
        const day = start.getDate();
        const itemName = rental.items[0]?.unit?.item?.name || "Rental";
        const tone = rental.status === "ACTIVE" ? "primary" : rental.status === "OVERDUE" ? "destructive" : "accent";

        if (!eventsByDay[day]) eventsByDay[day] = [];
        eventsByDay[day].push({ label: itemName, tone });
      }
    });

    // Füge Reservations hinzu
    reservations.forEach((reservation) => {
      const start = new Date(reservation.startDate);

      if (start.getMonth() === date.getMonth() && start.getFullYear() === date.getFullYear()) {
        const day = start.getDate();
        const itemName = reservation.items[0]?.unit?.item?.name || "Reservation";

        if (!eventsByDay[day]) eventsByDay[day] = [];
        eventsByDay[day].push({ label: itemName, tone: "accent" });
      }
    });

    return eventsByDay;
  }, [rentals, reservations, date]);

  return (
    <>
      <Topbar title="Calendar" />
      <main className="flex-1 px-4 py-6 lg:px-7 lg:py-8">
        <PageHeader
          title="Calendar"
          description="See every rental, pickup and return in one place. Drag-and-drop coming soon."
          actions={
            <Button size="sm" onClick={() => triggerCreate("reservation")}>
              <Plus className="h-4 w-4" />New booking
            </Button>
          }
        />

        <div className="mt-6 rounded-2xl border border-border bg-surface">
          <div className="flex flex-wrap items-center gap-3 border-b border-border p-3">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost" size="icon"
                onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="px-2 text-sm font-semibold tracking-tight min-w-[160px] text-center">
                {months[date.getMonth()]} {date.getFullYear()}
              </div>
              <Button
                variant="ghost" size="icon"
                onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setDate(new Date())}>Today</Button>
            </div>
            <div className="ml-auto inline-flex rounded-lg border border-border bg-background p-0.5">
              {[
                { v: "month", label: "Month", icon: LayoutGrid },
                { v: "week", label: "Week", icon: CalendarDays },
                { v: "timeline", label: "Timeline", icon: Rows3 },
              ].map((opt) => {
                const Active = opt.icon;
                const active = view === opt.v;
                return (
                  <button
                    key={opt.v}
                    onClick={() => setView(opt.v as typeof view)}
                    className={
                      "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12.5px] font-medium transition-colors " +
                      (active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")
                    }
                  >
                    <Active className="h-3.5 w-3.5" />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {view === "month" && (
            <>
              <div className="grid grid-cols-7 border-b border-border bg-muted/30 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
                  <div key={d} className="px-3 py-2">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {cells.map((day, i) => (
                  <div
                    key={i}
                    className={
                      "min-h-[110px] border-b border-r border-border p-2 transition-colors " +
                      (day === null ? "bg-muted/20" : "hover:bg-muted/40 cursor-pointer")
                    }
                    onClick={() => day !== null && triggerCreate("reservation")}
                  >
                    {day !== null && (
                      <>
                        <div
                          className={
                            "text-[12px] font-medium cursor-pointer " +
                            (day === new Date().getDate() && date.getMonth() === new Date().getMonth()
                              ? "flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                              : "text-foreground hover:text-primary")
                          }
                        >
                          {day}
                        </div>
                        <div className="mt-1 space-y-0.5">
                          {events[day]?.slice(0, 3).map((ev, j) => (
                            <div
                              key={j}
                              className={
                                "truncate rounded px-1.5 py-0.5 text-[10.5px] font-medium " +
                                (ev.tone === "primary"
                                  ? "bg-primary/15 text-primary"
                                  : ev.tone === "accent"
                                  ? "bg-[oklch(0.85_0.1_210)] text-[oklch(0.35_0.12_210)]"
                                  : "bg-destructive/15 text-destructive")
                              }
                            >
                              {ev.label}
                            </div>
                          ))}
                          {events[day] && events[day].length > 3 && (
                            <div className="text-[10px] text-muted-foreground pl-1.5">
                              +{events[day].length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {view === "week" && (
            <div className="p-8 text-center text-muted-foreground">
              <CalendarDays className="mx-auto h-12 w-12 opacity-30" />
              <div className="mt-3 text-sm">Week view coming soon</div>
            </div>
          )}

          {view === "timeline" && (
            <div className="p-8 text-center text-muted-foreground">
              <Rows3 className="mx-auto h-12 w-12 opacity-30" />
              <div className="mt-3 text-sm">Timeline view coming soon</div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

