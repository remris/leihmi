"use client";

import { Plus, MoreHorizontal, Package, Edit, Trash2 } from "lucide-react";
import { Topbar } from "@/components/app/topbar";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { getDashboardCategories } from "@/lib/dashboard-data";
import { triggerCreate } from "@/lib/store";

export default function CategoriesClientComponent({ categories }: { categories: Awaited<ReturnType<typeof getDashboardCategories>> }) {
  return (
    <>
      <Topbar title="Categories" />
      <main className="flex-1 px-4 py-6 lg:px-7 lg:py-8">
        <PageHeader
          title="Categories"
          description="Group inventory by type to power filters, public catalog and analytics."
          actions={<Button size="sm" onClick={() => triggerCreate("category")}><Plus className="h-4 w-4" />New category</Button>}
        />

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div key={c.id} className="group rounded-2xl border border-border bg-surface p-5 transition-shadow hover:shadow-[0_2px_20px_-12px_rgba(0,0,0,0.18)]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl" style={{ background: c.color, opacity: 0.85 }} />
                  <div>
                    <div className="text-[15px] font-semibold tracking-tight">{c.name}</div>
                    <div className="text-[12px] text-muted-foreground">{c.count} items</div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => triggerCreate("item")}>
                      <Package className="h-3.5 w-3.5" />
                      Add item to category
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Edit className="h-3.5 w-3.5" />
                      Edit category
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[12px]">
                <div className="rounded-lg bg-muted py-2">
                  <div className="text-[15px] font-semibold tabular-nums text-foreground">{c.available}</div>
                  <div className="text-muted-foreground">Available</div>
                </div>
                <div className="rounded-lg bg-muted py-2">
                  <div className="text-[15px] font-semibold tabular-nums text-foreground">{c.out}</div>
                  <div className="text-muted-foreground">Out</div>
                </div>
                <div className="rounded-lg bg-muted py-2">
                  <div className="text-[15px] font-semibold tabular-nums text-foreground">{c.reserved}</div>
                  <div className="text-muted-foreground">Reserved</div>
                </div>
              </div>
            </div>
          ))}
          {categories.length === 0 && <div className="col-span-full p-16 text-center text-muted-foreground">No categories yet.</div>}
        </div>
      </main>
    </>
  );
}

