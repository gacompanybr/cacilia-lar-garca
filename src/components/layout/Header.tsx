import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.jpeg";
import { COMPANY_NAME, WHATSAPP_DISPLAY, whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Início" },
  { to: "/imoveis", label: "Imóveis" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container-custom flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img src={logo} alt={`Logo ${COMPANY_NAME}`} className="h-14 w-14 rounded-lg object-cover" />
          <div className="hidden sm:block leading-tight">
            <div className="font-display text-base font-bold uppercase tracking-wide">{COMPANY_NAME}</div>
            <div className="text-xs text-muted-foreground">Corretora de Imóveis</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-smooth hover:text-brand",
                  isActive ? "text-brand" : "text-foreground"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-brand transition-smooth hover:scale-105"
        >
          <Phone className="h-4 w-4" />
          {WHATSAPP_DISPLAY}
        </a>

        <button
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className="md:hidden p-2 rounded-md hover:bg-muted"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <nav className="container-custom flex flex-col py-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "py-3 px-2 text-base font-medium border-b border-border last:border-0",
                    isActive ? "text-brand" : "text-foreground"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-5 py-3 font-semibold text-brand-foreground"
            >
              <Phone className="h-4 w-4" /> {WHATSAPP_DISPLAY}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
