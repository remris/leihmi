# Implementierungs-TODO: Real Data & Funktionalität

## ✅ Erledigte Aufgaben

- [x] Prisma Schema für Tenant ↔ BookingRequest Relation repariert
- [x] Auth-Abhängigkeiten installiert (NextAuth, bcrypt)
- [x] Auth-Core angelegt (auth.ts, API-Routes)
- [x] Prisma Auth-Modelle ergänzt (User, Account, Session)
- [x] Login/Signup UI & API umgesetzt
- [x] Middleware für /dashboard/* Route-Schutz
- [x] AUTH_SECRET konfiguriert (.env.local)
- [x] Zustand Store für Client-seitiges State Management erstellt
- [x] GlobalCreateDialogs implementiert (zentrale Dialog-Verwaltung)
- [x] Alle "New..." Buttons mit triggerCreate verbunden:
  - [x] Dashboard Quick Actions
  - [x] New Rental Button
  - [x] Rentals Page
  - [x] Reservations Page
  - [x] Inventory Page
  - [x] Categories Page
  - [x] Customers Page
- [x] Image Upload für Inventory Items hinzugefügt
- [x] Customer Autocomplete (Name - ID) für Reservierungen implementiert
- [x] shadcn/ui Komponenten installiert (command, popover, label)

## 🚧 Offene Punkte

### 1. Echte Daten statt Mock-Daten

#### A. Server Actions mit Prisma verbinden
- [x] `/app/actions/inventory.ts` - createInventoryItem mit Prisma (inkl. pricePerDay, quantity, imageUrl)
- [x] `/app/actions/customers.ts` - createCustomer mit Prisma (inkl. company, city)
- [x] `/app/actions/rentals.ts` - createRental mit Prisma
- [x] `/app/actions/reservations.ts` - createReservation mit Prisma
- [x] `/app/actions/categories.ts` - createCategory mit Prisma

#### B. Dashboard-Daten von Prisma laden
- [x] `lib/dashboard-data.ts` - alle Funktionen auf echte DB-Abfragen umgestellt
  - [x] `getDashboardSummary()` - Summary von Tenant-Daten
  - [x] `getDashboardReservations()` - Reservierungen aus DB
  - [x] `getDashboardRentals()` - Rentals aus DB
  - [x] `getDashboardInventory()` - Inventory aus DB
  - [x] `getDashboardCategories()` - Categories aus DB
  - [x] `getDashboardCustomers()` - Customers aus DB

#### C. Create-Dialogs mit Server Actions verbunden
- [x] `components/app/create-dialog.tsx` nutzt jetzt Server Actions
  - [x] ItemDialog - ruft createInventoryItem auf, lädt Categories von API
  - [x] CustomerDialog - ruft createCustomer auf
  - [x] RentalDialog - ruft createRental auf, lädt Customers & Inventory von API
  - [x] ReservationDialog - ruft createReservation auf, lädt Customers von API
  - [x] CategoryDialog - ruft createCategory auf
  - [x] Nach erfolgreicher Erstellung: router.refresh() für Daten-Update
- [x] API-Route für Categories erstellt: `/api/dashboard/categories/route.ts`
- [x] useCategories Hook erstellt für Client-seitige Category-Daten
- [x] Prisma Schema erweitert: Customer.company und Customer.city hinzugefügt

### 2. UI-Verbesserungen

#### A. Logout-Button
- [ ] Logout-Button in Sidebar/Topbar hinzufügen
- [ ] signOut() von NextAuth aufrufen

#### B. Badge-Counts korrigieren
- [ ] Sidebar Navigation Badges mit echten Zahlen aus DB
- [ ] Dashboard Summary Cards mit echten Zahlen

#### C. Fehlende Funktionen in Settings
- [ ] Settings > Workspace Settings (Tenant-Name, Slug editieren)
- [ ] Settings > Branding (Logo, Farben - optional)
- [ ] Settings > Users/Team Management (Multi-User Support - optional)
- [ ] Settings > Billing über Stripe (später)

### 3. Public Booking Page

#### A. Design wie Lovable Screenshot
- [ ] `/app/book/page.tsx` umgestalten als BookLandingPage
- [ ] Hero Section mit Tenant-Branding
- [ ] Verfügbare Items anzeigen (aus DB)
- [ ] Verfügbarkeits-Check für Datum-Range
- [ ] Buchungsformular für Kunden
- [ ] "How it works", "Reviews", "FAQ" Sections (konfigurierbar)

#### B. Settings-Integration
- [ ] Preview der Public Booking Page in Settings
- [ ] Konfiguration welche Categories angezeigt werden
- [ ] Konfiguration der Sections (How it works, FAQ, etc.)

### 4. Calendar-Funktionalität
- [ ] `/dashboard/calendar` - Kalender interaktiv machen
- [ ] Auf Tag klicken → Item-Auswahl Dialog
- [ ] Drag & Drop für Reservierungen/Rentals (optional)

### 5. Analytics
- [ ] Dashboard Analytics mit echten Daten füllen
- [ ] Charts mit realen Rental/Revenue-Daten

### 6. Tenant-Kontext Fehler beheben
- [ ] "No tenant context available" Fehler in Inventory/Customers fixen
- [ ] Sicherstellen dass Subdomain-Detection funktioniert
- [ ] Oder Fallback auf User's default Tenant

### 7. Detail-Pages
- [ ] `/dashboard/rentals/[id]` - Rental Details ansehen/bearbeiten
- [ ] `/dashboard/reservations/[id]` - Reservation Details
- [ ] `/dashboard/inventory/[id]` - Inventory Item Details
- [ ] `/dashboard/customers/[id]` - Customer Details

### 8. Leere /new Pages entfernen
- [ ] `/dashboard/rentals/new/page.tsx` löschen (durch Dialog ersetzt)
- [ ] `/dashboard/reservations/new/page.tsx` löschen
- [ ] `/dashboard/categories/new/page.tsx` löschen
- [ ] `/dashboard/inventory/new/page.tsx` löschen

## 🎯 Nächste Schritte (Priorität)

1. **Server Actions implementieren** - Echte Datenbank-Operationen
2. **Dashboard-Daten von DB laden** - Mock-Daten ersetzen
3. **Tenant-Kontext Fehler fixen** - Subdomain-Detection
4. **Public Booking Page** - Haupt-Feature für Kunden
5. **Logout & Navigation** - UX-Verbesserungen
6. **Settings-Funktionalität** - Tenant-Konfiguration

## 📝 Notizen

- Alle Dialogs funktionieren jetzt zentral über `triggerCreate()`
- Store ist bereit für Server Action Integration
- Build ist erfolgreich ✅
- NextAuth läuft mit Credentials Provider

