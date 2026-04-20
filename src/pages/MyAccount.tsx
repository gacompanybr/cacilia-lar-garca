import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MyAccount = () => {
  const { user, profile, loading, refreshProfile, isCorretor } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { document.title = "Minha conta — Cacilia M Aredes"; }, []);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    setName(profile?.full_name ?? "");
    setPhone(profile?.phone ?? "");
    setEmail(user?.email ?? "");
  }, [profile, user]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name, phone })
      .eq("id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Dados atualizados!");
      refreshProfile();
    }
  };

  const updateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ email });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Verifique seu novo e-mail para confirmar a alteração.");
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Senha deve ter ao menos 6 caracteres.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Senha alterada!");
      setNewPassword("");
    }
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container-custom py-12 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Minha conta</h1>
        <p className="text-muted-foreground mb-8">
          {isCorretor && (
            <span className="inline-block bg-brand text-brand-foreground text-xs font-bold px-2 py-0.5 rounded mr-2 uppercase">Corretor</span>
          )}
          Gerencie suas informações pessoais e segurança.
        </p>

        <section className="bg-card rounded-2xl shadow-card p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">Dados pessoais</h2>
          <form onSubmit={saveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Nome completo</label>
              <input value={name} onChange={(e) => setName(e.target.value)}
                className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Telefone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>
            <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground">Salvar</Button>
          </form>
        </section>

        <section className="bg-card rounded-2xl shadow-card p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">Alterar e-mail</h2>
          <form onSubmit={updateEmail} className="space-y-4">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
            <Button type="submit" disabled={saving} variant="outline">Atualizar e-mail</Button>
          </form>
        </section>

        <section className="bg-card rounded-2xl shadow-card p-6">
          <h2 className="font-bold text-lg mb-4">Alterar senha</h2>
          <form onSubmit={updatePassword} className="space-y-4">
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nova senha (mín. 6 caracteres)"
              className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
            <Button type="submit" disabled={saving} variant="outline">Alterar senha</Button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MyAccount;
