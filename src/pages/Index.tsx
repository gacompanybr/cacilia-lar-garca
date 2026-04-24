import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Home as HomeIcon, ShieldCheck, Users } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { SearchBar } from "@/components/SearchBar";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { fetchProperties, Property } from "@/lib/properties";
import { COMPANY_NAME, CITY } from "@/lib/whatsapp";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import heroProperty from "@/assets/property-5.jpg";

const heroImages = [hero1, heroProperty, hero2];

const Home = () => {
  const [slide, setSlide] = useState(0);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    fetchProperties().then(setProperties).catch(console.error);
  }, []);

  const featured = properties.filter((p) => p.featured).slice(0, 6);
  const latest = properties.slice(0, 3);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % heroImages.length), 6000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    document.title = "Cacilia Imóveis em Duartina | Cacilia Aredes Imóveis";
    const meta = document.querySelector('meta[name="description"]');
    const desc = "Site oficial da Cacilia Aredes Imóveis, também conhecida como Cacilia Imóveis em Duartina. Corretora de imóveis em Duartina/SP e região com casas, terrenos, chácaras e imóveis à venda.";
    if (meta) meta.setAttribute("content", desc);

    const setCanonical = (href: string) => {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = href;
    };
    setCanonical("https://www.caciliaaredesimoveis.com.br/");
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* HERO */}
      <section className="relative min-h-[640px] md:min-h-[720px] flex items-center overflow-hidden">
        {heroImages.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? "opacity-100" : "opacity-0"}`}
          >
            <img src={img} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-hero" />
          </div>
        ))}

        <div className="container-custom relative z-10 py-20">
          <h1 className="sr-only">Cacilia Aredes Imóveis - Cacilia Imóveis em Duartina/SP</h1>
          <div className="max-w-3xl text-primary-foreground animate-fade-in">
            <span className="inline-block bg-brand text-brand-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
              Imobiliária em {CITY}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.05] mb-5 text-balance">
              Encontre o imóvel <span className="text-brand">dos seus sonhos</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl">
              Casas, apartamentos, terrenos e imóveis comerciais com atendimento personalizado e transparente.
            </p>
          </div>

          <div className="mt-2">
            <SearchBar />
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setSlide(i)}
              className={`h-1.5 rounded-full transition-smooth ${i === slide ? "bg-brand w-8" : "bg-primary-foreground/50 w-4"}`}
            />
          ))}
        </div>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="py-20">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
              <div>
                <span className="text-brand text-sm font-bold uppercase tracking-wider">Selecionados</span>
                <h2 className="text-3xl md:text-4xl font-display font-bold mt-1">Imóveis em destaque</h2>
              </div>
              <Link to="/imoveis" className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-brand transition-smooth">
                Ver todos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* INSTITUTIONAL */}
      <section className="py-20 bg-secondary">
        <div className="container-custom grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-brand text-sm font-bold uppercase tracking-wider">Sobre nós</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-1 mb-5">
              Sua confiança é o nosso maior patrimônio
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              A {COMPANY_NAME} atua em {CITY} com foco em oferecer o melhor atendimento na compra,
              venda e locação de imóveis. Combinamos experiência, conhecimento de mercado e
              transparência para que cada cliente faça o melhor negócio.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Cada imóvel é tratado com cuidado, e cada cliente como único.
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/sobre">Conheça nossa história</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: HomeIcon, title: "+200", desc: "Imóveis vendidos" },
              { icon: Users, title: "+500", desc: "Famílias atendidas" },
              { icon: ShieldCheck, title: "100%", desc: "Documentação segura" },
              { icon: Award, title: "CRECI", desc: "239353 ativo" },
            ].map((s, i) => (
              <div key={i} className="bg-card rounded-xl p-6 shadow-card text-center">
                <div className="inline-flex p-3 rounded-full bg-brand/10 text-brand mb-3">
                  <s.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold">{s.title}</div>
                <div className="text-sm text-muted-foreground">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST */}
      {latest.length > 0 && (
        <section className="py-20">
          <div className="container-custom">
            <div className="mb-10">
              <span className="text-brand text-sm font-bold uppercase tracking-wider">Novidades</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold mt-1">Últimos imóveis adicionados</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          </div>
        </section>
      )}


      <section aria-label="Sobre a marca" className="py-6">
        <div className="container-custom">
          <p className="text-xs text-muted-foreground text-center max-w-3xl mx-auto">
            Cacilia Aredes Imóveis, também pesquisada como Cacilia Imóveis em Duartina,
            é uma corretora de imóveis em Duartina/SP e região.
          </p>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Home;
