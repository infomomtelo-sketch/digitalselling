import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Platform fee percentage (e.g., 10%)
const PLATFORM_FEE_PERCENT = 10;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const { product_id, price_amount, product_title, creator_id } = await req.json();
    if (!product_id || !price_amount || !product_title) {
      throw new Error("Missing product_id, price_amount, or product_title");
    }

    // Try to get authenticated user (optional for guest checkout)
    let userEmail: string | undefined;
    let customerId: string | undefined;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      userEmail = data.user?.email ?? undefined;
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check for existing Stripe customer
    if (userEmail) {
      const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      }
    }

    // Look up creator's connected Stripe account
    let connectedAccountId: string | undefined;
    if (creator_id) {
      const { data: creatorProfile } = await supabaseClient
        .from("profiles")
        .select("stripe_account_id, stripe_onboarding_complete")
        .eq("user_id", creator_id)
        .single();

      if (creatorProfile?.stripe_account_id && creatorProfile?.stripe_onboarding_complete) {
        connectedAccountId = creatorProfile.stripe_account_id;
      }
    }

    const unitAmount = Math.round(price_amount * 100);
    const origin = req.headers.get("origin") || "https://digitalselling.lovable.app";
    const sessionParams: any = {
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product_title,
              metadata: { product_id },
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/product/${product_id}?success=true`,
      cancel_url: `${origin}/product/${product_id}`,
      metadata: { product_id, creator_id: creator_id || "" },
    };

    // If creator has a connected account, use payment_intent_data for automatic transfer
    if (connectedAccountId) {
      const applicationFee = Math.round(unitAmount * (PLATFORM_FEE_PERCENT / 100));
      sessionParams.payment_intent_data = {
        application_fee_amount: applicationFee,
        transfer_data: {
          destination: connectedAccountId,
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
