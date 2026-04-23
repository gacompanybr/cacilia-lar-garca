import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { fetchProperties, Property, PropertyType } from "@/lib/properties";
import { COMPANY_NAME } from "@/lib/whatsapp";

const types: { value: PropertyType | ""; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "casa", label: "Casa" },
  { value: "apartamento", label: "Apartamento" },
  { value: "terreno", label: "Terreno" },
  { value: "comercial", label: "Comercial" },
];

const priceRanges = [
  { value: "", label: "Qualquer preço" },
  { value: "0-200000", label: "Até R$ 200.000" },
  { value: "200000-500000", label: "R$ 200.000 - R$ 500.000" },
  { value: "500000-1000000", label: "R$ 500.000 - R$ 1.000.000" },
  { value: "1000000-99999999", label: "Acima de R$ 1.000.000" },
];

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const type = searchParams.get("type") || "";
  const city = searchParams.get("city") || "";
  const price = searchParams.get("price") || "";

  useEffect(() => {
    document.title = `Imóveis — ${COMPANY_NAME}`;
    fetchProperties()
      .then(setProperties)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (type && p.type !== type) return false;
      if (city && !p.city.toLowerCase().includes(city.toLowerCase())) return false;
      if (price) {
        const [min, max] = price.split("-").map(Number);
        if (p.price < min || p.price > max) return false;
      }
      return true;
    });
  }, [properties, type, city, price]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const clear = () => setSearchParams({});

  const FiltersPanel = (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">Tipo</label>
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <button
              key={t.value}
              onClick={() => updateParam("type", t.value)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-smooth ${
                type === t.value
                  ? "bg-brand text-brand-foreground border-brand font-semibold"
                  : "bg-background border-border hover:border-brand"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">Cidade</label>
        <input
          value={city}
          onChange={(e) => updateParam("city", e.target.value)}
          placeholder="Ex: Duartina"
          className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">Faixa de preço</label>
        <select
          value={price}
          onChange={(e) => updateParam("price", e.target.value)}
          className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        >
          {priceRanges.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>
      {(type || city || price) && (
        <Button variant="outline" onClick={clear} className="w-full">
          <X className="h-4 w-4 mr-2" /> Limpar filtros
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="bg-gradient-dark text-primary-foreground py-14">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">Imóveis disponíveis</h1>
          <p className="text-primary-foreground/70">Encontre o imóvel perfeito para você</p>
        </div>
      </section>

      <section className="py-12 flex-1">
        <div className="container-custom grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 bg-card rounded-xl p-6 shadow-card">
              <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-brand" /> Filtros
              </h2>
              {FiltersPanel}
            </div>
          </aside>

          <div className="lg:hidden">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="w-full">
              <SlidersHorizontal className="h-4 w-4 mr-2" /> {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
            </Button>
            {showFilters && (
              <div className="mt-4 bg-card rounded-xl p-6 shadow-card">{FiltersPanel}</div>
            )}
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-6">
              {loading ? "Carregando..." : (
                <><span className="font-semibold text-foreground">{filtered.length}</span> imóvel(eis) encontrado(s)</>
              )}
            </p>
            {!loading && filtered.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-xl">
                <p className="text-muted-foreground">Nenhum imóvel encontrado.</p>
                {(type || city || price) && (
                  <Button onClick={clear} className="mt-4">Limpar filtros</Button>
                )}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((p) => <PropertyCard key={p.id} property={p} />)}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Properties;
