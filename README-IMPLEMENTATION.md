# Leihmi - Multi-Tenant SaaS für Vermietung & Inventarverwaltung

## 🚀 Status

Das Projekt ist jetzt mit dem vollständigen UI aus dem Lovable.dev Prototyp implementiert.

## ✅ Implementiert

### Dashboard
- **Dashboard-Seite** mit KPIs, Charts (Recharts), Alerts, Reservierungen und Quick Actions
- **Sidebar Navigation** mit allen Hauptbereichen
- **Topbar** mit Titel und Untertitel

### Kernfeatures
- ✅ **Inventory Page** - Vollständige Inventarliste mit Filter, Suche und Tabelle
- ✅ **Customers Page** - Kundenliste mit Kontaktdaten und Statistiken  
- ✅ **Rentals Page** - Vermietungsübersicht mit Status-Tabs
- ✅ **Reservations Page** - Reservierungen mit Status-Übersicht

### Komponenten
- ✅ Sidebar mit Navigation
- ✅ Topbar
- ✅ PageHeader
- ✅ StatusPill mit verschiedenen Tones
- ✅ Mock-Daten für Demo

### UI/UX
- ✅ Vollständiges Design System (OKLCH Farben)
- ✅ Dark Mode Support
- ✅ Responsive Design
- ✅ shadcn/ui Komponenten integriert
- ✅ Recharts für Dashboard Charts

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: TailwindCSS + shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Database**: Prisma ORM + Supabase (noch nicht verbunden)
- **TypeScript**: Strict Mode

## 📦 Installation

```bash
npm install
```

## 🏃 Development

```bash
npm run dev
```

Öffne [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

## 📁 Struktur

```
app/
  dashboard/
    page.tsx          # Dashboard mit KPIs & Charts
    layout.tsx        # Layout mit Sidebar
    inventory/
      page.tsx        # Inventarliste
    customers/
      page.tsx        # Kundenliste
    rentals/
      page.tsx        # Vermietungen
    reservations/
      page.tsx        # Reservierungen
    
components/
  app/
    sidebar.tsx       # Navigation
    topbar.tsx        # Header
    page-header.tsx   # Page Title Component
    status-pill.tsx   # Status Badge
    
lib/
  mock-data.ts        # Demo Daten
  format.ts           # Formatierungsfunktionen
  utils.ts            # Utilities
```

## 🎨 Design System

Das Projekt nutzt ein modernes Design System mit:
- OKLCH Farbsystem für bessere Farben
- **Primärfarbe: Dunkelgrün** (wie im Lovable.dev Screenshot)
- Dunkle grüne Sidebar
- Surface Cards mit weichen Schatten
- Rounded-2xl Borders
- Custom Status Pills mit verschiedenen Tones

## 📋 Nächste Schritte

1. **Datenbank Integration**
   - [ ] Prisma Schema finalisieren
   - [ ] Supabase verbinden
   - [ ] Server Actions für CRUD

2. **Multi-Tenant**
   - [ ] Subdomain Middleware implementieren
   - [ ] Tenant Resolver
   - [ ] Row Level Security

3. **Auth**
   - [ ] Auth.js Integration
   - [ ] Login/Signup Pages
   - [ ] Protected Routes

4. **Erweiterte Features**
   - [ ] Detailseiten (Inventory Item, Customer, Rental)
   - [ ] Formulare (New Item, New Customer)
   - [ ] Kalender View
   - [ ] Image Upload (Supabase Storage)

## 📝 Notizen

- Alle Mock-Daten sind in `lib/mock-data.ts`
- Theme-Variablen in `app/globals.css`
- Komponenten folgen dem shadcn/ui Muster
- TypeScript strict mode aktiviert

## 🎯 Qualitätsziel

Production-ready SaaS - kein MVP!

