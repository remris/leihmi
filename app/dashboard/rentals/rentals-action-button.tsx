"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { triggerCreate } from "@/lib/store";

export default function RentalsActionButton() {
  return (
    <Button size="sm" onClick={() => triggerCreate("rental")}>
      <Plus className="h-4 w-4" />
      New rental
    </Button>
  );
}

