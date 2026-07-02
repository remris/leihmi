# Aktuelle Probleme & Offene Aufgaben

## 🔴 Kritische Fehler (müssen sofort behoben werden)

### 1. Prisma Client nicht regeneriert
**Status:** ⚠️ Nach Migration
**Problem:** Der Prisma Client muss nach Schema-Änderungen neu generiert werden
**Lösung:** 
```bash
# Dev-Server stoppen, dann:
npx prisma generate
# oder einfach Dev-Server neu starten (regeneriert automatisch)
npm run dev
```

### 2. TypeScript Fehler in rentals/route.ts
**Status:** ⚠️ Wird nach Prisma Generate behoben
**Problem:** `createdAt` wird nicht erkannt (weil Prisma Client veraltet)
**Datei:** `app/api/dashboard/rentals/route.ts:32`

---

## 🟡 Funktionalitäts-Probleme

### Dialog-Buttons ohne Funktion
- [ ] `/dashboard` → "New Rental" Button
- [ ] `/dashboard/rentals` → "New Rental" Button  
- [ ] `/dashboard/reservations` → "New Reservation" Button
- [ ] `/dashboard/inventory` → "Add Item" Button (öffnet Dialog, aber speichert nicht)
- [ ] `/dashboard/categories` → "New Category" Button
- [ ] `/dashboard/customers` → "New Customer" Button
- [ ] `/dashboard/calendar` → "+ New Booking" Button (falscher redirect)
- [ ] `/dashboard/analytics` → Alle Buttons ohne Funktion

**Root Cause:** Die Dialoge in `components/app/create-dialog.tsx` und `components/dialogs/*` haben unvollständige Implementierungen.

### Fehlende Autocomplete-Felder
- [ ] New Reservation → Customer-Auswahl (aktuell nur Input, sollte Autocomplete sein)
- [ ] New Reservation → Item-Auswahl (sollte Autocomplete sein)
- [ ] New Rental → Customer-Auswahl (sollte Autocomplete sein)
- [ ] New Rental → Item-Auswahl (sollte Autocomplete sein)

### Mockdaten noch vorhanden
- [x] ~~Sidebar Badges~~ → **ERLEDIGT** (verwendet jetzt Live-Daten)
- [ ] `/dashboard/settings` → Workspace Settings zeigt Mock-Daten
- [ ] AI Insights im Dashboard (kann auskommentiert werden)

### Bild-Upload für Items
**Problem:** Aktuell nur URL-Input, sollte echten Datei-Upload haben
**Anforderungen:**
- 1-3 Fotos pro Item hochladbar
- Erstes Foto wird als Hauptbild angezeigt
- Verwende `@vercel/blob` (bereits installiert)
- Benötigt `BLOB_READ_WRITE_TOKEN` Environment Variable

**Dateien:**
- `components/dialogs/new-inventory-dialog.tsx`
- Neue Upload-API: `app/api/upload/route.ts`

---

## 🟢 Feature-Requests

### Public Booking Page
**Priorität:** 🔥 HOCH
**Anforderung:** Seite soll aussehen wie Lovable-Screenshot
**Route:** `/book` (auch via Subdomain: `stefan.leihmi.de`)
**Features:**
- Verfügbare Items anzeigen (aus Inventory)
- Verfügbarkeits-Status live
- Kategorien-Filter
- How it works Section (konfigurierbar)
- Reviews Section (konfigurierbar)
- FAQ Section (konfigurierbar)
- Buchungs-Flow komplett

**Settings-Integration:**
- Konfiguration über `/dashboard/settings`
- Welche Kategorien sollen öffentlich sein?
- Welche Sections sollen angezeigt werden?
- Branding (Logo, Farben)

### Calendar Verbesserungen
- [ ] Klick auf Tag → Modal zur Item-Auswahl öffnen
- [ ] Item auswählen → Reservation/Rental erstellen
- [ ] Drag & Drop für bestehende Rentals/Reservations

### Settings erweitern
**Aktueller Status:** Viele Sections ohne Funktion

#### Workspace Settings
- [ ] Echte Daten statt Mock-Daten
- [ ] Speichern-Funktionalität

#### Branding
- [ ] Logo-Upload
- [ ] Farbschema-Auswahl
- [ ] Custom Domain Settings

#### Users & Permissions
- [ ] User-Liste anzeigen (aktuell: `users is not defined` Fehler)
- [ ] Invite-Dialog funktional machen
- [ ] Rollen-Management (OWNER, ADMIN, OPERATOR, VIEWER)

#### Billing
- [ ] Stripe-Integration
- [ ] Plan-Auswahl (3 Pläne)
- [ ] Payment-Flow
- [ ] Subscription-Management

### Logout-Button
- [ ] In Topbar hinzufügen
- [ ] In Settings/User-Menu hinzufügen

### Detail-Seiten
- [ ] `/dashboard/inventory/[id]` → Item not found (fixen)
- [ ] `/dashboard/customers/[id]` → Customer not found (fixen)
- [ ] Kategorie-Detail: Direkt Item erstellen können
- [ ] Kategorie "Manage"-Button ohne Funktion

---

## 🗑️ Aufräumen

### Leere/Unnötige Pages löschen
Diese Pages wurden erstellt, sollten aber über Dialoge gelöst werden:
- [ ] `app/dashboard/rentals/new/page.tsx` (leer)
- [ ] `app/dashboard/categories/new/page.tsx` (leer)  
- [ ] `app/dashboard/reservations/new/page.tsx` (leer)

**Fehler:** `The default export is not a React Component in "/dashboard/rentals/new/page"`

---

## 📊 Offene TypeScript/Import-Fehler

### Runtime Errors
```
useCategories is not defined
components/app/create-dialog.tsx (74:24)
```

```
useCustomers is not defined
components/app/create-dialog.tsx (272:23)
```

```
Dialog is not defined
app/dashboard/settings/settings-client.tsx (262:8)
```

```
users is not defined
app/dashboard/settings/settings-client.tsx (167:18)
```

```
DropdownMenu is not defined
app/dashboard/categories/categories-client.tsx (32:18)
```

### Syntax Errors
```
Return statement is not allowed here
./app/dashboard/calendar/page.tsx (66:3)
./app/dashboard/settings/page.tsx (17:3)
```

### API Errors
```
SyntaxError: Failed to execute 'json' on 'Response': Unexpected end of JSON input
lib/use-categories.ts (15:26)
```

---

## 🎯 Nächste Schritte (Priorität)

### Phase 1: Kritische Fehler beheben ✅
1. ✅ Prisma Schema-Fehler beheben (Rental timestamps)
2. ⏳ Prisma Client regenerieren (automatisch beim Dev-Server-Neustart)
3. ⏳ Import-Fehler in Components beheben

### Phase 2: Basis-Funktionalität herstellen
1. Alle Dialog-Komponenten funktional machen
   - Customer erstellen
   - Item erstellen (mit Bild-Upload)
   - Kategorie erstellen
   - Reservation erstellen (mit Autocomplete)
   - Rental erstellen (mit Autocomplete)

2. Detail-Seiten reparieren
   - Inventory Detail
   - Customer Detail

3. Leere Pages entfernen

### Phase 3: Public Booking Page (WICHTIG!)
1. Layout nach Lovable-Vorbild
2. Items mit Verfügbarkeit anzeigen
3. Buchungs-Flow
4. Sections (How it works, Reviews, FAQ)
5. Settings-Integration

### Phase 4: Settings & Billing
1. Workspace Settings speicherbar machen
2. Branding-Konfiguration
3. User-Management
4. Stripe-Integration

### Phase 5: Polish
1. Calendar verbessern (Drag & Drop)
2. Logout-Funktionalität
3. Performance-Optimierungen

---

## 🔧 Aktueller Status

**Funktionierende Features:**
- ✅ Authentifizierung (Login/Signup)
- ✅ Multi-Tenant-System
- ✅ Datenbank-Seeding
- ✅ Dashboard-Übersicht (teilweise)
- ✅ Listen-Ansichten (Rentals, Reservations, Inventory, Customers, Categories)
- ✅ API-Routen für CRUD-Operationen

**In Entwicklung:**
- ⏳ Dialog-Funktionalität (Create-Operationen)
- ⏳ Bild-Upload
- ⏳ Public Booking Page

**Noch nicht begonnen:**
- ❌ Settings-Funktionalität
- ❌ Billing/Stripe
- ❌ Detail-Seiten
- ❌ Calendar-Interaktivität
- ❌ User-Management

---

## 📝 Notizen

### Vercel Blob Setup
Token erhalten über: https://vercel.com/dashboard → Storage → Blob
Environment Variable: `BLOB_READ_WRITE_TOKEN`

### Login Credentials (Development)
```
Email: stefan@example.com
Password: password123
Subdomain: stefan.leihmi.de (localhost:3000 in dev)
```

### Wichtige Dateien zum Bearbeiten
- `components/app/create-dialog.tsx` - Alle Create-Dialoge
- `components/dialogs/new-inventory-dialog.tsx` - Item-Dialog mit Upload
- `app/book/page.tsx` - Public Booking Page
- `app/dashboard/settings/settings-client.tsx` - Settings-Funktionalität

