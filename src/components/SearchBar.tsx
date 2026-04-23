import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const types = [
  { value: "", label: "Todos os tipos" },
  { value: "casa", label: "Casa" },
  { value: "apartamento", label: "Apartamento" },
  { value: "terreno", label: "Terreno" },
  { value: "comercial", label: "Comercial" },
];

const priceRanges = [
  { value: "", label: "Qualquer preço" },
  { value: "0-200000", label: "Até R$ 200.000" },
  { value: "200000-500000", label: "R$ 200.000 a R$ 500.000" },
  { value: "500000-1000000", label: "R$ 500.000 a R$ 1.000.000" },
  { value: "1000000-99999999", label: "Acima de R$ 1.000.000" },
];

export const SearchBar = () => {
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (city) params.set("city", city);
    if (price) params.set("price", price);
    navigate(`/imoveis?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-card/95 backdrop-blur rounded-2xl shadow-2xl p-4 md:p-6 grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]"
    >
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase">Tipo</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        >
          {types.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase">Cidade</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ex: Duartina"
          className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase">Faixa de preço</label>
        <select
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        >
          {priceRanges.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>
      <div className="flex items-end">
        <Button type="submit" size="lg" className="w-full md:w-auto h-11 bg-gradient-brand text-brand-foreground hover:opacity-90 shadow-brand font-semibold">
          <Search className="h-4 w-4 mr-2" /> Buscar
        </Button>
      </div>
    </form>
  );
};
