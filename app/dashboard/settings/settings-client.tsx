"use client";

import { useState } from "react";
import { Building2, Palette, Users as UsersIcon, CreditCard, Boxes, Trash2 } from "lucide-react";
import { Topbar } from "@/components/app/topbar";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { updateTenantSettings } from "@/app/actions/settings";
import { inviteTeamMember, removeUser } from "@/app/actions/users";
import { useRouter } from "next/navigation";

type Tenant = {
  id: string;
  name: string;
  slug: string;
};

type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
};

export default function SettingsClient({
  tenant,
  users
}: {
  tenant: Tenant;
  users: User[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState(tenant.name);
  const [contactEmail, setContactEmail] = useState("");
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("OPERATOR");

  const handleSaveCompany = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", companyName);
      formData.append("contactEmail", contactEmail);
      await updateTenantSettings(formData);
      router.refresh();
      alert("Einstellungen gespeichert!");
    } catch (error) {
      alert("Fehler beim Speichern");
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", inviteEmail);
      formData.append("role", inviteRole);
      const result = await inviteTeamMember(formData);
      setShowInviteDialog(false);
      setInviteEmail("");
      router.refresh();
      alert(result.message || "Benutzer eingeladen!");
    } catch (error: any) {
      alert(error.message || "Fehler beim Einladen");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (userId: string, userName: string) => {
    if (!confirm(`Benutzer ${userName} entfernen?`)) return;

    try {
      await removeUser(userId);
      router.refresh();
      alert("Benutzer entfernt");
    } catch (error: any) {
      alert(error.message || "Fehler beim Entfernen des Benutzers");
    }
  };

  return (
    <>
      <Topbar title="Einstellungen" />
      <main className="flex-1 px-4 py-6 lg:px-7 lg:py-8">
        <PageHeader
          title="Workspace-Einstellungen"
          description="Verwalte Firmenprofil, Team, Abrechnung und Integrationen."
        />

        <Tabs defaultValue="company" className="mt-6">
          <TabsList className="flex-wrap">
            <TabsTrigger value="company"><Building2 className="h-3.5 w-3.5" />Firma</TabsTrigger>
            <TabsTrigger value="branding"><Palette className="h-3.5 w-3.5" />Branding</TabsTrigger>
            <TabsTrigger value="users"><UsersIcon className="h-3.5 w-3.5" />Team</TabsTrigger>
            <TabsTrigger value="billing"><CreditCard className="h-3.5 w-3.5" />Abrechnung</TabsTrigger>
            <TabsTrigger value="public"><Boxes className="h-3.5 w-3.5" />Öffentliche Seite</TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="mt-5">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <div>
                <h3 className="text-sm font-semibold">Firmeninformationen</h3>
                <p className="mt-1 text-xs text-muted-foreground">Wird auf Rechnungen und der öffentlichen Buchungsseite angezeigt.</p>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium">Firmenname</label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Öffentliche Subdomain</label>
                  <Input
                    value={`${tenant.slug}.leihmi.de`}
                    disabled
                    className="mt-1"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Support kontaktieren, um die Subdomain zu ändern</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Kontakt-E-Mail</label>
                  <Input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="kontakt@example.com"
                    className="mt-1"
                  />
                </div>

                {/* Public booking preview */}
                <div className="mt-6">
                  <div className="text-sm font-semibold">Vorschau der öffentlichen Buchungsseite</div>
                  <div className="mt-2 flex items-center gap-3">
                    <Input
                      readOnly
                      value={`https://${tenant.slug}.leihmi.de`}
                      className="flex-1"
                    />
                    <Button asChild size="sm">
                      <a href="/book" target="_blank" rel="noreferrer">Vorschau</a>
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Öffnet eine lokale Vorschau. Bei Deployment verfügbar unter deiner Subdomain.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={handleSaveCompany} disabled={loading}>
                  {loading ? "Speichert..." : "Änderungen speichern"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="branding" className="mt-5">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <div>
                <h3 className="text-sm font-semibold">Branding</h3>
                <p className="mt-1 text-xs text-muted-foreground">Logo und Farben für deinen öffentlichen Katalog.</p>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl font-bold">
                    {tenant.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Workspace-Logo</div>
                    <div className="text-xs text-muted-foreground">PNG oder SVG · max 2MB</div>
                  </div>
                  <Button variant="outline" size="sm">Hochladen (kommt bald)</Button>
                </div>

                <div>
                  <label className="text-sm font-medium">Akzentfarbe</label>
                  <Input type="color" defaultValue="#1d6e4b" className="mt-1 h-10" />
                  <p className="mt-1 text-xs text-muted-foreground">Wird für Buttons und Hervorhebungen genutzt</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button disabled>Speichern (kommt bald)</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-5">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold">Teammitglieder</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Zugriffe und Rollen im Team verwalten.</p>
                </div>
                <Button size="sm" onClick={() => setShowInviteDialog(true)}>Einladen</Button>
              </div>

              <div className="mt-6 space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-[11px] font-bold text-background">
                      {(user.name || user.email).substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{user.name || user.email}</div>
                      <div className="text-[11.5px] text-muted-foreground">{user.email}</div>
                    </div>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[11.5px] font-medium text-muted-foreground">
                      {user.role}
                    </span>
                    {user.role !== "OWNER" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleRemoveUser(user.id, user.name || user.email)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="mt-5">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <div>
                <h3 className="text-sm font-semibold">Abrechnung & Plan</h3>
                <p className="mt-1 text-xs text-muted-foreground">Verwalte dein Abo über Stripe.</p>
              </div>

              <div className="mt-6">
                <div className="rounded-lg border-2 border-primary bg-primary/5 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-semibold">Kostenloser Plan</div>
                      <div className="text-xs text-muted-foreground">Derzeit aktiv</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">€0</div>
                      <div className="text-xs text-muted-foreground">pro Monat</div>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2 text-xs">
                    <li>✓ Bis zu 50 Objekte</li>
                    <li>✓ Unbegrenzte Vermietungen</li>
                    <li>✓ Öffentliche Buchungsseite</li>
                  </ul>
                </div>

                <div className="mt-4">
                  <Button className="w-full" disabled>
                    Upgrade zu Pro (kommt bald - Stripe Integration)
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="public" className="mt-5">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <div>
                <h3 className="text-sm font-semibold">Öffentliche Seiten-Einstellungen</h3>
                <p className="mt-1 text-xs text-muted-foreground">Abschnitte deiner Buchungsseite anpassen.</p>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium">Text: Wie es funktioniert</label>
                  <textarea
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-border bg-background p-3 text-sm"
                    placeholder="Beschreibe deinen Buchungsprozess..."
                  />
                </div>

                <div>
                  <Button variant="outline" size="sm" disabled>
                    Bewertungen bearbeiten (kommt bald)
                  </Button>
                </div>

                <div>
                  <Button variant="outline" size="sm" disabled>
                    FAQ bearbeiten (kommt bald)
                  </Button>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button disabled>Speichern (kommt bald)</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Invite User Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Benutzer einladen</DialogTitle>
            <DialogDescription>Einladung senden, um dem Workspace beizutreten.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">E-Mail-Adresse</label>
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="kollege@example.com"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Rolle</label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin - Volle Rechte</SelectItem>
                  <SelectItem value="OPERATOR">Operator - Vermietungen verwalten</SelectItem>
                  <SelectItem value="VIEWER">Viewer - Nur Lesen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>Abbrechen</Button>
            <Button onClick={handleInviteUser} disabled={loading || !inviteEmail}>
              {loading ? "Lädt..." : "Einladung senden"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
