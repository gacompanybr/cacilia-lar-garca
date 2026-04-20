import { useEffect, useState } from "react";
import { Loader2, Star, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Property, PropertyType, PropertyStatus } from "@/lib/properties";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: Property | null;
  onSaved: () => void;
}

interface FormState {
  title: string;
  type: PropertyType;
  status: PropertyStatus;
  price: string;
  city: string;
  neighborhood: string;
  bedrooms: string;
  bathrooms: string;
  parking: string;
  area: string;
  description: string;
  features: string;
  featured: boolean;
}

const empty: FormState = {
  title: "", type: "casa", status: "venda", price: "",
  city: "Garça", neighborhood: "", bedrooms: "", bathrooms: "",
  parking: "", area: "", description: "", features: "", featured: false,
};

interface ExistingImage { id: string; url: string; position: number }
interface NewImage { file: File; previewUrl: string }

export const PropertyFormDialog = ({ open, onOpenChange, property, onSaved }: Props) => {
  const { user } = useAuth();
  const [form, setForm] = useState<FormState>(empty);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [newImages, setNewImages] = useState<NewImage[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (property) {
      setForm({
        title: property.title,
        type: property.type,
        status: property.status,
        price: String(property.price),
        city: property.city,
        neighborhood: property.neighborhood ?? "",
        bedrooms: property.bedrooms?.toString() ?? "",
        bathrooms: property.bathrooms?.toString() ?? "",
        parking: property.parking?.toString() ?? "",
        area: property.area?.toString() ?? "",
        description: property.description,
        features: (property.features ?? []).join(", "),
        featured: property.featured,
      });
      setExistingImages(
        (property.property_images ?? []).map((i) => ({ id: i.id, url: i.url, position: i.position }))
      );
    } else {
      setForm(empty);
      setExistingImages([]);
    }
    setNewImages([]);
    setRemovedImageIds([]);
  }, [open, property]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setNewImages((p) => [...p, ...arr]);
  };

  const removeExisting = (id: string) => {
    setExistingImages((p) => p.filter((i) => i.id !== id));
    setRemovedImageIds((p) => [...p, id]);
  };

  const removeNew = (idx: number) => {
    setNewImages((p) => p.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.title.trim() || !form.description.trim() || !form.price) {
      toast.error("Preencha título, preço e descrição.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        type: form.type,
        status: form.status,
        price: Number(form.price),
        city: form.city.trim(),
        neighborhood: form.neighborhood.trim() || null,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
        parking: form.parking ? Number(form.parking) : null,
        area: form.area ? Number(form.area) : null,
        description: form.description.trim(),
        features: form.features.split(",").map((f) => f.trim()).filter(Boolean),
        featured: form.featured,
      };

      let propertyId = property?.id;
      if (property) {
        const { error } = await supabase.from("properties").update(payload).eq("id", property.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("properties")
          .insert({ ...payload, created_by: user.id })
          .select("id")
          .single();
        if (error) throw error;
        propertyId = data.id;
      }

      // delete removed images (db + storage)
      if (removedImageIds.length > 0) {
        const removed = property?.property_images?.filter((i) => removedImageIds.includes(i.id)) ?? [];
        // delete from storage
        const paths = removed
          .map((i) => {
            const idx = i.url.indexOf("/property-images/");
            return idx >= 0 ? i.url.substring(idx + "/property-images/".length) : null;
          })
          .filter(Boolean) as string[];
        if (paths.length) await supabase.storage.from("property-images").remove(paths);
        await supabase.from("property_images").delete().in("id", removedImageIds);
      }

      // upload new images
      if (newImages.length > 0 && propertyId) {
        const startPos = existingImages.length;
        for (let i = 0; i < newImages.length; i++) {
          const { file } = newImages[i];
          const ext = file.name.split(".").pop() ?? "jpg";
          const path = `${propertyId}/${Date.now()}-${i}.${ext}`;
          const { error: upErr } = await supabase.storage
            .from("property-images")
            .upload(path, file, { contentType: file.type });
          if (upErr) throw upErr;
          const { data: pub } = supabase.storage.from("property-images").getPublicUrl(path);
          await supabase.from("property_images").insert({
            property_id: propertyId,
            url: pub.publicUrl,
            position: startPos + i,
          });
        }
      }

      toast.success(property ? "Imóvel atualizado!" : "Imóvel cadastrado!");
      onSaved();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message ?? "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full h-11 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{property ? "Editar imóvel" : "Novo imóvel"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Título *</label>
            <input className={inputCls} value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Tipo *</label>
              <select className={inputCls} value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as PropertyType })}>
                <option value="casa">Casa</option>
                <option value="apartamento">Apartamento</option>
                <option value="terreno">Terreno</option>
                <option value="comercial">Comercial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Negócio *</label>
              <select className={inputCls} value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as PropertyStatus })}>
                <option value="venda">Venda</option>
                <option value="aluguel">Aluguel</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Preço (R$) *</label>
              <input className={inputCls} type="number" step="0.01" min="0" value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Cidade *</label>
              <input className={inputCls} value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Bairro</label>
              <input className={inputCls} value={form.neighborhood}
                onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Quartos</label>
              <input className={inputCls} type="number" min="0" value={form.bedrooms}
                onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Banheiros</label>
              <input className={inputCls} type="number" min="0" value={form.bathrooms}
                onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Vagas</label>
              <input className={inputCls} type="number" min="0" value={form.parking}
                onChange={(e) => setForm({ ...form, parking: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Área (m²)</label>
              <input className={inputCls} type="number" step="0.01" min="0" value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Descrição *</label>
            <textarea className={`${inputCls} h-32 py-2 resize-none`}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Características (separadas por vírgula)</label>
            <input className={inputCls} value={form.features}
              placeholder="Piscina, Churrasqueira, Suíte"
              onChange={(e) => setForm({ ...form, features: e.target.value })} />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="h-4 w-4 accent-brand" />
            <Star className="h-4 w-4 text-brand" />
            <span className="text-sm font-semibold">Marcar como destaque</span>
          </label>

          {/* Images */}
          <div>
            <label className="block text-sm font-semibold mb-2">Fotos</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
              {existingImages.map((img) => (
                <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                  <button type="button" onClick={() => removeExisting(img.id)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {newImages.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-muted group ring-2 ring-brand">
                  <img src={img.previewUrl} alt="" className="h-full w-full object-cover" />
                  <button type="button" onClick={() => removeNew(i)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-brand flex flex-col items-center justify-center cursor-pointer text-muted-foreground hover:text-brand transition">
                <Upload className="h-6 w-6 mb-1" />
                <span className="text-xs">Adicionar</span>
                <input type="file" accept="image/*" multiple className="hidden"
                  onChange={(e) => handleFiles(e.target.files)} />
              </label>
            </div>
            <p className="text-xs text-muted-foreground">A primeira foto será a capa.</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving} className="bg-gradient-brand text-brand-foreground shadow-brand">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {property ? "Salvar alterações" : "Cadastrar imóvel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
