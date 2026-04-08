import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId, serviceRequestId } = await req.json();

    if (!sessionId || !serviceRequestId) {
      return new Response(JSON.stringify({ error: "Missing parameters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the Stripe session is paid
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return new Response(JSON.stringify({ error: "Payment not completed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const credits = parseInt(session.metadata?.credits || "0");
    if (credits <= 0) {
      return new Response(JSON.stringify({ error: "Invalid credits" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if this session was already processed
    const { data: existing } = await supabase
      .from("consultation_credits")
      .select("*")
      .eq("service_request_id", serviceRequestId)
      .single();

    if (existing?.stripe_session_ids?.includes(sessionId)) {
      return new Response(JSON.stringify({ success: true, credits: existing.paid_credits, message: "Already processed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (existing) {
      // Update existing record
      const { error } = await supabase
        .from("consultation_credits")
        .update({
          paid_credits: existing.paid_credits + credits,
          stripe_session_ids: [...(existing.stripe_session_ids || []), sessionId],
          updated_at: new Date().toISOString(),
        })
        .eq("service_request_id", serviceRequestId);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true, credits: existing.paid_credits + credits }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      // Create new record
      const { error } = await supabase
        .from("consultation_credits")
        .insert({
          service_request_id: serviceRequestId,
          paid_credits: credits,
          stripe_session_ids: [sessionId],
        });

      if (error) throw error;

      return new Response(JSON.stringify({ success: true, credits }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Verify credits error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
