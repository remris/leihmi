import { notFound } from "next/navigation";
import { getCurrentTenant } from "@/lib/tenant-context.server";
import { getTeamMembers } from "@/app/actions/users";
import SettingsClient from "./settings-client";

export default async function SettingsPage() {
  const tenant = await getCurrentTenant();

  if (!tenant) {
    notFound();
  }

  const users = await getTeamMembers();

  return <SettingsClient tenant={tenant} users={users} />;
}
