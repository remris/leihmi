import { getDashboardInventory, getDashboardCategories } from "@/lib/dashboard-data";
import InventoryClientComponent from "./inventory-client";

export default async function InventoryPage() {
  const [inventory, categories] = await Promise.all([
    getDashboardInventory().catch(() => []),
    getDashboardCategories().catch(() => []),
  ]);
  return <InventoryClientComponent inventory={inventory} categories={categories} />;
}
