# Fixes Needed - Übersicht

## 🐛 Kritische Bugs

### Calendar Page (`/dashboard/calendar`)
- [x] **"New booking" Button** - Modal öffnen statt Link ✅
- [x] **Tag-Klick im Kalender** - Modal öffnen ✅
- [ ] **Events** - Zeigt Mock-Daten, sollte echte Rentals/Reservations laden

### Inventory Page (`/dashboard/inventory`)
- [x] **"Add item" Button** - Dialog wird jetzt gerendert ✅

### Categories Page (`/dashboard/categories`)
- [x] **"Manage" Dropdown** - Add Item, Edit, Delete Optionen ✅
- [x] **Feature**: Direkt von Kategorie aus Item erstellen ✅

### Customer Detail Page
- [x] **Erstellt**: `/dashboard/customers/[id]/page.tsx` ✅
- [x] **Zeigt**: Kontaktinfo, Statistiken, Rentals, Reservations ✅

### Settings Page (`/dashboard/settings`)
- [x] **Company Settings speicherbar** ✅
- [x] **User Management funktioniert** ✅
- [ ] **Branding** - Logo-Upload implementieren (Uploadthing/Cloudinary)
- [ ] **Branding** - Farben speichern in TenantSettings
- [ ] **Billing** - Stripe SDK + Integration
- [ ] **Public Page Config** - How it works, Reviews, FAQ speichern

## 📋 Noch zu implementieren

### Stripe Billing (Niedrige Priorität)
- [ ] Stripe SDK installieren
- [ ] Subscription Plans definieren (Free, Pro, Enterprise)
- [ ] Checkout-Flow
- [ ] Webhook für Subscription-Events
- [ ] Plan-Features-Check in Middleware

### Settings Erweiterungen
- [ ] Logo-Upload Service (Uploadthing oder Cloudinary)
- [ ] TenantSettings Model im Schema für Branding
- [ ] Public Page Configuration speichern
- [ ] Email-Service für User-Einladungen (Resend/SendGrid)

### Nice-to-Have Features
- [ ] Drag & Drop im Calendar
- [ ] Week/Timeline View im Calendar
- [ ] Export-Funktionen (CSV, PDF)
- [ ] Email-Benachrichtigungen
- [ ] SMS-Benachrichtigungen

## ✅ HEUTE ERLEDIGT

### Calendar
- ✅ "New booking" Button öffnet Modal
- ✅ Tag-Klick öffnet Modal

### Inventory  
- ✅ "Add item" Button funktioniert (Dialog wird gerendert)

### Categories
- ✅ "Manage" Dropdown mit Add Item, Edit, Delete
- ✅ Direkt von Kategorie aus Items erstellen

### Customers
- ✅ Customer Detail Page erstellt
- ✅ Zeigt Kontaktinfo, Statistiken, Rentals, Reservations

## 📋 Implementierungs-Plan

### Phase 1: Modal-System überall integrieren ✅
- [x] GlobalCreateDialogs erstellt
- [ ] Calendar: New Booking Button → Modal
- [ ] Calendar: Tag-Klick → Modal mit Datum
- [ ] Inventory: Add Item → Modal
- [ ] Categories: Add Item from Category → Modal

### Phase 2: Customer Detail reparieren
- [ ] Route prüfen: `/dashboard/customers/[id]/page.tsx`
- [ ] Daten-Laden implementieren
- [ ] UI für Customer-Details erstellen

### Phase 3: Calendar mit echten Daten
- [ ] Rentals/Reservations für Kalender laden
- [ ] Events im Kalender anzeigen
- [ ] Farb-Kodierung nach Status

### Phase 4: Settings komplett machen
- [ ] TenantSettings Model erweitern
- [ ] Workspace Settings speichern
- [ ] Branding (Logo-Upload + Farben)
- [ ] User-Management
- [ ] Stripe Billing Integration
- [ ] Invoice-Einstellungen

## 🎯 Priorität

1. **SOFORT**: Modal-System für Calendar, Inventory, Categories
2. **HOCH**: Customer Detail reparieren
3. **MITTEL**: Calendar echte Daten
4. **MITTEL**: Settings speicherbar machen
5. **NIEDRIG**: Stripe Billing (komplex)

## ✅ Bereits erledigt
- Basic CRUD via Dialoge funktioniert
- Datenbank Seeding
- Public Booking Page
- Logout-Funktion
- Calendar Modal-System
- Inventory Add Item Dialog
- Categories Manage Dropdown  
- Customer Detail Page

## 🚀 Nächste Schritte

### Priorität 1 - Calendar echte Daten
1. Rentals/Reservations für Kalender laden
2. Events im Kalender anzeigen nach Datum
3. Status-basierte Farben

### Priorität 2 - Settings speicherbar
1. TenantSettings Model im Schema anlegen
2. Server Actions für Settings erstellen
3. Company-Info speichern
4. Branding (Logo-Upload via Uploadthing/Cloudinary)

### Priorität 3 - User Management
1. User einladen (Email-Einladungen)
2. Rollen ändern
3. User entfernen

### Priorität 4 - Stripe Billing
1. Stripe SDK installieren
2. Subscription Plans definieren
3. Checkout-Flow
4. Webhook für Subscription-Events

