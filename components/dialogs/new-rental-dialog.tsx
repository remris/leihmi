"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRental } from "@/app/actions/rentals";

type Customer = { id: string; name: string };
type Item = { id: string; name: string; pricePerDay?: number };

export function NewRentalDialog({ open, onOpenChangeAction }: { open: boolean; onOpenChangeAction: (open: boolean) => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [custQuery, setCustQuery] = useState("");
  const [itemQuery, setItemQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showCustSuggestions, setShowCustSuggestions] = useState(false);
  const [showItemSuggestions, setShowItemSuggestions] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetch("/api/dashboard/customers").then(r => r.json()).then(d => setCustomers(d.items || [])).catch(() => setCustomers([]));
    fetch("/api/dashboard/inventory").then(r => r.json()).then(d => setItems(d.items || [])).catch(() => setItems([]));
  }, [open]);

  const custSuggestions = useMemo(() => {
    if (!custQuery) return customers.slice(0, 6);
    const q = custQuery.toLowerCase();
    return customers.filter(c => (c.name || "").toLowerCase().includes(q) || (c.id || "").toLowerCase().includes(q)).slice(0, 6);
  }, [customers, custQuery]);

  const itemSuggestions = useMemo(() => {
    if (!itemQuery) return items.slice(0, 8);
    const q = itemQuery.toLowerCase();
    return items.filter(i => (i.name || "").toLowerCase().includes(q) || (i.id || "").toLowerCase().includes(q)).slice(0, 8);
  }, [items, itemQuery]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!selectedCustomer) { alert("Bitte Kunde auswählen"); setLoading(false); return; }
    if (!selectedItem) { alert("Bitte Objekt auswählen"); setLoading(false); return; }
    try {
      const formData = new FormData(e.currentTarget);
      // Ensure the server-action receives customerId and also itemId (even if not used server-side yet)
      formData.set("customerId", selectedCustomer.id);
      formData.set("itemId", selectedItem.id);
      await createRental(formData);
      onOpenChangeAction(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert((err as Error).message || "Fehler beim Anlegen der Vermietung");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Neue Vermietung</DialogTitle>
          <DialogDescription>Objekt an einen Kunden vermieten.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Kunde *</label>
            <div className="relative">
              <input name="customerId" type="hidden" value={selectedCustomer ? selectedCustomer.id : ""} readOnly />
              <Input value={custQuery} onChange={(e) => { setCustQuery(e.target.value); setShowCustSuggestions(true); setSelectedCustomer(null); }} onFocus={() => setShowCustSuggestions(true)} placeholder="Name oder ID suchen" className="mt-1" required />
              {showCustSuggestions && custSuggestions.length > 0 && (
                <ul className="absolute z-50 mt-1 w-full max-h-44 overflow-auto rounded-md border bg-background p-1">
                  {custSuggestions.map(c => (
                    <li key={c.id} className="cursor-pointer rounded px-2 py-1 hover:bg-muted" onMouseDown={(ev) => { ev.preventDefault(); setSelectedCustomer(c); setCustQuery(`${c.name} · ${c.id}`); setShowCustSuggestions(false); }}>
                      <div className="text-sm font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.id}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Objekt *</label>
            <div className="relative">
              <input name="itemId" type="hidden" value={selectedItem ? selectedItem.id : ""} readOnly />
              <Input value={itemQuery} onChange={(e) => { setItemQuery(e.target.value); setShowItemSuggestions(true); setSelectedItem(null); }} onFocus={() => setShowItemSuggestions(true)} placeholder="Objekt oder ID suchen" className="mt-1" required />
              {showItemSuggestions && itemSuggestions.length > 0 && (
                <ul className="absolute z-50 mt-1 w-full max-h-44 overflow-auto rounded-md border bg-background p-1">
                  {itemSuggestions.map(it => (
                    <li key={it.id} className="cursor-pointer rounded px-2 py-1 hover:bg-muted" onMouseDown={(ev) => { ev.preventDefault(); setSelectedItem(it); setItemQuery(`${it.name} · ${it.id}`); setShowItemSuggestions(false); }}>
                      <div className="text-sm font-medium">{it.name}</div>
                      <div className="text-xs text-muted-foreground">{it.id} {it.pricePerDay ? `· ${it.pricePerDay} €/Tag` : ''}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Startdatum</label>
              <Input name="start" type="date" className="mt-1" required />
            </div>
            <div>
              <label className="text-sm font-medium">Enddatum</label>
              <Input name="end" type="date" className="mt-1" required />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Notizen</label>
            <textarea name="notes" rows={3} className="w-full mt-1 rounded-lg border border-border bg-background p-2 text-sm" />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChangeAction(false)}>Abbrechen</Button>
            <Button type="submit" disabled={loading || !selectedCustomer || !selectedItem}>{loading ? "Erstelle..." : "Vermietung erstellen"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
