"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCustomer } from "@/app/actions/customers";

export function NewCustomerDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createCustomer(formData);
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Fehler beim Anlegen");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Neuen Kunden anlegen</DialogTitle>
          <DialogDescription>Füge einen neuen Kunden hinzu.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name *</label>
            <Input name="name" required className="mt-1" placeholder="Max Mustermann" />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input name="email" type="email" className="mt-1" placeholder="max@example.com" />
          </div>
          <div>
            <label className="text-sm font-medium">Telefon</label>
            <Input name="phone" type="tel" className="mt-1" placeholder="+49 123 456789" />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
            <Button type="submit" disabled={loading}>{loading ? "Speichert..." : "Anlegen"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

