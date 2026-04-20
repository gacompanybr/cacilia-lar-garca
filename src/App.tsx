import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index.tsx";
import Properties from "./pages/Properties.tsx";
import PropertyDetails from "./pages/PropertyDetails.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import Auth from "./pages/Auth.tsx";
import MyAccount from "./pages/MyAccount.tsx";
import Panel from "./pages/Panel.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => {
  // Ensure pre-registered "corretor" account exists (idempotent, runs once on first load).
  useEffect(() => {
    const KEY = "bootstrap_admin_done_v1";
    if (localStorage.getItem(KEY)) return;
    supabase.functions.invoke("bootstrap-admin").then(({ error }) => {
      if (!error) localStorage.setItem(KEY, "1");
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/imoveis" element={<Properties />} />
              <Route path="/imovel/:id" element={<PropertyDetails />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/minha-conta" element={<MyAccount />} />
              <Route path="/painel" element={<Panel />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
