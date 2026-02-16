import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

/**
 * ============================================
 * ADMIN SETUP FUNCTION
 * ============================================
 * This edge function creates the initial admin account.
 * 
 * DEFAULT CREDENTIALS:
 * Email: admin@amantraders.com
 * Password: Admin@123
 * 
 * IMPORTANT: Change these credentials after first login!
 * ============================================
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Hardcoded admin credentials - CHANGE THESE AFTER FIRST LOGIN
const ADMIN_EMAIL = "admin@amantraders.com";
const ADMIN_PASSWORD = "Admin@123";

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Check if admin already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingAdmin = existingUsers?.users?.find(u => u.email === ADMIN_EMAIL);

    if (existingAdmin) {
      // Always reset the password to default
      const { error: resetError } = await supabase.auth.admin.updateUserById(
        existingAdmin.id,
        { password: ADMIN_PASSWORD }
      );

      if (resetError) throw resetError;

      // Ensure admin role exists
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', existingAdmin.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (!roleData) {
        await supabase.from('user_roles').insert([{
          user_id: existingAdmin.id,
          role: 'admin'
        }]);
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Admin password has been reset to default (Admin@123). Please change it after login.",
          email: ADMIN_EMAIL
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create new admin user
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true
    });

    if (createError) throw createError;

    // Assign admin role
    const { error: roleError } = await supabase.from('user_roles').insert([{
      user_id: newUser.user.id,
      role: 'admin'
    }]);

    if (roleError) throw roleError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Admin account created successfully!",
        email: ADMIN_EMAIL,
        note: "Please change your password after first login from Settings tab."
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in setup-admin:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
