import { Link } from "react-router-dom";
import { Facebook, Instagram, MapPin, Phone, Mail } from "lucide-react";
import logo from "@/assets/logo.png";
import { COMPANY_FULL, CRECI, CITY, WHATSAPP_DISPLAY, FACEBOOK_URL, whatsappLink } from "@/lib/whatsapp";

export const Footer = () => {
  return (
    <footer className="bg-gradient-dark text-primary-foreground mt-20">
      <div className="container-custom py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="Cacilia Aredes Imóveis - Cacilia Imóveis em Duartina SP" className="h-14 w-14 object-contain" />
            <div>
              <div className="font-display font-bold text-lg uppercase">Cacilia Aredes Imóveis</div>
              <div className="text-xs text-brand">CRECI: {CRECI}</div>
            </div>
          </div>
          <p className="text-sm text-primary-foreground/70 max-w-md">
            Cacilia Aredes Imóveis, também pesquisada como Cacilia Imóveis em Duartina,
            é uma corretora de imóveis em Duartina/SP e região.
            Atendimento personalizado e transparente.
          </p>
          <p className="text-xs text-primary-foreground/50 mt-3 max-w-md">
            Cacilia Imóveis em Duartina · Corretora de imóveis em Duartina/SP e região · CRECI {CRECI}
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-brand">Navegação</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-brand transition-smooth">Início</Link></li>
            <li><Link to="/imoveis" className="hover:text-brand transition-smooth">Imóveis</Link></li>
            <li><Link to="/sobre" className="hover:text-brand transition-smooth">Sobre</Link></li>
            <li><Link to="/contato" className="hover:text-brand transition-smooth">Contato</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-brand">Contato</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-brand shrink-0" />
              <span>{CITY} e região</span>
            </li>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-brand transition-smooth">
                <Phone className="h-4 w-4 text-brand" /> {WHATSAPP_DISPLAY}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand" />
              <a href="mailto:contato@caciliaaredes.com.br" className="hover:text-brand transition-smooth">contato@caciliaaredes.com.br</a>
            </li>
            <li className="flex items-center gap-3 pt-2">
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-brand hover:text-brand-foreground transition-smooth">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Instagram" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-brand hover:text-brand-foreground transition-smooth">
                <Instagram className="h-4 w-4" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container-custom py-5 text-xs text-primary-foreground/60 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} {COMPANY_FULL}. Todos os direitos reservados.</p>
          <p>CRECI: {CRECI}</p>
        </div>
      </div>
    </footer>
  );
};
