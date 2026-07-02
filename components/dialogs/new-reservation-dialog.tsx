"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createReservation } from "@/app/actions/reservations";

type Customer = { id: string; name: string; email?: string; phone?: string };
type Item = { id: string; name: string; category?: string; pricePerDay?: number };

export function NewReservationDialog({ open, onOpenChangeAction }: { open: boolean; onOpenChangeAction: (open: boolean) => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [customerQuery, setCustomerQuery] = useState("");
  const [itemQuery, setItemQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  const [showItemSuggestions, setShowItemSuggestions] = useState(false);

  useEffect(() => {
    if (!open) return;
    // fetch customer list for autocomplete
    fetch("/api/dashboard/customers")
      .then((r) => r.json())
      .then((data) => setCustomers(data.items || []))
      .catch((e) => console.error("Failed to load customers for autocomplete", e));

    // fetch items for autocomplete
    fetch("/api/dashboard/inventory")
      .then((r) => r.json())
      .then((data) => setItems(data.items || []))
      .catch((e) => console.error("Failed to load items for autocomplete", e));
  }, [open]);

  const customerSuggestions = useMemo(() => {
    if (!customerQuery) return customers.slice(0, 8);
    const q = customerQuery.toLowerCase();
    return customers.filter((c) => (c.name || "").toLowerCase().includes(q) || (c.id || "").toLowerCase().includes(q)).slice(0, 8);
  }, [customers, customerQuery]);

  const itemSuggestions = useMemo(() => {
    if (!itemQuery) return items.slice(0, 8);
    const q = itemQuery.toLowerCase();
    return items.filter((i) => (i.name || "").toLowerCase().includes(q) || (i.id || "").toLowerCase().includes(q)).slice(0, 8);
  }, [items, itemQuery]);

  const handleSelectCustomer = (c: Customer) => {
    setSelectedCustomer(c);
    setCustomerQuery(`${c.name} · ${c.id}`);
    setShowCustomerSuggestions(false);
  };

  const handleSelectItem = (i: Item) => {
    setSelectedItem(i);
    setItemQuery(`${i.name}${i.category ? ` · ${i.category}` : ""}`);
    setShowItemSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      // ensure customerId and itemId present
      if (!selectedCustomer) {
        alert("Bitte Kunde auswählen");
        setLoading(false);
        return;
      }
      if (!selectedItem) {
        alert("Bitte Item auswählen");
        setLoading(false);
        return;
      }
      await createReservation(formData);
      onOpenChangeAction(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert((err as Error).message || "Fehler beim Anlegen der Reservierung");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Neue Reservierung anlegen</DialogTitle>
          <DialogDescription>Lege eine Reservierung an und wähle Kunde per Autocomplete aus.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Kunde *</label>
            <div className="relative">
              <input name="customerId" type="hidden" value={selectedCustomer ? selectedCustomer.id : ""} readOnly />
              <Input
                value={customerQuery}
                onChange={(e) => { setCustomerQuery(e.target.value); setShowCustomerSuggestions(true); setSelectedCustomer(null); }}
                onFocus={() => setShowCustomerSuggestions(true)}
                placeholder="Suche nach Name oder ID"
                className="mt-1"
                required
              />
              {showCustomerSuggestions && customerSuggestions.length > 0 && (
                <ul className="absolute z-50 mt-1 w-full max-h-48 overflow-auto rounded-md border bg-background p-1 shadow-lg">
                  {customerSuggestions.map((c) => (
                    <li key={c.id} className="cursor-pointer rounded px-2 py-1 hover:bg-muted" onMouseDown={(ev) => { ev.preventDefault(); handleSelectCustomer(c); }}>
                      <div className="text-sm font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.id}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Item *</label>
            <div className="relative">
              <input name="itemId" type="hidden" value={selectedItem ? selectedItem.id : ""} readOnly />
              <Input
                value={itemQuery}
                onChange={(e) => { setItemQuery(e.target.value); setShowItemSuggestions(true); setSelectedItem(null); }}
                onFocus={() => setShowItemSuggestions(true)}
                placeholder="Suche nach Item-Name"
                className="mt-1"
                required
              />
              {showItemSuggestions && itemSuggestions.length > 0 && (
                <ul className="absolute z-50 mt-1 w-full max-h-48 overflow-auto rounded-md border bg-background p-1 shadow-lg">
                  {itemSuggestions.map((i) => (
                    <li key={i.id} className="cursor-pointer rounded px-2 py-1 hover:bg-muted" onMouseDown={(ev) => { ev.preventDefault(); handleSelectItem(i); }}>
                      <div className="text-sm font-medium">{i.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {i.category} {i.pricePerDay ? `· €${i.pricePerDay}/Tag` : ""}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Startdatum *</label>
              <Input name="startDate" type="date" className="mt-1" required />
            </div>
            <div>
              <label className="text-sm font-medium">Enddatum *</label>
              <Input name="endDate" type="date" className="mt-1" required />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Notizen</label>
            <textarea name="notes" rows={3} className="w-full mt-1 rounded-lg border border-border bg-background p-2 text-sm" />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChangeAction(false)}>Abbrechen</Button>
            <Button type="submit" disabled={loading || !selectedCustomer || !selectedItem}>{loading ? "Speichert..." : "Reservierung anlegen"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
