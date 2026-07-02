# Phase 2: Multi-Tenant Implementation
→ **Phase 3: Authentication**
## Nächster Schritt nach Phase 2

---

**Total: ~10-15h**

- Testing & Validation: **2-3h**
- Supabase RLS Setup: **1-2h**
- Safe Query Helpers: **2-3h**
- Prisma Schema Migration: **1-2h**
- Middleware & Context: **2-3h**
## Zeitaufwand (Schätzung)

---

- [ ] Tests für Cross-Tenant Isolation
- [ ] Keine hardcoded Tenant-IDs in Code
- [ ] Middleware validiert Tenant vor jeder Request
- [ ] Row Level Security in Supabase aktiviert
- [ ] **ALLE** Queries filtern nach `tenantId`
- [ ] **ALLE** Tabellen haben `tenantId`

## 6. Sicherheits-Checkliste

---

- Server Actions mit Tenant-Scope
- Alle direkten Prisma-Calls durch `getScopedPrisma()` ersetzen
### Schritt 4: Queries anpassen

- Testen mit verschiedenen Subdomains
- `middleware.ts` einbauen
### Schritt 3: Middleware aktivieren

```
});
  })),
    tenantId: stefan.id,
    ...item,
  data: mockInventory.map(item => ({
await prisma.inventoryItem.createMany({
// Mock data mit tenantId

});
  },
    email: "info@mecka-rentals.de",
    name: "Mecka Rentals",
    slug: "mecka",
  data: {
const mecka = await prisma.tenant.create({

});
  },
    email: "team@stefan-events.de",
    name: "Stefan Events GmbH",
    slug: "stefan",
  data: {
const stefan = await prisma.tenant.create({
// prisma/seed.ts
```typescript
### Schritt 2: Seed Data mit Tenants

```
npx prisma migrate dev --name add_tenant_id
```bash
### Schritt 1: Prisma Schema Migration

## 5. Migration Plan

---

```
127.0.0.1 mecka.localhost
127.0.0.1 stefan.localhost
```
`/etc/hosts` (Mac/Linux) oder `C:\Windows\System32\drivers\etc\hosts`:
### 4.2 Lokale Test-Config

- [ ] Hauptdomain → Marketing Page
- [ ] Ungültige Subdomain → 404
- [ ] Cross-Tenant Zugriff unmöglich
- [ ] Subdomain `mecka.localhost:3000` lädt Mecka's Daten
- [ ] Subdomain `stefan.localhost:3000` lädt Stefan's Daten
### 4.1 Test Cases

## 4. Testing & Validation

---

```
  USING ("tenantId" = current_setting('app.current_tenant_id', true)::text);
CREATE POLICY tenant_isolation ON "Rental"

  USING ("tenantId" = current_setting('app.current_tenant_id', true)::text);
CREATE POLICY tenant_isolation ON "Customer"

  USING ("tenantId" = current_setting('app.current_tenant_id', true)::text);
CREATE POLICY tenant_isolation ON "InventoryItem"
-- Policy: Users can only see their tenant's data

ALTER TABLE "Rental" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Customer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "InventoryItem" ENABLE ROW LEVEL SECURITY;
-- Enable RLS
```sql
### 3.2 Row Level Security Policies (SQL)

```
export const supabase = createClient(supabaseUrl, supabaseKey);

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

import { createClient } from "@supabase/supabase-js";
```typescript

**Datei**: `lib/supabase.ts`
### 3.1 Connection Setup

## 3. Supabase Integration

---

```
}
  };
    },
      // analog
    rental: {
    },
      // analog
    customer: {
    },
      // ... weitere Methods
        }),
          data: { ...args.data, tenantId: tenant.id },
          ...args,
        prisma.inventoryItem.create({
      create: (args: any) =>
        }),
          where: { ...args.where, tenantId: tenant.id },
        prisma.inventoryItem.findFirst({
      findUnique: (args: any) =>
        }),
          where: { ...args?.where, tenantId: tenant.id },
          ...args,
        prisma.inventoryItem.findMany({
      findMany: (args?: any) =>
    inventoryItem: {
  return {
  
  const tenant = await getCurrentTenant();
export async function getScopedPrisma() {

import { prisma } from "./prisma";
import { getCurrentTenant } from "./tenant-context";
```typescript

**Datei**: `lib/db-helpers.ts`
### 2.2 Safe Query Helper

```
}
  @@index([tenantId])
  
  // ...
  customer    Customer @relation(fields: [customerId], references: [id])
  customerId  String
  
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  tenantId    String   // KRITISCH!
  id          String   @id @default(cuid())
model Rental {

}
  @@unique([tenantId, email]) // Email unique per tenant
  @@index([tenantId])
  
  // ...
  email       String
  name        String
  
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  tenantId    String   // KRITISCH!
  id          String   @id @default(cuid())
model Customer {

}
  @@unique([tenantId, sku]) // SKU unique per tenant
  @@index([tenantId])
  
  // ...
  category    String
  sku         String
  name        String
  
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  tenantId    String   // KRITISCH!
  id          String   @id @default(cuid())
model InventoryItem {
```prisma

**Alle Tabellen bekommen `tenantId`**:
### 2.1 Prisma Schema Updates

## 2. Database: Row Level Security (Konzept)

---

```
}
  };
    slug: tenantSlug || "",
    id: tenantId,
  return {
  
  }
    throw new Error("No tenant context available");
  if (!tenantId) {
  
  const tenantSlug = headersList.get("x-tenant-slug");
  const tenantId = headersList.get("x-tenant-id");
  const headersList = await headers();
export async function getCurrentTenant() {

import { headers } from "next/headers";
```typescript

**Datei**: `lib/tenant-context.ts`
### 1.2 Tenant Context Helper

```
};
  ],
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
     */
     * - public folder
     * - favicon.ico (favicon file)
     * - _next/image (image optimization files)
     * - _next/static (static files)
     * Match all request paths except:
    /*
  matcher: [
export const config = {

}
  });
    },
      headers: requestHeaders,
    request: {
  return NextResponse.next({
  
  requestHeaders.set("x-tenant-slug", tenant.slug);
  requestHeaders.set("x-tenant-id", tenant.id);
  const requestHeaders = new Headers(request.headers);
  // Tenant in Headers packen für späteren Zugriff
  
  }
    return new NextResponse("Tenant not found", { status: 404 });
  if (!tenant) {
  
  const tenant = await getTenantBySlug(subdomain);
  // Tenant aus DB laden
  
  }
    return NextResponse.next();
    // localhost oder Hauptdomain → redirect to marketing
  if (!subdomain) {
  
  const subdomain = extractSubdomain(hostname);
  // Extract subdomain
  
  const hostname = request.headers.get("host") || "";
export async function middleware(request: NextRequest) {

import { getTenantBySlug } from "@/lib/tenant";
import { NextRequest, NextResponse } from "next/server";
// middleware.ts
```typescript
**Code Struktur**:

- Bei ungültigem Tenant → 404
- In Request Context speichern
- Tenant aus Datenbank laden
- Subdomain extrahieren (z.B. `stefan` aus `stefan.leihmi.de`)
- Host Header auslesen
**Funktionalität**:

**Datei**: `middleware.ts` (root level)
### 1.1 Tenant Resolver Middleware

## 1. Subdomain Middleware

---

## Status: ⏳ In Planung

Vollständige Multi-Tenant Architektur mit Subdomain-Routing und Tenant-Isolation.
## Ziel


