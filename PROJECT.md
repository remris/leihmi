# PROJECT.md – Leihmi SaaS

## Projektübersicht

Leihmi ist ein **Multi-Tenant SaaS für Vermietung & Inventarverwaltung**.

Ziel:
Ein System für kleine und mittlere Vermieter (z. B. Hüpfburgen, Werkzeuge, Eventtechnik), mit dem sie:

* Inventar verwalten
* Verfügbarkeiten prüfen
* Online Buchungen annehmen
* Kunden verwalten
* Vermietungen sauber abwickeln

Jeder Kunde (Tenant) hat eine eigene Subdomain:

* stefan.leihmi.de
* mecka.leihmi.de

Später: eigene Domains möglich.

---

## Status

🚧 Projekt in aktiver Entwicklung

Qualitätsziel: **Production-ready SaaS (kein MVP)**

---

## Aktueller Fortschritt

### Erledigt
- [x] Prisma-Schema für Auth-Modelle und Tenant↔BookingRequest validiert
- [x] Auth-Basis mit Login/Signup angelegt
- [x] Middleware schützt `/dashboard/*`
- [x] Inventory-Server-Action tenant-aware gemacht
- [x] Dashboard-Read-APIs für Inventory, Customers und Reservations angelegt
- [x] CRUD-Start für Inventory, Customers und Reservations serverseitig ergänzt
- [x] Server Actions für Inventory, Customers, Categories (Create/Update/Delete)
- [x] API Routes mit vollständigem CRUD (GET/POST/PATCH/DELETE)
- [x] Tenant-Context server-only abgesichert
- [x] Public Booking Request API tenant-sicher
- [x] Dashboard-Seiten laden echte DB-Daten (kein Mock)
- [x] Logout-Button im Topbar
- [x] New Item/Customer Dialoge funktionsfähig

### Nächste direkte Schritte
- [ ] New Rental/Reservation Dialoge
- [ ] Edit/Delete Funktionen für alle Entities
- [ ] Verfügbarkeitslogik für Inventory Units
- [ ] Zod-Validierung für alle Formulare
- [ ] Error Handling standardisieren

---

## Tech Stack

* Next.js 15 (App Router)
* React
* TypeScript
* TailwindCSS
* shadcn/ui (Radix / Nova Theme)
* Prisma ORM
* Supabase (PostgreSQL + Storage)
* Auth.js (oder später integriert)
* Zod (Validation)

---

## Architektur Ziel

* Multi-Tenant First Architecture
* Server-first (Next.js App Router)
* Clean Code + modulare Struktur
* Skalierbares SaaS Design

---

## KRITISCH: Multi-Tenant Regeln

* Jede Tabelle MUSS `tenantId` enthalten
* Jede Query MUSS tenant-scoped sein
* Kein Cross-Tenant Zugriff erlaubt
* Tenant wird über Subdomain (Host Header) erkannt
* Sicherheitskritischer Kern des Systems

---

## Roadmap / Aufgabenliste

### 1. Projekt Setup

* [ ] Next.js Projekt strukturieren
* [ ] Prisma initialisieren
* [ ] Supabase verbinden
* [ ] ENV Konfiguration
* [ ] Grundlayout erstellen
* [ ] shadcn/ui Setup abschließen

---

### 2. Core Architektur

* [ ] Tenant Model erstellen
* [ ] User Model erstellen
* [ ] Subdomain Middleware (Tenant Resolver)
* [ ] Base Repository / DB Layer Struktur
* [ ] Auth System integrieren

---

### 3. Inventar System (KERNFEATURE)

* [ ] Inventory Items erstellen
* [ ] Kategorien System
* [ ] Bilder Upload (Supabase Storage)
* [ ] Inventory Units (Seriennummern optional)
* [ ] Status (verfügbar / verliehen / reserviert)

---

### 4. Buchungssystem

* [ ] Reservierungen
* [ ] Vermietungen (aktive Rentals)
* [ ] Verfügbarkeitslogik
* [ ] Kalender Ansicht
* [ ] Konfliktprüfung (keine Doppelbuchungen)

---

### 5. Kundenmanagement

* [ ] Kunden anlegen
* [ ] Kundenhistorie
* [ ] Zuordnung zu Rentals
* [ ] Kontaktinformationen

---

### 6. Admin Dashboard

* [ ] Dashboard Layout
* [ ] Tabellen (Inventar, Kunden, Rentals)
* [ ] Detailseiten
* [ ] Filter & Suche

---

### 7. Public Booking Page

* [ ] Öffentliche Tenant Seite
* [ ] Produktübersicht
* [ ] Buchungsformular
* [ ] Verfügbarkeitsanzeige

---

### 8. Erweiterte Features

* [ ] QR Codes für Items
* [ ] E-Mail Benachrichtigungen
* [ ] Rechnungen
* [ ] Statistik Dashboard
* [ ] Stripe Integration (Payments)
* [ ] Rollen & Permissions

---

### 9. SaaS Features

* [ ] Subscription System
* [ ] Eigene Domains
* [ ] Plan Limits (Artikelanzahl etc.)
* [ ] Onboarding Flow

---

### 10. Qualität & Production Readiness

* [ ] TypeScript Strict Mode
* [ ] ESLint clean
* [ ] Performance Optimierung
* [ ] Error Handling System
* [ ] Logging System
* [ ] Testing Setup (später)

---

## Entwicklungsregeln

* Immer nur eine Aufgabe gleichzeitig
* Keine Feature-Sprünge
* Kein ungenutzter Code
* Wiederverwendbare Komponenten
* Server Components bevorzugen
* Zod Validation überall

---

## Definition of Done

Ein Task ist nur fertig wenn:

* TypeScript ohne Fehler
* ESLint sauber
* Tenant-safe
* validiert (Zod)
* getestet im Browser
* kein toter Code
* production-ready

---

## Ziel des Projekts

Leihmi soll gebaut werden wie:

* Shopify (Multi-Tenant SaaS)
* Stripe (Engineering Qualität)
* Notion (Flexibilität)

---

## Wichtig

Dieses Dokument ist die **Single Source of Truth für den Entwicklungsfortschritt**.
Die Agents.md fügt hierztu noch rules hinzu