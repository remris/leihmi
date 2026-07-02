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
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }

    router.push("/login?registered=true");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Create your workspace</h1>
          <p className="mt-2 text-sm text-muted-foreground">Start managing your rentals in minutes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? <div className="rounded-lg bg-destructive/15 p-3 text-sm text-destructive">{error}</div> : null}

          <div>
            <label className="text-sm font-medium">Your name</label>
            <Input type="text" name="name" required className="mt-1" placeholder="Max Mustermann" />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <Input type="email" name="email" required className="mt-1" placeholder="you@example.com" />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <Input type="password" name="password" required minLength={8} className="mt-1" placeholder="••••••••" />
          </div>

          <div className="border-t border-border pt-4">
            <label className="text-sm font-medium">Company name</label>
            <Input type="text" name="companyName" required className="mt-1" placeholder="My Rental Company" />
          </div>

          <div>
            <label className="text-sm font-medium">Workspace URL</label>
            <div className="mt-1 flex items-center gap-2">
              <Input type="text" name="slug" required pattern="[a-z0-9-]+" className="flex-1" placeholder="my-company" />
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

