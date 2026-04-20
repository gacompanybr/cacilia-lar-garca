import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Home, LogOut, Plus, Star, Trash2, Users } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { fetchProperties, formatPrice, propertyTypeLabel, Property } from "@/lib/properties";
import { toast } from "sonner";
import { PropertyFormDialog } from "@/components/admin/PropertyFormDialog";
import { UsersManager } from "@/components/admin/UsersManager";

const Panel = () => {
  const { user, isCorretor, loading } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editing, setEditing] = useState<Property | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => { document.title = "Painel — Cacilia M Aredes"; }, []);

  useEffect(() => {
    if (!loading && (!user || !isCorretor)) {
      toast.error("Acesso restrito a corretores.");
      navigate("/");
    }
  }, [user, isCorretor, loading, navigate]);

  useEffect(() => {
    if (isCorretor) fetchProperties().then(setProperties).catch(console.error);
  }, [isCorretor, refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  const handleDelete = async (p: Property) => {
    if (!confirm(`Excluir o imóvel "${p.title}"? Esta ação não pode ser desfeita.`)) return;
    const { error } = await supabase.from("properties").delete().eq("id", p.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Imóvel excluído.");
      refresh();
    }
  };

  const toggleFeatured = async (p: Property) => {
    const { error } = await supabase
      .from("properties")
      .update({ featured: !p.featured })
      .eq("id", p.id);
    if (error) toast.error(error.message);
    else {
      toast.success(!p.featured ? "Marcado como destaque." : "Removido dos destaques.");
      refresh();
    }
  };

  const openNew = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (p: Property) => { setEditing(p); setDialogOpen(true); };

  if (loading || !isCorretor) return null;

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Header />
      <main className="flex-1 container-custom py-10">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold">Painel do Corretor</h1>
            <p className="text-muted-foreground">Gerencie imóveis, fotos e usuários.</p>
          </div>
          <Button onClick={openNew} size="lg" className="bg-gradient-brand text-brand-foreground shadow-brand">
            <Plus className="h-4 w-4 mr-2" /> Novo imóvel
          </Button>
        </div>

        <Tabs defaultValue="properties">
          <TabsList className="mb-6">
            <TabsTrigger value="properties"><Home className="h-4 w-4 mr-1.5" /> Imóveis</TabsTrigger>
            <TabsTrigger value="users"><Users className="h-4 w-4 mr-1.5" /> Usuários</TabsTrigger>
          </TabsList>

          <TabsContent value="properties">
            <div className="grid gap-3">
              {properties.length === 0 && (
                <div className="text-center py-16 bg-card rounded-xl">
                  <p className="text-muted-foreground mb-4">Nenhum imóvel cadastrado ainda.</p>
                  <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" /> Cadastrar primeiro imóvel</Button>
                </div>
              )}
              {properties.map((p) => {
                const cover = p.property_images?.[0]?.url ?? "/placeholder.svg";
                return (
                  <div key={p.id} className="bg-card rounded-xl shadow-card p-4 flex gap-4 items-center flex-wrap sm:flex-nowrap">
                    <img src={cover} alt={p.title} className="h-20 w-28 object-cover rounded-lg shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-bold uppercase bg-brand text-brand-foreground px-2 py-0.5 rounded">
                          {propertyTypeLabel[p.type]}
                        </span>
                        <span className="text-xs font-bold uppercase bg-primary text-primary-foreground px-2 py-0.5 rounded">
                          {p.status}
                        </span>
                        {p.featured && <Star className="h-4 w-4 fill-brand text-brand" />}
                      </div>
                      <h3 className="font-semibold truncate">{p.title}</h3>
                      <div className="text-sm text-muted-foreground">
                        {formatPrice(p.price, p.status)} · {p.city}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link to={`/imovel/${p.id}`} target="_blank" className="text-xs text-muted-foreground hover:text-brand px-2 py-1">Ver</Link>
                      <Button variant="outline" size="sm" onClick={() => toggleFeatured(p)} title="Destaque">
                        <Star className={`h-4 w-4 ${p.featured ? "fill-brand text-brand" : ""}`} />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openEdit(p)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(p)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="users">
            <UsersManager />
          </TabsContent>
        </Tabs>
      </main>

      <PropertyFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        property={editing}
        onSaved={refresh}
      />

      <Footer />
    </div>
  );
};

export default Panel;
