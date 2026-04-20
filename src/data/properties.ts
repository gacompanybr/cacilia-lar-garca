import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";

export type PropertyType = "casa" | "apartamento" | "terreno" | "comercial";
export type PropertyStatus = "venda" | "aluguel";

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  city: string;
  neighborhood?: string;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  area?: number; // m²
  description: string;
  features?: string[];
  images: string[];
  featured?: boolean;
  createdAt: string; // ISO
}

/**
 * 📌 COMO ADICIONAR NOVOS IMÓVEIS:
 * 1. Importe a imagem no topo deste arquivo (ou use uma URL externa).
 * 2. Copie um dos objetos abaixo e altere os campos.
 * 3. Garanta que o `id` seja único.
 *
 * Para imagens vindas dos posts do Facebook, salve em src/assets/
 * ou hospede e use a URL diretamente no array `images`.
 */
export const properties: Property[] = [
  {
    id: "1",
    title: "Casa Moderna com 3 Suítes em Garça",
    type: "casa",
    status: "venda",
    price: 650000,
    city: "Garça",
    neighborhood: "Jardim América",
    bedrooms: 3,
    bathrooms: 3,
    parking: 2,
    area: 220,
    description:
      "Linda casa moderna com 3 suítes amplas, sala de estar e jantar integradas, cozinha planejada, área gourmet com churrasqueira e piscina. Acabamento de alto padrão em bairro nobre de Garça.",
    features: ["Piscina", "Churrasqueira", "Cozinha planejada", "Suítes", "Quintal amplo"],
    images: [property1, property5, property2, property6],
    featured: true,
    createdAt: "2026-04-15",
  },
  {
    id: "2",
    title: "Apartamento Aconchegante no Centro",
    type: "apartamento",
    status: "venda",
    price: 320000,
    city: "Garça",
    neighborhood: "Centro",
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    area: 78,
    description:
      "Apartamento bem localizado no centro de Garça, próximo a comércios, escolas e serviços. Sala ampla, 2 dormitórios, cozinha com armários e varanda com vista privilegiada.",
    features: ["Elevador", "Portaria", "Varanda", "Armários planejados"],
    images: [property2, property6],
    featured: true,
    createdAt: "2026-04-12",
  },
  {
    id: "3",
    title: "Terreno Plano 360m² — Excelente Localização",
    type: "terreno",
    status: "venda",
    price: 145000,
    city: "Garça",
    neighborhood: "Jardim Paulista",
    area: 360,
    description:
      "Terreno totalmente plano, pronto para construir, em loteamento estruturado com asfalto, água, luz e esgoto. Ótima opção para investimento ou construção da casa dos sonhos.",
    features: ["Plano", "Asfalto", "Água e luz", "Documentação ok"],
    images: [property3],
    featured: false,
    createdAt: "2026-04-10",
  },
  {
    id: "4",
    title: "Sala Comercial no Centro de Garça",
    type: "comercial",
    status: "aluguel",
    price: 2800,
    city: "Garça",
    neighborhood: "Centro",
    area: 90,
    bathrooms: 2,
    description:
      "Sala comercial ampla em ponto privilegiado do centro. Ideal para escritórios, clínicas ou consultórios. Vitrine para a rua, ar-condicionado e estacionamento próximo.",
    features: ["Ar-condicionado", "Vitrine", "Banheiros", "Localização nobre"],
    images: [property4],
    featured: true,
    createdAt: "2026-04-08",
  },
  {
    id: "5",
    title: "Casa Alto Padrão com Piscina e Vista",
    type: "casa",
    status: "venda",
    price: 1250000,
    city: "Garça",
    neighborhood: "Residencial dos Ipês",
    bedrooms: 4,
    bathrooms: 5,
    parking: 4,
    area: 380,
    description:
      "Espetacular casa de alto padrão com 4 suítes, sendo uma master com closet, piscina aquecida, área gourmet completa, jardim paisagístico e vista panorâmica. Imóvel para família exigente.",
    features: ["Piscina aquecida", "Closet", "4 suítes", "Área gourmet", "Jardim", "Automação"],
    images: [property5, property1, property2],
    featured: true,
    createdAt: "2026-04-05",
  },
  {
    id: "6",
    title: "Apartamento Novo com Lazer Completo",
    type: "apartamento",
    status: "venda",
    price: 480000,
    city: "Garça",
    neighborhood: "Vila Industrial",
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    area: 95,
    description:
      "Apartamento novo, nunca habitado, em condomínio com piscina, academia, salão de festas e playground. 3 dormitórios sendo 1 suíte, varanda gourmet e 2 vagas.",
    features: ["Suíte", "Varanda gourmet", "Lazer completo", "2 vagas"],
    images: [property2, property6, property5],
    featured: false,
    createdAt: "2026-04-02",
  },
];

export const formatPrice = (price: number, status: PropertyStatus = "venda") => {
  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(price);
  return status === "aluguel" ? `${formatted}/mês` : formatted;
};

export const propertyTypeLabel: Record<PropertyType, string> = {
  casa: "Casa",
  apartamento: "Apartamento",
  terreno: "Terreno",
  comercial: "Comercial",
};
