import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CREDIT_PACKS = {
  "pack_50": {
    priceId: "price_1TKUa6DC1mrZ8mSwKlyB7bww",
    credits: 50,
    label: "50 messages – $5",
  },
  "pack_200": {
    priceId: "price_1TKUeeDC1mrZ8mSwvtIPYMUE",
    credits: 200,
    label: "200 messages – $15",
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { packId, serviceRequestId } = await req.json();

    if (!packId || !serviceRequestId) {
      return new Response(JSON.stringify({ error: "Missing packId or serviceRequestId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const pack = CREDIT_PACKS[packId as keyof typeof CREDIT_PACKS];
    if (!pack) {
      return new Response(JSON.stringify({ error: "Invalid pack" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const origin = req.headers.get("origin") || "https://whimsy-studio.lovable.app";

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: pack.priceId, quantity: 1 }],
      mode: "payment",
      success_url: `${origin}/consultation/${serviceRequestId}?credits_added=${pack.credits}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/consultation/${serviceRequestId}`,
      metadata: {
        serviceRequestId,
        credits: String(pack.credits),
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Purchase credits error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
