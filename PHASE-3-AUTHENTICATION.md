# Phase 3: Authentication & Authorization

## Ziel
Vollständiges Auth-System mit User Management, Login, Signup und Protected Routes.

## Status: ⏳ In Planung

---

## 1. Auth System Wahl: **Auth.js (NextAuth.js v5)**

### Warum Auth.js?
- ✅ Native Next.js Integration
- ✅ Server Components Support
- ✅ Flexible Providers (Email, Google, etc.)
- ✅ Session Management
- ✅ Multi-Tenant ready

---

## 2. Installation & Setup

### 2.1 Packages installieren
```bash
npm install next-auth@beta @auth/prisma-adapter
npm install bcryptjs
npm install -D @types/bcryptjs
```

### 2.2 Auth Config
**Datei**: `auth.ts` (root level)

```typescript
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    signUp: "/signup",
    error: "/error",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { tenant: true },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid credentials");
        }

        const isValid = await compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          tenantId: user.tenantId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.tenantId = user.tenantId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.tenantId = token.tenantId as string;
      }
      return session;
    },
  },
});
```

### 2.3 Auth Route Handler
**Datei**: `app/api/auth/[...nextauth]/route.ts`

```typescript
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
```

---

## 3. Prisma Schema Updates

### 3.1 User & Account Models
```prisma
model User {
  id            String    @id @default(cuid())
  tenantId      String
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  
  email         String    @unique
  name          String?
  passwordHash  String?
  emailVerified DateTime?
  image         String?
  
  role          UserRole  @default(OPERATOR)
  
  accounts      Account[]
  sessions      Session[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([tenantId])
}

enum UserRole {
  OWNER
  ADMIN
  OPERATOR
  VIEWER
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

---

## 4. Login & Signup Pages

### 4.1 Login Page
**Datei**: `app/login/page.tsx`

```typescript
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-surface p-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              name="email"
              required
              className="mt-1"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              name="password"
              required
              className="mt-1"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-surface px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            {/* Google Icon SVG */}
          </svg>
          Google
        </Button>
      </div>
    </div>
  );
}
```

### 4.2 Signup Page
**Datei**: `app/signup/page.tsx`

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        companyName: formData.get("companyName"),
        slug: formData.get("slug"),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }

    // Auto-login after signup
    router.push("/login?registered=true");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-surface p-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Create your workspace</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Start managing your rentals in minutes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Your name</label>
            <Input
              type="text"
              name="name"
              required
              className="mt-1"
              placeholder="Max Mustermann"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              name="email"
              required
              className="mt-1"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              name="password"
              required
              minLength={8}
              className="mt-1"
              placeholder="••••••••"
            />
          </div>

          <div className="border-t border-border pt-4">
            <label className="text-sm font-medium">Company name</label>
            <Input
              type="text"
              name="companyName"
              required
              className="mt-1"
              placeholder="My Rental Company"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Workspace URL</label>
            <div className="mt-1 flex items-center gap-2">
              <Input
                type="text"
                name="slug"
                required
                pattern="[a-z0-9-]+"
                className="flex-1"
                placeholder="my-company"
              />
              <span className="text-sm text-muted-foreground">.leihmi.de</span>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating workspace..." : "Create workspace"}
          </Button>
        </form>
      </div>
    </div>
  );
}
```

---

## 5. Protected Routes

### 5.1 Middleware Update
**Datei**: `middleware.ts`

```typescript
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  
  // Public routes
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/book")
  ) {
    return NextResponse.next();
  }
  
  // Protected routes require auth
  if (!req.auth && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  
  return NextResponse.next();
});
```

### 5.2 Session Helper
**Datei**: `lib/auth-helpers.ts`

```typescript
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }
  
  return session;
}

export async function getCurrentUser() {
  const session = await auth();
  return session?.user || null;
}
```

---

## 6. Server Actions für Auth

### 6.1 Signup Action
**Datei**: `app/api/auth/signup/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, companyName, slug } = await req.json();
    
    // Validate slug availability
    const existingTenant = await prisma.tenant.findUnique({
      where: { slug },
    });
    
    if (existingTenant) {
      return NextResponse.json(
        { error: "This workspace URL is already taken" },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }
    
    // Create tenant first
    const tenant = await prisma.tenant.create({
      data: {
        slug,
        name: companyName,
        email,
      },
    });
    
    // Create user with hashed password
    const passwordHash = await hash(password, 12);
    
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        tenantId: tenant.id,
        role: "OWNER", // First user is always owner
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
```

---

## 7. Role-Based Access Control

### 7.1 Permission Helper
**Datei**: `lib/permissions.ts`

```typescript
import { UserRole } from "@prisma/client";

export const PERMISSIONS = {
  // Inventory
  inventory: {
    view: ["OWNER", "ADMIN", "OPERATOR", "VIEWER"],
    create: ["OWNER", "ADMIN", "OPERATOR"],
    edit: ["OWNER", "ADMIN", "OPERATOR"],
    delete: ["OWNER", "ADMIN"],
  },
  // Customers
  customers: {
    view: ["OWNER", "ADMIN", "OPERATOR", "VIEWER"],
    create: ["OWNER", "ADMIN", "OPERATOR"],
    edit: ["OWNER", "ADMIN", "OPERATOR"],
    delete: ["OWNER", "ADMIN"],
  },
  // Rentals
  rentals: {
    view: ["OWNER", "ADMIN", "OPERATOR", "VIEWER"],
    create: ["OWNER", "ADMIN", "OPERATOR"],
    edit: ["OWNER", "ADMIN", "OPERATOR"],
    delete: ["OWNER", "ADMIN"],
  },
  // Settings
  settings: {
    view: ["OWNER", "ADMIN"],
    edit: ["OWNER"],
  },
  // Team
  team: {
    view: ["OWNER", "ADMIN"],
    invite: ["OWNER", "ADMIN"],
    remove: ["OWNER"],
  },
} as const;

export function hasPermission(
  userRole: UserRole,
  resource: keyof typeof PERMISSIONS,
  action: "view" | "create" | "edit" | "delete" | "invite" | "remove"
) {
  const allowedRoles = PERMISSIONS[resource]?.[action] as UserRole[] | undefined;
  return allowedRoles?.includes(userRole) ?? false;
}
```

---

## 8. Testing & Validation

### Test Cases
- [ ] Signup erstellt Tenant + User
- [ ] Login mit Email/Password funktioniert
- [ ] Login mit Google funktioniert
- [ ] Session wird korrekt gespeichert
- [ ] Protected Routes redirecten zu /login
- [ ] User kann nur eigenen Tenant sehen
- [ ] Roles funktionieren korrekt
- [ ] Logout löscht Session

---

## Zeitaufwand (Schätzung)
- Auth.js Setup: **2-3h**
- Prisma Models: **1-2h**
- Login/Signup Pages: **3-4h**
- Protected Routes: **1-2h**
- RBAC System: **2-3h**
- Testing: **2-3h**

**Total: ~12-17h**

---

## ENV Variablen

```env
# Auth.js
AUTH_SECRET="your-secret-key-here" # openssl rand -base64 32
AUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

---

## Nächster Schritt nach Phase 3
→ **Phase 4: Forms & Server Actions**

