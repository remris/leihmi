"use client";

import React from "react";
import { Package, Receipt, UserPlus, ChevronRight } from "lucide-react";
import { triggerCreate } from "@/lib/store";

export default function QuickActionsClient() {
  return (
    <>
      <button
        className="group flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5 text-left transition-colors hover:bg-muted"
        onClick={() => triggerCreate("rental")}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <Receipt className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-foreground">Create rental</div>
          <div className="text-[11.5px] text-muted-foreground">From an existing customer</div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </button>

      <button
        onClick={() => triggerCreate("item")}
        className="group flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5 text-left transition-colors hover:bg-muted"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <Package className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-foreground">Add inventory item</div>
          <div className="text-[11.5px] text-muted-foreground">Catalog a new asset</div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </button>

      <button
        onClick={() => triggerCreate("customer")}
        className="group flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5 text-left transition-colors hover:bg-muted"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <UserPlus className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-foreground">Add customer</div>
          <div className="text-[11.5px] text-muted-foreground">Save contact & address</div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </button>
    </>
  );
}


