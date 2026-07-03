"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { triggerCreate } from "@/lib/store";

export default function NewRentalButton() {
  return (
    <Button size="sm" onClick={() => triggerCreate("rental")}>
      <Plus className="h-4 w-4" />
      Neue Vermietung
    </Button>
  );
}
