import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres").max(100),
});

const signUpSchema = signInSchema.extend({
  fullName: z.string().trim().min(2, "Informe seu nome").max(100),
  phone: z.string().trim().min(8, "Telefone inválido").max(20),
});

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", fullName: "", phone: "" });

  useEffect(() => {
    document.title = mode === "login" ? "Entrar — Cacilia M Aredes" : "Cadastrar — Cacilia M Aredes";
  }, [mode]);

  useEffect(() => {
    if (!loading && user) navigate("/");
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "login") {
        const parsed = signInSchema.safeParse(form);
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }
        const { error } = await signIn(parsed.data.email, parsed.data.password);
        if (error) {
          toast.error(error.includes("Invalid") ? "E-mail ou senha incorretos." : error);
          return;
        }
        toast.success("Bem-vindo(a)!");
        navigate("/");
      } else {
        const parsed = signUpSchema.safeParse(form);
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }
        const { error } = await signUp(parsed.data.email, parsed.data.password, parsed.data.fullName, parsed.data.phone);
        if (error) {
          toast.error(error.includes("already") ? "Este e-mail já está cadastrado." : error);
          return;
        }
        toast.success("Conta criada! Você já está logado(a).");
        navigate("/");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary/40">
      <Header />
      <main className="flex-1 container-custom py-12 flex items-center justify-center">
        <div className="w-full max-w-md bg-card rounded-2xl shadow-card-hover p-8">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand mb-6">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>

          <h1 className="text-3xl font-display font-bold mb-2">
            {mode === "login" ? "Entrar" : "Criar conta"}
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            {mode === "login"
              ? "Acesse sua conta para uma experiência personalizada."
              : "Cadastre-se grátis. Seus dados ficam preenchidos ao falar conosco."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Nome completo</label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                    placeholder="Seu nome"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Telefone (WhatsApp)</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                    placeholder="(14) 99999-9999"
                    required
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-semibold mb-1.5">E-mail</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="seu@email.com"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full h-11 rounded-md border border-input bg-background px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  placeholder="Mínimo 6 caracteres"
                  required
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={show ? "Ocultar senha" : "Mostrar senha"}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="w-full bg-gradient-brand text-brand-foreground hover:opacity-90 shadow-brand font-semibold"
            >
              {submitting ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>Não tem conta?{" "}
                <button onClick={() => setMode("signup")} className="text-brand font-semibold hover:underline">
                  Cadastre-se
                </button>
              </>
            ) : (
              <>Já tem conta?{" "}
                <button onClick={() => setMode("login")} className="text-brand font-semibold hover:underline">
                  Entrar
                </button>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
