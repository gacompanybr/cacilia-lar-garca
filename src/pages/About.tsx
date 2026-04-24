import { useEffect } from "react";
import { Eye, Heart, Target } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { COMPANY_NAME, COMPANY_FULL, CITY, CRECI } from "@/lib/whatsapp";
import hero from "@/assets/hero-1.webp";

const About = () => {
  useEffect(() => {
    document.title = "Sobre a Cacilia Aredes Imóveis | Cacilia Imóveis em Duartina";
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = "https://www.caciliaaredesimoveis.com.br/sobre";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="relative py-24 overflow-hidden">
        <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container-custom relative z-10 text-primary-foreground">
          <span className="text-brand text-sm font-bold uppercase tracking-wider">Sobre nós</span>
          <h1 className="text-4xl md:text-6xl font-display font-bold mt-2 max-w-3xl">
            Construindo histórias, realizando sonhos
          </h1>
        </div>
      </section>

      <section className="py-20">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl font-display font-bold mb-6">Nossa história</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
            <p>
              A <strong className="text-foreground">{COMPANY_FULL}</strong> nasceu do desejo de oferecer
              um atendimento verdadeiramente personalizado no mercado imobiliário de {CITY} e região.
              Com sede em Duartina, atuamos com casas, apartamentos, terrenos e imóveis comerciais —
              tanto para venda quanto para locação.
            </p>
            <p>
              Mais do que intermediar negócios, acreditamos em construir relações de confiança.
              Cada imóvel apresentado é cuidadosamente avaliado, e cada cliente é atendido com a
              atenção que merece, do primeiro contato até a entrega das chaves.
            </p>
            <p>
              Registrada no CRECI sob o número <strong className="text-foreground">{CRECI}</strong>,
              a {COMPANY_NAME} preza pela transparência, ética e segurança jurídica em todas as
              transações.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-brand text-sm font-bold uppercase tracking-wider">Nossos princípios</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-1">Missão, Visão e Valores</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Target,
                title: "Missão",
                text: "Conectar pessoas aos imóveis ideais, oferecendo atendimento humano, ético e personalizado em cada negociação.",
              },
              {
                icon: Eye,
                title: "Visão",
                text: "Ser referência em assessoria imobiliária na região de Duartina, reconhecida pela excelência e confiança.",
              },
              {
                icon: Heart,
                title: "Valores",
                text: "Transparência, respeito, comprometimento, profissionalismo e paixão pelo que fazemos.",
              },
            ].map((v) => (
              <div key={v.title} className="bg-card rounded-2xl p-8 shadow-card text-center">
                <div className="inline-flex p-4 rounded-full bg-brand/15 text-brand mb-4">
                  <v.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{v.title}</h3>
                <p className="text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-custom text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Pronto para encontrar seu imóvel?</h2>
          <p className="text-muted-foreground mb-8">
            Entre em contato conosco e descubra as melhores opções de Duartina e região.
          </p>
          <Button asChild size="lg" className="bg-gradient-brand text-brand-foreground shadow-brand hover:opacity-90">
            <Link to="/imoveis">Ver imóveis disponíveis</Link>
          </Button>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default About;
