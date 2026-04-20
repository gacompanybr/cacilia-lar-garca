import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Bath, Bed, Car, Check, Maximize, MapPin, MessageCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { fetchProperty, formatPrice, propertyTypeLabel, propertyImageUrls, Property } from "@/lib/properties";
import { whatsappPropertyLink, COMPANY_NAME } from "@/lib/whatsapp";
import { useAuth } from "@/contexts/AuthContext";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const { profile } = useAuth();

  useEffect(() => {
    if (!id) return;
    fetchProperty(id)
      .then((p) => {
        setProperty(p);
        if (p) document.title = `${p.title} — ${COMPANY_NAME}`;
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container-custom py-32 text-center text-muted-foreground">Carregando...</div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container-custom py-32 text-center">
          <h1 className="text-3xl font-bold mb-4">Imóvel não encontrado</h1>
          <Button asChild><Link to="/imoveis">Ver todos os imóveis</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = propertyImageUrls(property);
  const greeting = profile?.full_name
    ? `Olá, sou ${profile.full_name}. Tenho interesse neste imóvel: ${property.title}`
    : `Olá, tenho interesse neste imóvel: ${property.title}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container-custom py-6">
        <Link to="/imoveis" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand transition-smooth">
          <ArrowLeft className="h-4 w-4" /> Voltar para imóveis
        </Link>
      </div>

      <section className="container-custom pb-12">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] mb-10">
          <div className="relative rounded-xl overflow-hidden bg-muted aspect-[16/10]">
            <img src={images[active]} alt={property.title} className="h-full w-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex md:flex-col gap-3 md:max-h-[500px] overflow-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`shrink-0 w-24 md:w-28 aspect-square rounded-lg overflow-hidden border-2 transition-smooth ${
                    active === i ? "border-brand" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="bg-brand text-brand-foreground text-xs font-bold px-3 py-1 rounded-full uppercase">
                {propertyTypeLabel[property.type]}
              </span>
              <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase">
                {property.status === "venda" ? "Venda" : "Aluguel"}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">{property.title}</h1>
            <div className="flex items-center gap-1.5 text-muted-foreground mb-6">
              <MapPin className="h-5 w-5 text-brand" />
              <span>{property.neighborhood ? `${property.neighborhood}, ` : ""}{property.city}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
              {property.bedrooms != null && (
                <div className="bg-secondary rounded-xl p-4 text-center">
                  <Bed className="h-6 w-6 mx-auto text-brand mb-1" />
                  <div className="text-xl font-bold">{property.bedrooms}</div>
                  <div className="text-xs text-muted-foreground">Quartos</div>
                </div>
              )}
              {property.bathrooms != null && (
                <div className="bg-secondary rounded-xl p-4 text-center">
                  <Bath className="h-6 w-6 mx-auto text-brand mb-1" />
                  <div className="text-xl font-bold">{property.bathrooms}</div>
                  <div className="text-xs text-muted-foreground">Banheiros</div>
                </div>
              )}
              {property.parking != null && (
                <div className="bg-secondary rounded-xl p-4 text-center">
                  <Car className="h-6 w-6 mx-auto text-brand mb-1" />
                  <div className="text-xl font-bold">{property.parking}</div>
                  <div className="text-xs text-muted-foreground">Vagas</div>
                </div>
              )}
              {property.area != null && (
                <div className="bg-secondary rounded-xl p-4 text-center">
                  <Maximize className="h-6 w-6 mx-auto text-brand mb-1" />
                  <div className="text-xl font-bold">{property.area}</div>
                  <div className="text-xs text-muted-foreground">m²</div>
                </div>
              )}
            </div>

            <h2 className="text-2xl font-bold mb-3">Descrição</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line mb-10">
              {property.description}
            </p>

            {property.features && property.features.length > 0 && (
              <>
                <h2 className="text-2xl font-bold mb-4">Características</h2>
                <ul className="grid sm:grid-cols-2 gap-3 mb-6">
                  {property.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand/15 text-brand">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 self-start">
            <div className="bg-card rounded-2xl shadow-card-hover p-6 border border-border">
              <div className="text-sm text-muted-foreground mb-1">
                {property.status === "venda" ? "Valor de venda" : "Aluguel mensal"}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {formatPrice(property.price, property.status)}
              </div>

              <a
                href={whatsappPropertyLink(greeting)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-whatsapp text-whatsapp-foreground font-semibold py-4 rounded-xl shadow-lg hover:opacity-90 transition-smooth"
              >
                <MessageCircle className="h-5 w-5" fill="currentColor" />
                Tenho interesse
              </a>

              <p className="text-xs text-muted-foreground text-center mt-4">
                {profile?.full_name
                  ? `Mensagem assinada como ${profile.full_name}`
                  : "Atendimento rápido via WhatsApp"}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default PropertyDetails;
