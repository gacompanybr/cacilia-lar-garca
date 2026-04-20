import { supabase } from "@/integrations/supabase/client";

export type PropertyType = "casa" | "apartamento" | "terreno" | "comercial";
export type PropertyStatus = "venda" | "aluguel";

export interface PropertyImage {
  id: string;
  url: string;
  position: number;
}

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  city: string;
  neighborhood: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parking: number | null;
  area: number | null;
  description: string;
  features: string[];
  featured: boolean;
  created_at: string;
  property_images?: PropertyImage[];
}

export const propertyTypeLabel: Record<PropertyType, string> = {
  casa: "Casa",
  apartamento: "Apartamento",
  terreno: "Terreno",
  comercial: "Comercial",
};

export const formatPrice = (price: number, status: PropertyStatus = "venda") => {
  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(price);
  return status === "aluguel" ? `${formatted}/mês` : formatted;
};

export const fetchProperties = async (): Promise<Property[]> => {
  const { data, error } = await supabase
    .from("properties")
    .select("*, property_images(id, url, position)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((p) => ({
    ...p,
    price: Number(p.price),
    area: p.area != null ? Number(p.area) : null,
    property_images: (p.property_images ?? []).sort(
      (a: PropertyImage, b: PropertyImage) => a.position - b.position
    ),
  })) as Property[];
};

export const fetchProperty = async (id: string): Promise<Property | null> => {
  const { data, error } = await supabase
    .from("properties")
    .select("*, property_images(id, url, position)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    ...data,
    price: Number(data.price),
    area: data.area != null ? Number(data.area) : null,
    property_images: (data.property_images ?? []).sort(
      (a: PropertyImage, b: PropertyImage) => a.position - b.position
    ),
  } as Property;
};

export const propertyImageUrls = (p: Property): string[] => {
  const imgs = p.property_images ?? [];
  return imgs.length > 0 ? imgs.map((i) => i.url) : ["/placeholder.svg"];
};
