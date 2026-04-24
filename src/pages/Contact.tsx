import { useEffect, useState } from "react";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CITY, COMPANY_NAME, WHATSAPP_DISPLAY, whatsappLink } from "@/lib/whatsapp";
import { useAuth } from "@/contexts/AuthContext";

const Contact = () => {
  const { profile } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  useEffect(() => {
    document.title = "Contato | Cacilia Aredes Imóveis - Duartina/SP";
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = "https://www.caciliaaredesimoveis.com.br/contato";
  }, []);

  useEffect(() => {
    if (profile) {
      setForm((f) => ({
        ...f,
        name: f.name || profile.full_name || "",
        phone: f.phone || profile.phone || "",
      }));
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error("Preencha todos os campos.");
      return;
    }
    const msg = `Olá, me chamo ${form.name} (${form.phone}). ${form.message}`;
    window.open(whatsappLink(msg), "_blank");
    toast.success("Redirecionando para o WhatsApp...");
    setForm({ name: "", phone: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="bg-gradient-dark text-primary-foreground py-14">
        <div className="container-custom">
          <span className="text-brand text-sm font-bold uppercase tracking-wider">Fale conosco</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold mt-1">Entre em contato</h1>
          <p className="text-primary-foreground/70 mt-2">Estamos prontos para te atender</p>
        </div>
      </section>

      <section className="py-16 flex-1">
        <div className="container-custom grid gap-10 lg:grid-cols-2">
          {/* Info */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Informações de contato</h2>
            <div className="space-y-4 mb-8">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-card hover:shadow-card-hover transition-smooth">
                <span className="p-3 rounded-full bg-whatsapp/15 text-whatsapp"><MessageCircle className="h-5 w-5" /></span>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold">WhatsApp</div>
                  <div className="font-semibold">{WHATSAPP_DISPLAY}</div>
                </div>
              </a>
              <div className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-card">
                <span className="p-3 rounded-full bg-brand/15 text-brand"><Phone className="h-5 w-5" /></span>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold">Telefone</div>
                  <div className="font-semibold">{WHATSAPP_DISPLAY}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-card">
                <span className="p-3 rounded-full bg-brand/15 text-brand"><Mail className="h-5 w-5" /></span>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold">E-mail</div>
                  <div className="font-semibold">contato@caciliaaredes.com.br</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-card">
                <span className="p-3 rounded-full bg-brand/15 text-brand"><MapPin className="h-5 w-5" /></span>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold">Atendimento</div>
                  <div className="font-semibold">{CITY} e região</div>
                </div>
              </div>
            </div>

            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-whatsapp text-whatsapp-foreground font-semibold py-4 rounded-xl shadow-lg hover:opacity-90 transition-smooth"
            >
              <MessageCircle className="h-5 w-5" fill="currentColor" />
              Falar agora no WhatsApp
            </a>
          </div>

          {/* Form */}
          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-card-hover">
            <h2 className="text-2xl font-bold mb-6">Envie uma mensagem</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Nome</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Telefone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  placeholder="(14) 99999-9999"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Mensagem</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand resize-none"
                  placeholder="Conte como podemos te ajudar..."
                />
              </div>
              <Button type="submit" size="lg" className="w-full bg-gradient-brand text-brand-foreground hover:opacity-90 shadow-brand font-semibold">
                Enviar mensagem
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Sua mensagem será enviada via WhatsApp.
              </p>
            </form>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Contact;
