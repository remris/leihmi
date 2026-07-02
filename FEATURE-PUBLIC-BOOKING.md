# Feature Request: Public Booking Platform für End-Kunden

## 🎯 Vision

Unsere Kunden (Vermieter wie "Stefan Events") sollen ihren **eigenen End-Kunden** ermöglichen, direkt online Mietanfragen zu stellen - **ohne Anruf, ohne E-Mail**.

---

## 📋 User Story

**Als End-Kunde** (z.B. jemand der eine Hüpfburg für eine Geburtstagsfeier braucht)  
**möchte ich** auf der Website des Vermieters das Inventar durchstöbern und online eine Mietanfrage stellen  
**damit** ich nicht anrufen oder per E-Mail nachfragen muss und sofort sehe, ob mein Wunschtermin verfügbar ist.

---

## 🌐 Zwei mögliche Ansätze

### Option A: **Public Web Portal** ⭐ (Empfohlen)
Jeder Tenant bekommt eine öffentliche Buchungsseite:
- URL: `https://stefan.leihmi.de/book`
- Responsive Web-App
- Funktioniert auf Desktop, Tablet & Mobile
- Kein App-Download nötig

**Vorteile**:
✅ Sofort verfügbar  
✅ SEO-freundlich  
✅ Keine Installation nötig  
✅ Link teilbar (WhatsApp, E-Mail)  
✅ Einfacher zu warten  

### Option B: **Native Mobile App**
Separate iOS/Android Apps.

**Nachteile**:
❌ App Store Approval  
❌ 2 Codebases (iOS + Android)  
❌ User muss App installieren  
❌ Höhere Entwicklungskosten  

**➡️ Empfehlung: Starte mit Public Web Portal (Option A)**

---

## 🎨 Design & User Flow

### 1. Landing Page (`/book`)
**Beispiel**: `https://stefan.leihmi.de/book`

```
┌─────────────────────────────────────────┐
│  [Logo] Stefan Events GmbH              │
│  "Hüpfburgen & Eventtechnik mieten"    │
│                                         │
│  [Suchleiste: "Was möchten Sie mieten?"]│
│                                         │
│  Kategorien:                            │
│  [🏰 Hüpfburgen] [🎪 Eventtechnik]     │
│  [🔧 Werkzeuge]  [🎵 DJ Equipment]     │
│                                         │
│  ⭐ Beliebteste Artikel:                │
│  ┌────────┐ ┌────────┐ ┌────────┐      │
│  │Hüpfburg│ │DJ Booth│ │Generator│     │
│  │189€/Tag│ │320€/Tag│ │65€/Tag │     │
│  └────────┘ └────────┘ └────────┘      │
└─────────────────────────────────────────┘
```

### 2. Produkt-Detailseite
```
┌─────────────────────────────────────────┐
│  ← Zurück zur Übersicht                │
│                                         │
│  Castle Royal XL                        │
│  189 € / Tag                           │
│                                         │
│  [Großes Produktbild]                  │
│  [Thumbnail] [Thumbnail] [Thumbnail]   │
│                                         │
│  Beschreibung:                          │
│  Premium Hüpfburg für bis zu 12 Kinder│
│  Maße: 4m x 4m x 3.5m                 │
│                                         │
│  📅 Verfügbarkeit prüfen:              │
│  [Von: 15.07.2026] [Bis: 17.07.2026]  │
│  [Verfügbarkeit prüfen]                │
│                                         │
│  ✅ Verfügbar!                          │
│                                         │
│  Gesamt: 378 € (2 Tage)               │
│  + Lieferung: 45 €                    │
│  = 423 €                              │
│                                         │
│  [Jetzt anfragen]                      │
└─────────────────────────────────────────┘
```

### 3. Anfrage-Formular
```
┌─────────────────────────────────────────┐
│  Ihre Anfrage                           │
│                                         │
│  Artikel: Castle Royal XL               │
│  Zeitraum: 15.-17.07.2026 (2 Tage)    │
│  Preis: 423 € inkl. Lieferung          │
│                                         │
│  Ihre Kontaktdaten:                     │
│  [Name]*                                │
│  [E-Mail]*                              │
│  [Telefon]*                             │
│  [Firma] (optional)                     │
│                                         │
│  Lieferadresse:                         │
│  [Straße + Hausnummer]*                │
│  [PLZ]* [Stadt]*                       │
│                                         │
│  Zusätzliche Informationen:             │
│  [Textarea für Notizen]                │
│                                         │
│  □ Ich akzeptiere die AGB              │
│                                         │
│  [Anfrage absenden]                    │
└─────────────────────────────────────────┘
```

### 4. Bestätigung
```
┌─────────────────────────────────────────┐
│  ✅ Anfrage erfolgreich gesendet!       │
│                                         │
│  Wir haben Ihre Mietanfrage erhalten   │
│  und werden uns innerhalb von 24h      │
│  per E-Mail bei Ihnen melden.          │
│                                         │
│  Anfrage-Nr: #REQ-2026-0123            │
│                                         │
│  Eine Bestätigung wurde an             │
│  max@example.com gesendet.             │
│                                         │
│  [Zurück zur Startseite]               │
└─────────────────────────────────────────┘
```

---

## 🛠️ Technische Implementierung

### Route Structure
```
app/
  book/                    # Public booking routes
    page.tsx              # Landing / Catalog
    [itemId]/
      page.tsx            # Item Detail
    request/
      page.tsx            # Request Form
    confirmation/
      page.tsx            # Success Page
```

### Database Schema
```prisma
model BookingRequest {
  id              String   @id @default(cuid())
  tenantId        String
  tenant          Tenant   @relation(fields: [tenantId], references: [id])
  
  // Item Info
  itemId          String
  item            InventoryItem @relation(fields: [itemId], references: [id])
  startDate       DateTime
  endDate         DateTime
  quantity        Int      @default(1)
  
  // Customer Info (nicht registriert!)
  customerName    String
  customerEmail   String
  customerPhone   String
  customerCompany String?
  
  // Address
  street          String
  postalCode      String
  city            String
  
  notes           String?
  
  // Pricing
  itemPrice       Float
  deliveryFee     Float
  totalPrice      Float
  
  // Status
  status          BookingRequestStatus @default(PENDING)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([tenantId])
  @@index([status])
}

enum BookingRequestStatus {
  PENDING       // Neu eingegangen
  CONFIRMED     // Vom Vermieter bestätigt
  CONVERTED     // In echte Vermietung umgewandelt
  REJECTED      // Abgelehnt (z.B. nicht verfügbar)
  CANCELLED     // Vom Kunden storniert
}
```

### Server Action für Anfrage
```typescript
// app/book/actions.ts
"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentTenant } from "@/lib/tenant-context";

const requestSchema = z.object({
  itemId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(5),
  customerCompany: z.string().optional(),
  street: z.string().min(3),
  postalCode: z.string().min(4),
  city: z.string().min(2),
  notes: z.string().optional(),
});

export async function submitBookingRequest(formData: FormData) {
  const tenant = await getCurrentTenant();
  
  const data = requestSchema.parse({
    itemId: formData.get("itemId"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone"),
    customerCompany: formData.get("customerCompany"),
    street: formData.get("street"),
    postalCode: formData.get("postalCode"),
    city: formData.get("city"),
    notes: formData.get("notes"),
  });
  
  // Check availability
  const item = await prisma.inventoryItem.findFirst({
    where: {
      id: data.itemId,
      tenantId: tenant.id,
    },
  });
  
  if (!item) {
    throw new Error("Item not found");
  }
  
  // Calculate price
  const days = Math.ceil(
    (new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) /
    (1000 * 60 * 60 * 24)
  );
  const itemPrice = item.pricePerDay * days;
  const deliveryFee = 45; // TODO: Calculate based on distance
  const totalPrice = itemPrice + deliveryFee;
  
  // Create request
  const request = await prisma.bookingRequest.create({
    data: {
      tenantId: tenant.id,
      itemId: item.id,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      quantity: 1,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      customerCompany: data.customerCompany,
      street: data.street,
      postalCode: data.postalCode,
      city: data.city,
      notes: data.notes,
      itemPrice,
      deliveryFee,
      totalPrice,
      status: "PENDING",
    },
  });
  
  // TODO: Send email notification to tenant
  // TODO: Send confirmation email to customer
  
  return { success: true, requestId: request.id };
}
```

---

## 🔔 Notifications & Workflow

### Für den Vermieter (Dashboard)
1. **Neue Anfrage** kommt rein
2. **Push-Benachrichtigung** im Dashboard: "Neue Mietanfrage von Max Mustermann"
3. **E-Mail** an Vermieter: "Neue Anfrage für Castle Royal XL"
4. Vermieter öffnet Anfrage im Dashboard:
   - Sieht alle Details
   - Prüft Verfügbarkeit
   - Kann **Bestätigen** oder **Ablehnen**
5. Bei Bestätigung:
   - Status → CONFIRMED
   - Kunde bekommt E-Mail
   - Optional: Kann in echte Vermietung umgewandelt werden

### Für den Kunden
1. **Bestätigungs-E-Mail** direkt nach Anfrage
2. **Update-E-Mail** wenn Vermieter bestätigt/ablehnt
3. Kann Anfrage-Status online tracken (optional)

---

## 📱 Mobile Optimierung (PWA)

Statt nativer App: **Progressive Web App (PWA)**

### Vorteile:
✅ Funktioniert wie native App  
✅ Kann zum Homescreen hinzugefügt werden  
✅ Offline-Fähigkeit  
✅ Push-Notifications möglich  
✅ Ein Codebase für alle Plattformen  

### Implementation:
```typescript
// app/manifest.ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Stefan Events - Mietanfragen",
    short_name: "Stefan Events",
    description: "Hüpfburgen & Eventtechnik online mieten",
    start_url: "/book",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1d6e4b",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
```

---

## 🎨 Branding & Customization

Jeder Tenant kann seine Public Booking Page anpassen:

### Settings → Branding:
- **Logo** hochladen
- **Primärfarbe** wählen
- **Header-Bild** für Startseite
- **Firmeninfo** (Öffnungszeiten, Kontakt)
- **AGB & Impressum** Links

### Gespeichert in Tenant-Tabelle:
```prisma
model Tenant {
  id              String   @id @default(cuid())
  slug            String   @unique
  name            String
  
  // Branding
  logo            String?
  primaryColor    String   @default("#1d6e4b")
  headerImage     String?
  
  // Contact
  email           String
  phone           String?
  address         String?
  
  // Legal
  termsUrl        String?
  privacyUrl      String?
  imprintUrl      String?
  
  // Settings
  publicBookingEnabled Boolean @default(true)
  autoConfirmRequests  Boolean @default(false)
  
  // ...
}
```

---

## 📊 Analytics für Vermieter

Dashboard zeigt:
- **Anfragen pro Monat**
- **Conversion Rate** (Anfragen → Vermietungen)
- **Beliebteste Produkte**
- **Durchschnittliche Anfragezeit**

---

## 🔐 Sicherheit

### Spam-Schutz:
- ✅ reCAPTCHA v3
- ✅ Rate Limiting (max 3 Anfragen/IP/Stunde)
- ✅ Email-Validierung

### Datenschutz:
- ✅ DSGVO-konform
- ✅ Keine Cookies ohne Zustimmung
- ✅ Datensparsamkeit

---

## 🚀 Rollout-Plan

### Phase 1: MVP (4-6 Wochen)
- [ ] Public Catalog Page
- [ ] Item Detail Page
- [ ] Request Form
- [ ] E-Mail Benachrichtigungen
- [ ] Dashboard Integration (Anfragen-Liste)

### Phase 2: Enhanced (2-3 Wochen)
- [ ] Verfügbarkeitskalender
- [ ] Multi-Item Anfragen (Warenkorb)
- [ ] PWA Support
- [ ] Branding Customization

### Phase 3: Advanced (3-4 Wochen)
- [ ] Online Payment (Anzahlung)
- [ ] Automatische Bestätigung
- [ ] Customer Portal (Anfragen tracken)
- [ ] Review System

---

## 💰 Business Value

### Für Vermieter:
✅ **24/7 Verfügbarkeit** - Kunden können jederzeit anfragen  
✅ **Weniger Telefonate** - Routine-Anfragen laufen automatisch  
✅ **Höhere Conversion** - Sofort-Verfügbarkeit erhöht Buchungen  
✅ **Professioneller Auftritt** - Moderne Online-Präsenz  

### Für End-Kunden:
✅ **Bequem** - Kein Anruf nötig  
✅ **Schnell** - Sofort sehen ob verfügbar  
✅ **Transparent** - Preise direkt sichtbar  
✅ **24/7** - Auch außerhalb Geschäftszeiten  

---

## 📎 Referenzen / Inspiration

**Ähnliche Systeme**:
- **Booqable** (Rental Software mit Online Store)
- **Rentle** (Online Rental Platform)
- **Checkfront** (Booking System)

**Design-Inspiration**:
- Airbnb (Search & Availability)
- Booking.com (Date Selection)
- Shopify (Clean Product Pages)

---

## ✅ Entscheidung

**Empfohlen**: Public Web Portal als PWA

**Begründung**:
1. Schneller entwickelbar
2. Geringere Kosten
3. Sofort nutzbar (kein App-Download)
4. SEO-Vorteile
5. Einfacher zu warten

**Native App**: Erst später, wenn nachweislich Bedarf besteht.

---

**Status**: ✅ Feature Request dokumentiert  
**Nächster Schritt**: Stakeholder Review & Priorisierung

