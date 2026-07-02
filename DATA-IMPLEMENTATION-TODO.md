# Daten-Implementierung TODO

## Ziel
Echte Prisma-Daten schrittweise statt Mock-Daten verwenden. Reihenfolge: zuerst sichere tenant-scoped Reads/Writes, dann UI-Substitution.

## Abgehakt
- [x] Prisma-Schema validiert
- [x] Auth-Basis vorhanden
- [x] Middleware schützt `/dashboard/*`
- [x] Erste tenant-scoped Daten-Helper angelegt
- [x] Inventory auf Daten-Helper umgestellt
- [x] Customers auf Daten-Helper umgestellt
- [x] Rentals auf Daten-Helper umgestellt
- [x] Reservations auf Daten-Helper umgestellt
- [x] Categories auf Daten-Helper umgestellt
- [x] Dashboard-KPIs auf echte Datenbasis umgestellt

## Nächste direkte Schritte
- [ ] `booking requests` tenant-scoped anlegen und abrufen
- [ ] Mock-Daten schrittweise aus den Seiten entfernen
- [ ] Schreibpfade für Inventory, Customer, Reservation ergänzen
- [ ] Categories CRUD ergänzen
- [ ] Dashboard-Chartdaten aus echten Werten berechnen

## Datenpfad-Plan
1. CRUD-Helper in `lib/dashboard-data.ts` erweitern
2. `app/dashboard/reservations/page.tsx` auf echte Daten umstellen
3. `app/dashboard/categories/page.tsx` auf echte Daten umstellen
4. `app/dashboard/page.tsx` auf echte Daten umstellen
5. Schreibpfade für `Inventory`, `Customer`, `Reservation` ergänzen
6. Public `BookingRequest`-Flow hinzufügen

## Relevante Quellen
- `prisma/schema.prisma`
- `lib/dashboard-data.ts`
- `lib/tenant-context.ts`
- `lib/tenant.ts`
- `app/actions/inventory.ts`
- `app/dashboard/*/page.tsx`
- `app/api/auth/signup/route.ts`

## Hinweise
- Keine hardcoded Tenant-IDs
- Alle Queries müssen tenant-scoped sein
- Mock-Daten nur noch als Fallback während der Migration
