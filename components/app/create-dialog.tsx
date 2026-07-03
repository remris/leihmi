"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    subscribeCreate,
    type CreateKind,
} from "@/lib/store";
import { useCategories } from "@/lib/use-categories";
import { useCustomers } from "@/lib/use-customers";
import { useInventory } from "@/lib/use-inventory";
import { createInventoryItem } from "@/app/actions/inventory";
import { createCustomer } from "@/app/actions/customers";
import { createRental } from "@/app/actions/rentals";
import { createReservation } from "@/app/actions/reservations";
import { createCategory } from "@/app/actions/categories";

function todayISO(offset = 0) {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
}

export function GlobalCreateDialogs() {
    const [open, setOpen] = useState<CreateKind | null>(null);

    useEffect(() => subscribeCreate((k: CreateKind) => setOpen(k)), []);

    return (
        <>
            <ItemDialog open={open === "item"} onOpenChange={(o) => !o && setOpen(null)} />
            <CustomerDialog open={open === "customer"} onOpenChange={(o) => !o && setOpen(null)} />
            <RentalDialog open={open === "rental"} onOpenChange={(o) => !o && setOpen(null)} />
            <ReservationDialog open={open === "reservation"} onOpenChange={(o) => !o && setOpen(null)} />
            <CategoryDialog open={open === "category"} onOpenChange={(o) => !o && setOpen(null)} />
        </>
    );
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
    return (
        <div className="space-y-1.5">
            <Label className="text-[12px] font-medium">{label}</Label>
            {children}
            {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
        </div>
    );
}

/* ---------- Item ---------- */
function ItemDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
    const router = useRouter();
    const categories = useCategories();
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState<string>("");
    const [price, setPrice] = useState("50");
    const [qty, setQty] = useState("1");
    const [desc, setDesc] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setName("");
            setCategoryId(categories[0]?.id ?? "");
            setPrice("50");
            setQty("1");
            setDesc("");
            setImageUrl("");
        }
    }, [open]);

    const canSave = name.trim() && categoryId && Number(price) > 0 && Number(qty) > 0;

    const handleSave = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", name.trim());
            formData.append("description", desc.trim());
            formData.append("categoryId", categoryId);
            formData.append("pricePerDay", price);
            formData.append("quantity", qty);
            if (imageUrl.trim()) {
                formData.append("imageUrl", imageUrl.trim());
            }

            await createInventoryItem(formData);
            onOpenChange(false);
            router.refresh();
        } catch (error) {
            console.error("Error creating inventory item:", error);
            alert(error instanceof Error ? error.message : "Fehler beim Anlegen");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Neues Objekt</DialogTitle>
                    <DialogDescription>Neues Objekt zu deinem Katalog hinzufügen.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <Field label="Name">
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="z. B. Partyzelt 6×8m" />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Kategorie">
                            <Select value={categoryId} onValueChange={setCategoryId}>
                                <SelectTrigger><SelectValue placeholder="Auswählen" /></SelectTrigger>
                                <SelectContent>
                                    {categories.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Menge">
                            <Input type="number" min={1} value={qty} onChange={(e) => setQty(e.target.value)} />
                        </Field>
                    </div>
                    <Field label="Preis pro Tag (EUR)">
                        <Input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} />
                    </Field>
                    <Field label="Bild-URL" hint="Optional - Link zum Produktbild">
                        <Input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                        />
                    </Field>
                    {imageUrl && (
                        <div className="rounded-md border p-2">
                            <img
                                src={imageUrl}
                                alt="Preview"
                                className="h-32 w-full object-cover rounded"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        </div>
                    )}
                    <Field label="Beschreibung">
                        <Textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Kurze interne Beschreibung" />
                    </Field>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
                    <Button
                        disabled={!canSave || loading}
                        onClick={handleSave}
                    >{loading ? "Speichert..." : "Objekt hinzufügen"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/* ---------- Customer ---------- */
function CustomerDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [company, setCompany] = useState("");
    const [city, setCity] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setName("");
            setEmail("");
            setPhone("");
            setCompany("");
            setCity("");
        }
    }, [open]);

    const canSave = name.trim() && /\S+@\S+\.\S+/.test(email) && phone.trim();

    const handleSave = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", name.trim());
            formData.append("email", email.trim());
            formData.append("phone", phone.trim());
            if (company.trim()) formData.append("company", company.trim());
            if (city.trim()) formData.append("city", city.trim());

            await createCustomer(formData);
            onOpenChange(false);
            router.refresh();
        } catch (error) {
            console.error("Error creating customer:", error);
            alert(error instanceof Error ? error.message : "Fehler beim Anlegen");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Neuer Kunde</DialogTitle>
                    <DialogDescription>Kunden-Datensatz anlegen.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <Field label="Vollständiger Name">
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Max Mustermann" />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="E-Mail">
                            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="max@example.com" />
                        </Field>
                        <Field label="Telefon">
                            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+49 …" />
                        </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Firma" hint="Optional">
                            <Input value={company} onChange={(e) => setCompany(e.target.value)} />
                        </Field>
                        <Field label="Stadt" hint="Optional">
                            <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Berlin" />
                        </Field>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
                    <Button
                        disabled={!canSave || loading}
                        onClick={handleSave}
                    >{loading ? "Speichert..." : "Kunden hinzufügen"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/* ---------- Rental ---------- */
function RentalDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
    const router = useRouter();
    const customers = useCustomers();
    const inventory = useInventory();
    const [customerId, setCustomerId] = useState("");
    const [itemId, setItemId] = useState("");
    const [start, setStart] = useState(todayISO());
    const [end, setEnd] = useState(todayISO(2));
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setCustomerId(customers[0]?.id ?? "");
            setItemId(inventory[0]?.id ?? "");
            setStart(todayISO());
            setEnd(todayISO(2));
            setNotes("");
        }
    }, [open]);

    const canSave = customerId && itemId && start && end && new Date(end) >= new Date(start);

    const handleSave = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("customerId", customerId);
            formData.append("start", start);
            formData.append("end", end);
            if (notes.trim()) formData.append("notes", notes.trim());

            await createRental(formData);
            onOpenChange(false);
            router.refresh();
        } catch (error) {
            console.error("Error creating rental:", error);
            alert(error instanceof Error ? error.message : "Fehler beim Anlegen");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Neue Vermietung</DialogTitle>
                    <DialogDescription>Vermietung für einen Kunden erstellen.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <Field label="Kunde">
                        <Select value={customerId} onValueChange={setCustomerId}>
                            <SelectTrigger><SelectValue placeholder="Kunde auswählen" /></SelectTrigger>
                            <SelectContent>
                                {customers.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}{c.company ? ` · ${c.company}` : ""}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field label="Objekt">
                        <Select value={itemId} onValueChange={setItemId}>
                            <SelectTrigger><SelectValue placeholder="Objekt auswählen" /></SelectTrigger>
                            <SelectContent>
                                {inventory.map((i: any) => (
                                    <SelectItem key={i.id} value={i.id}>{i.name} · {i.pricePerDay}€/Tag</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Startdatum">
                            <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
                        </Field>
                        <Field label="Enddatum">
                            <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
                        </Field>
                    </div>
                    <Field label="Notizen" hint="Optional">
                        <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </Field>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
                    <Button
                        disabled={!canSave || loading}
                        onClick={handleSave}
                    >{loading ? "Speichert..." : "Vermietung erstellen"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/* ---------- Reservation ---------- */
function ReservationDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
    const router = useRouter();
    const [customers, setCustomers] = useState<any[]>([]);
    const [openCombobox, setOpenCombobox] = useState(false);
    const [customerId, setCustomerId] = useState("");
    const [itemsLabel, setItemsLabel] = useState("");
    const [start, setStart] = useState(todayISO(3));
    const [end, setEnd] = useState(todayISO(5));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            // Load customers from API
            fetch("/api/dashboard/customers")
                .then((r) => r.json())
                .then((d) => setCustomers(d.items || []))
                .catch(() => setCustomers([]));

            setCustomerId("");
            setItemsLabel("");
            setStart(todayISO(3));
            setEnd(todayISO(5));
        }
    }, [open]);

    const selectedCustomer = customers.find((c: any) => c.id === customerId);
    const canSave = customerId && itemsLabel.trim() && new Date(end) >= new Date(start);

    const handleSave = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("customerId", customerId);
            formData.append("startDate", start);
            formData.append("endDate", end);

            await createReservation(formData);
            onOpenChange(false);
            router.refresh();
        } catch (error) {
            console.error("Error creating reservation:", error);
            alert(error instanceof Error ? error.message : "Fehler beim Anlegen");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Neue Reservierung</DialogTitle>
                    <DialogDescription>Reservierung für einen Kunden erstellen.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <Field label="Kunde">
                        <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openCombobox}
                                    className="w-full justify-between"
                                >
                                    {selectedCustomer
                                        ? `${selectedCustomer.name} - ${selectedCustomer.id}`
                                        : "Kunden auswählen"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput placeholder="Kunden suchen" />
                                    <CommandEmpty>Keine Kunden gefunden</CommandEmpty>
                                    <CommandGroup>
                                        {customers.map((customer: any) => (
                                            <CommandItem
                                                key={customer.id}
                                                value={`${customer.name} ${customer.id}`}
                                                onSelect={() => {
                                                    setCustomerId(customer.id);
                                                    setOpenCombobox(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        customerId === customer.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {customer.name} - {customer.id}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </Field>
                    <Field label="Objekte">
                        <Input value={itemsLabel} onChange={(e) => setItemsLabel(e.target.value)} placeholder="z. B. Burgen Royal XL + 20 Stühle" />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Startdatum">
                            <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
                        </Field>
                        <Field label="Enddatum">
                            <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
                        </Field>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
                    <Button
                        disabled={!canSave || loading}
                        onClick={handleSave}
                    >{loading ? "Speichert..." : "Reservierung erstellen"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/* ---------- Category ---------- */
function CategoryDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) setName("");
    }, [open]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", name.trim());

            await createCategory(formData);
            onOpenChange(false);
            router.refresh();
        } catch (error) {
            console.error("Error creating category:", error);
            alert(error instanceof Error ? error.message : "Fehler beim Anlegen");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Neue Kategorie</DialogTitle>
                    <DialogDescription>Neue Kategorie für Objekte anlegen.</DialogDescription>
                </DialogHeader>
                <Field label="Name">
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="z. B. Beschallungsanlagen" />
                </Field>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
                    <Button
                        disabled={!name.trim() || loading}
                        onClick={handleSave}
                    >{loading ? "Speichert..." : "Kategorie hinzufügen"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}