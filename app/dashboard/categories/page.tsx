import { getDashboardCategories } from "@/lib/dashboard-data";
import CategoriesClientComponent from "./categories-client";

export default async function CategoriesPage() {
  const categories = await getDashboardCategories().catch(() => []);
  return <CategoriesClientComponent categories={categories} />;
}

