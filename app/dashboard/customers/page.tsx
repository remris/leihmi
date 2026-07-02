import { getDashboardCustomers } from "@/lib/dashboard-data";
import CustomersClient from "./customers-client";

export default async function CustomersPage() {
  const customers = await getDashboardCustomers().catch(() => []);
  return <CustomersClient customers={customers} />;
}
