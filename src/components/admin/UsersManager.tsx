import { useEffect, useState } from "react";
import { Shield, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface UserRow {
  id: string;
  full_name: string | null;
  phone: string | null;
  roles: string[];
}

export const UsersManager = () => {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, phone").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    const byUser = new Map<string, string[]>();
    (roles ?? []).forEach((r) => {
      const arr = byUser.get(r.user_id) ?? [];
      arr.push(r.role);
      byUser.set(r.user_id, arr);
    });
    setUsers(
      (profiles ?? []).map((p) => ({
        id: p.id,
        full_name: p.full_name,
        phone: p.phone,
        roles: byUser.get(p.id) ?? [],
      }))
    );
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const promote = async (userId: string) => {
    // remove comprador, add corretor
    await supabase.from("user_roles").delete().eq("user_id", userId);
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "corretor" });
    if (error) toast.error(error.message);
    else { toast.success("Promovido a corretor."); load(); }
  };

  const demote = async (userId: string) => {
    if (userId === me?.id) {
      toast.error("Você não pode rebaixar a si mesmo.");
      return;
    }
    await supabase.from("user_roles").delete().eq("user_id", userId);
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "comprador" });
    if (error) toast.error(error.message);
    else { toast.success("Rebaixado a comprador."); load(); }
  };

  if (loading) return <div className="text-center py-12 text-muted-foreground">Carregando usuários...</div>;

  return (
    <div className="grid gap-3">
      {users.length === 0 && (
        <div className="text-center py-12 bg-card rounded-xl text-muted-foreground">Nenhum usuário cadastrado.</div>
      )}
      {users.map((u) => {
        const isCorretor = u.roles.includes("corretor");
        return (
          <div key={u.id} className="bg-card rounded-xl shadow-card p-4 flex items-center gap-4 flex-wrap sm:flex-nowrap">
            <div className="h-10 w-10 rounded-full bg-gradient-brand text-brand-foreground font-bold flex items-center justify-center shrink-0">
              {(u.full_name?.[0] ?? "U").toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{u.full_name || "Sem nome"}</div>
              <div className="text-xs text-muted-foreground">{u.phone || "—"}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                isCorretor ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {isCorretor ? "Corretor" : "Comprador"}
              </span>
              {isCorretor ? (
                <Button variant="outline" size="sm" onClick={() => demote(u.id)}>
                  <ShieldOff className="h-4 w-4 mr-1" /> Rebaixar
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => promote(u.id)}>
                  <Shield className="h-4 w-4 mr-1" /> Promover
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
