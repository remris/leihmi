# AGENTS.md – Leihmi Engineering Rules

## Ziel

Dieses Projekt ist ein **produktives SaaS-System (Leihmi)** und KEIN MVP.

Alle Implementierungen müssen production-ready, skalierbar und sicher sein.

---

## Wichtige Trennung

* PROJECT.md = Aufgaben & Fortschritt (TODOs)
* AGENTS.md = Architektur & Coding Regeln

AGENTS.md enthält KEINE Feature-Listen.

---

## Architektur Prinzipien

### Multi-Tenant First (KRITISCH)

* Jede Tabelle hat `tenantId`
* Jede Query ist tenant-scoped
* Kein Cross-Tenant Zugriff möglich
* Tenant wird über Subdomain bestimmt

---

### Server-First (Next.js App Router)

* Default: Server Components
* Client Components nur wenn notwendig
* Business Logic in Server Actions oder server/
* Kein unnötiges Client State Management

---

### Clean Architecture

* klare Modulstruktur (features/ basiert)
* keine „God Components“
* kleine, testbare Funktionen
* klare Verantwortlichkeiten

---

## Datenbank (Prisma + Supabase)

* Prisma = einzige ORM-Schicht
* Supabase = PostgreSQL + Storage
* keine direkten SQL Queries im Code
* Migrationen über Prisma

---

## Multi-Tenant Isolation (SICHERHEIT)

Jede DB Query MUSS tenant-scoped sein:

```ts
where: { tenantId }
```

VERBOTEN:

* globale Queries
* fehlende tenantId Filter
* shared data ohne Isolation

---

## Subdomain System

* Host Header bestimmt Tenant
* Middleware resolved Tenant früh
* Fallback nur für Landing Page

---

## TypeScript Regeln

* strict mode aktiv
* KEIN any
* KEINE untyped returns
* Prisma Types bevorzugen

---

## UI / shadcn

* shadcn/ui als Standard
* Radix-based components
* Tailwind only styling
* konsistentes Design System

---

## State Management

* Server State bevorzugt (Next.js)
* kein Redux
* kein unnötiges global state management

---

## Security Regeln

* alle Inputs mit Zod validieren
* Server Actions validieren immer Input
* keine sensiblen Daten im Client
* Tenant Isolation ist Sicherheitskritisch

---

## Performance

* Server Components bevorzugen
* kein unnötiges Client Rendering
* Pagination für Listen
* Bilder über Supabase Storage

---

## Development Workflow

Jede Aufgabe wird so bearbeitet:

1. Analyse bestehender Struktur
2. Nur eine Aufgabe implementieren
3. Kein Feature-Sprawl
4. Code sauber und minimal halten
5. Tests / Build prüfen
6. PROJECT.md aktualisieren

---

## Definition of Done

Ein Feature ist nur fertig wenn:

* TypeScript fehlerfrei
* ESLint sauber
* Tenant-safe
* validiert (Zod)
* production-ready
* kein toter Code

---

## Verboten

* MVP Hacks
* unsichere Workarounds
* fehlende Tenant Isolation
* untyped Code
* unnötige Libraries
* doppelte Logik

---

## Ziel

Leihmi wird gebaut wie:

* Shopify (SaaS Architektur)
* Stripe (Engineering Qualität)
* Notion (Flexibilität)

Qualität > Geschwindigkeit
