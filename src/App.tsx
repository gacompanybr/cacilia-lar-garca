import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index.tsx";

// Code-split non-critical routes to reduce initial JS bundle on mobile
const Properties = lazy(() => import("./pages/Properties.tsx"));
const PropertyDetails = lazy(() => import("./pages/PropertyDetails.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const Auth = lazy(() => import("./pages/Auth.tsx"));
const MyAccount = lazy(() => import("./pages/MyAccount.tsx"));
const Panel = lazy(() => import("./pages/Panel.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

const App = () => {
  // Ensure pre-registered "corretor" account exists (idempotent, runs once on first load).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const KEY = "bootstrap_admin_done_v1";
    if (localStorage.getItem(KEY)) return;
    // Defer non-critical network call until after first paint
    const run = () => {
      supabase.functions.invoke("bootstrap-admin").then(({ error }) => {
        if (!error) localStorage.setItem(KEY, "1");
      });
    };
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(run, { timeout: 3000 });
    } else {
      setTimeout(run, 1500);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <Suspense fallback={null}>
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
          </Suspense>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
