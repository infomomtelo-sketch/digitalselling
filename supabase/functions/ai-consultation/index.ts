import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a professional web design consultant for DropVault's Website Builder Service. Your job is to help clients plan their website through a friendly, structured conversation.

RULES:
- Ask ONE question at a time
- Offer 2-3 specific options with your recommendation highlighted
- Be concise but warm
- After gathering enough info (usually 5-7 questions), summarize all choices and ask for final confirmation
- When the user confirms the plan, respond with the summary prefixed by "BRIEF_CONFIRMED:" followed by a structured project brief

CONVERSATION FLOW:
1. Greet by name, acknowledge their request details and chosen plan
2. Ask about website purpose/goals
3. Ask about design style preference (offer visual examples: modern/minimal, bold/colorful, classic/professional)
4. Ask about color preferences
5. Ask about must-have features (contact form, gallery, blog, e-commerce, etc.)
6. Ask about content readiness (do they have copy, images, logo?)
7. Summarize everything and ask for confirmation

When confirmed, format the brief as:
BRIEF_CONFIRMED:
**Project Brief for [Name]**
- **Plan:** [plan]
- **Purpose:** [what they said]
- **Style:** [chosen style]
- **Colors:** [chosen colors]
- **Features:** [list]
- **Content Status:** [ready/needs help]
- **Additional Notes:** [anything else discussed]`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { serviceRequestId, message } = await req.json();

    if (!serviceRequestId) {
      return new Response(JSON.stringify({ error: "Missing serviceRequestId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the service request details
    const { data: request, error: reqError } = await supabase
      .from("service_requests")
      .select("*")
      .eq("id", serviceRequestId)
      .single();

    if (reqError || !request) {
      return new Response(JSON.stringify({ error: "Service request not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get existing conversation
    const { data: existingMessages } = await supabase
      .from("consultation_messages")
      .select("role, content")
      .eq("service_request_id", serviceRequestId)
      .order("created_at", { ascending: true });

    const history = existingMessages || [];

    // If this is the first message, add context about the request
    const contextMessage = `Client Details:
- Name: ${request.name}
- Email: ${request.email}
- Selected Plan: ${request.plan}
- Project Description: ${request.details}

Start the consultation by greeting them and asking the first question.`;

    // Build messages for AI
    const aiMessages: Array<{ role: string; content: string }> = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    if (history.length === 0) {
      // First interaction - include context
      aiMessages.push({ role: "user", content: contextMessage });
    } else {
      // Include context as first user message, then history
      aiMessages.push({ role: "user", content: contextMessage });
      aiMessages.push({ role: "assistant", content: history[0].content });
      for (let i = 1; i < history.length; i++) {
        aiMessages.push({ role: history[i].role, content: history[i].content });
      }
    }

    // Add new user message if provided
    if (message) {
      aiMessages.push({ role: "user", content: message });

      // Save user message
      await supabase.from("consultation_messages").insert({
        service_request_id: serviceRequestId,
        role: "user",
        content: message,
      });
    }

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: aiMessages,
        stream: true,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      throw new Error("AI gateway error");
    }

    // Stream the response back
    const readable = new ReadableStream({
      async start(controller) {
        const reader = aiResponse.body!.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            let newlineIndex: number;
            while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
              let line = buffer.slice(0, newlineIndex);
              buffer = buffer.slice(newlineIndex + 1);
              if (line.endsWith("\r")) line = line.slice(0, -1);
              if (!line.startsWith("data: ")) continue;
              const jsonStr = line.slice(6).trim();
              if (jsonStr === "[DONE]") continue;
              try {
                const parsed = JSON.parse(jsonStr);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  fullContent += content;
                  controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`));
                }
              } catch {
                // partial JSON, skip
              }
            }
          }

          // Save assistant message
          if (fullContent) {
            await supabase.from("consultation_messages").insert({
              service_request_id: serviceRequestId,
              role: "assistant",
              content: fullContent,
            });

            // Check if brief was confirmed
            if (fullContent.includes("BRIEF_CONFIRMED:")) {
              const brief = fullContent.split("BRIEF_CONFIRMED:")[1].trim();
              await supabase
                .from("service_requests")
                .update({ brief, status: "consultation_complete" })
                .eq("id", serviceRequestId);
            }
          }

          controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
          controller.close();
        } catch (e) {
          console.error("Stream error:", e);
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Consultation error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
