import { Plus, CalendarClock, AlertCircle } from "lucide-react";
import { Topbar } from "@/components/app/topbar";
import { PageHeader } from "@/components/app/page-header";
import { StatusPill } from "@/components/app/status-pill";
import { Button } from "@/components/ui/button";
import { statusTone } from "@/lib/mock-data";
import { eur, shortDate } from "@/lib/format";
import { getDashboardReservations } from "@/lib/dashboard-data";
import ReservationsClient from "@/components/dashboard/reservations-client";

export default async function ReservationsPage() {
  const reservations = await getDashboardReservations().catch(() => []);
  return <ReservationsClient reservations={reservations} />;
}
