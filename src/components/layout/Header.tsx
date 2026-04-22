import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Menu, Phone, User as UserIcon, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo-icon.png";
import { COMPANY_NAME, WHATSAPP_DISPLAY, whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { to: "/", label: "Início" },
  { to: "/imoveis", label: "Imóveis" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, profile, isCorretor, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const initial = (profile?.full_name?.[0] ?? user?.email?.[0] ?? "U").toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="container-custom flex h-20 items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3 shrink-0" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt={`Logo ${COMPANY_NAME}`}
            className="h-12 w-12 object-contain"
            width={512}
            height={512}
          />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-display text-[15px] font-bold uppercase tracking-[0.18em] text-foreground">
              CACILIA M AREDES
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Corretora de Imóveis
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "relative px-4 py-2 text-sm font-medium tracking-wide transition-smooth hover:text-brand",
                  "after:absolute after:left-4 after:right-4 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-brand after:transition-all",
                  isActive
                    ? "text-brand after:opacity-100"
                    : "text-foreground/80 after:opacity-0"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-brand transition-smooth hover:scale-105"
          >
            <Phone className="h-4 w-4" />
            {WHATSAPP_DISPLAY}
          </a>

          {/* User menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Menu do usuário"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-brand text-brand-foreground font-bold shadow-brand hover:scale-105 transition-smooth"
                >
                  {initial}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 z-50 bg-popover">
                <DropdownMenuLabel>
                  <div className="font-semibold truncate">{profile?.full_name || "Minha conta"}</div>
                  <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                  {isCorretor && (
                    <span className="mt-1 inline-block text-[10px] font-bold uppercase bg-brand text-brand-foreground px-1.5 py-0.5 rounded">
                      Corretor
                    </span>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isCorretor && (
                  <DropdownMenuItem onClick={() => navigate("/painel")}>
                    <LayoutDashboard className="h-4 w-4 mr-2" /> Painel
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => navigate("/minha-conta")}>
                  <UserIcon className="h-4 w-4 mr-2" /> Minha conta
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/auth"
              aria-label="Entrar"
              title="Entrar"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:border-brand hover:text-brand transition-smooth"
            >
              <UserIcon className="h-5 w-5" />
            </Link>
          )}

          <button
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="md:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
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
