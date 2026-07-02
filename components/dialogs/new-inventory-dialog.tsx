"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createInventoryItem } from "@/app/actions/inventory";
import { Upload, X, Image as ImageIcon } from "lucide-react";

export function NewInventoryDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      // Lade Kategorien
      fetch("/api/dashboard/categories")
        .then((res) => res.json())
        .then((data) => {
          if (data.items && Array.isArray(data.items)) {
            setCategories(data.items);
            if (data.items.length > 0) {
              setSelectedCategory(data.items[0].id);
            }
          }
        })
        .catch((err) => console.error("Failed to load categories:", err));

      // Reset previews
      setImagePreviews([]);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    if (selectedCategory) {
      formData.append("categoryId", selectedCategory);
    }

    // Add image files to formData (not base64!)
    const fileInput = document.getElementById("image-upload") as HTMLInputElement;
    if (fileInput?.files) {
      Array.from(fileInput.files).forEach((file, index) => {
        formData.append(`image_${index}`, file);
      });
      formData.append("imageCount", String(fileInput.files.length));
    }

    try {
      await createInventoryItem(formData);
      onOpenChange(false);
      router.refresh();
      setImagePreviews([]);
      // Reset file input
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error(error);
      alert("Fehler beim Anlegen: " + (error instanceof Error ? error.message : "Unbekannter Fehler"));
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 3) {
      alert("Maximal 3 Bilder erlaubt");
      return;
    }

    const previews: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result as string);
        if (previews.length === files.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    const fileInput = document.getElementById("image-upload") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Neues Item anlegen</DialogTitle>
          <DialogDescription>Füge ein neues Miet-Item hinzu.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Fotos Upload */}
          <div>
            <Label>Fotos (1-3 Bilder) *</Label>
            <div className="mt-2">
              {imagePreviews.length === 0 ? (
                <div
                  onClick={() => document.getElementById("image-upload")?.click()}
                  className="cursor-pointer border-2 border-dashed border-border rounded-lg p-8 hover:border-primary transition-colors"
                >
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon className="h-12 w-12" />
                    <div className="text-sm font-medium">Fotos hochladen</div>
                    <div className="text-xs">Klicken zum Auswählen (max. 3 Bilder)</div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-full object-cover rounded-lg"
                      />
                      {index === 0 && (
                        <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                          Haupt
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {imagePreviews.length < 3 && (
                    <div
                      onClick={() => document.getElementById("image-upload")?.click()}
                      className="h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
                    >
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                📸 Bildvorschau funktioniert. Upload-Service wird bald integriert - aktuell werden Platzhalter-Bilder verwendet.
              </p>
            </div>
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              name="name"
              required
              className="mt-1"
              placeholder="z.B. Hüpfburg XL"
            />
          </div>

          {/* Kategorie & Preis */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="category">Kategorie *</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory} required>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Wählen" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price">Preis/Tag (€) *</Label>
              <Input
                id="price"
                name="pricePerDay"
                type="number"
                step="0.01"
                min="0"
                required
                className="mt-1"
                placeholder="50.00"
              />
            </div>
          </div>

          {/* Beschreibung */}
          <div>
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              name="description"
              className="mt-1"
              rows={2}
              placeholder="Was ist das Besondere an diesem Item?"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={loading || !selectedCategory || imagePreviews.length === 0}>
              {loading ? "Speichert..." : "Item anlegen"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

