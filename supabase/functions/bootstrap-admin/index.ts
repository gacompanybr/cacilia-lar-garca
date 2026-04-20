// Edge function: bootstrap-admin
// Creates a pre-registered "corretor" account if it does not exist.
// Idempotent: safe to call multiple times.
// Public endpoint (no JWT required) so the app can self-bootstrap on first load.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "admin@caciliaaredes.com.br";
const ADMIN_PASSWORD = "admin123";
const ADMIN_NAME = "Cacilia M Aredes";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Check if admin already exists by listing users
    const { data: users, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
    if (listErr) throw listErr;

    let adminUser = users.users.find((u) => u.email === ADMIN_EMAIL);

    if (!adminUser) {
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: ADMIN_NAME, phone: "14997944908" },
      });
      if (createErr) throw createErr;
      adminUser = created.user!;
    }

    // Ensure 'corretor' role
    const { data: existingRole } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", adminUser.id)
      .eq("role", "corretor")
      .maybeSingle();

    if (!existingRole) {
      // Remove default 'comprador' role and add 'corretor'
      await supabaseAdmin.from("user_roles").delete().eq("user_id", adminUser.id);
      await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: adminUser.id, role: "corretor" });
    }

    return new Response(
      JSON.stringify({ ok: true, email: ADMIN_EMAIL }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (e) {
    console.error("bootstrap-admin error:", e);
    return new Response(
      JSON.stringify({ ok: false, error: String((e as Error).message ?? e) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
