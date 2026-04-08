import { useState, useEffect, useRef } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Send, Bot, User, Loader2, CheckCircle2, Zap, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Credits {
  free_used: number;
  free_total: number;
  paid_remaining: number;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-consultation`;

const CREDIT_PACKS = [
  { id: "pack_50", credits: 50, price: "$5", label: "50 messages" },
  { id: "pack_200", credits: 200, price: "$15", label: "200 messages", popular: true },
];

const Consultation = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [briefConfirmed, setBriefConfirmed] = useState(false);
  const [credits, setCredits] = useState<Credits>({ free_used: 0, free_total: 10, paid_remaining: 0 });
  const [showCreditStore, setShowCreditStore] = useState(false);
  const [purchasingPack, setPurchasingPack] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle credit purchase return
  useEffect(() => {
    const creditsAdded = searchParams.get("credits_added");
    const sessionId = searchParams.get("session_id");

    if (creditsAdded && sessionId && id) {
      // Verify and apply credits
      const verifyCredits = async () => {
        try {
          const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-credits`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ sessionId, serviceRequestId: id }),
          });

          if (resp.ok) {
            const data = await resp.json();
            setCredits((prev) => ({ ...prev, paid_remaining: data.credits }));
            toast({ title: `${creditsAdded} credits added!`, description: "You can continue your consultation." });
          }
        } catch (e) {
          console.error("Verify credits error:", e);
        }

        // Clean URL
        setSearchParams({});
      };

      verifyCredits();
    }
  }, [searchParams, id]);

  // Load existing messages or start conversation
  useEffect(() => {
    if (!id) return;

    const loadConversation = async () => {
      // Load credits
      const { data: creditData } = await supabase
        .from("consultation_credits")
        .select("free_messages_used, paid_credits")
        .eq("service_request_id", id)
        .single();

      if (creditData) {
        setCredits({
          free_used: creditData.free_messages_used,
          free_total: 10,
          paid_remaining: creditData.paid_credits,
        });
      }

      // Load messages
      const { data: existing } = await supabase
        .from("consultation_messages")
        .select("role, content, created_at")
        .eq("service_request_id", id)
        .order("created_at", { ascending: true });

      if (existing && existing.length > 0) {
        setMessages(existing.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })));
        const lastAssistant = [...existing].reverse().find((m) => m.role === "assistant");
        if (lastAssistant?.content.includes("BRIEF_CONFIRMED:")) {
          setBriefConfirmed(true);
        }
        setIsInitializing(false);
      } else {
        setIsInitializing(true);
        await streamMessage(null);
        setIsInitializing(false);
      }
    };

    loadConversation();
  }, [id]);

  const streamMessage = async (userMessage: string | null) => {
    setIsLoading(true);
    let assistantContent = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ serviceRequestId: id, message: userMessage }),
      });

      if (resp.status === 402) {
        const data = await resp.json();
        if (data.error === "no_credits") {
          setShowCreditStore(true);
          toast({
            title: "Out of messages",
            description: "Purchase credits to continue your consultation.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      if (!resp.ok || !resp.body) {
        throw new Error("Failed to connect");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

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

            // Handle credits info event
            if (parsed.type === "credits") {
              setCredits({
                free_used: parsed.free_used,
                free_total: parsed.free_total,
                paid_remaining: parsed.paid_remaining,
              });
              continue;
            }

            if (parsed.content) {
              assistantContent += parsed.content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: assistantContent };
                return updated;
              });
            }
          } catch { /* partial */ }
        }
      }

      if (assistantContent.includes("BRIEF_CONFIRMED:")) {
        setBriefConfirmed(true);
      }
    } catch (error) {
      console.error("Stream error:", error);
      setMessages((prev) => [
        ...prev.filter((m) => m.content !== ""),
        { role: "assistant", content: "Sorry, I encountered an issue. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || briefConfirmed) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setShowCreditStore(false);
    await streamMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePurchase = async (packId: string) => {
    setPurchasingPack(packId);
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/purchase-credits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ packId, serviceRequestId: id }),
      });

      const data = await resp.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast({ title: "Error", description: "Could not start checkout.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setPurchasingPack(null);
    }
  };

  // Parse message content to separate text from quick-reply options
  const parseMessage = (content: string) => {
    const cleaned = content.replace("BRIEF_CONFIRMED:", "").trim();
    const lines = cleaned.split("\n");
    const textLines: string[] = [];
    const options: string[] = [];

    for (const line of lines) {
      if (line.trim().startsWith(">> ")) {
        options.push(line.trim().slice(3).trim());
      } else {
        textLines.push(line);
      }
    }

    return {
      text: textLines.join("\n").trim(),
      options,
    };
  };

  const handleQuickReply = (option: string) => {
    if (isLoading || briefConfirmed) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: option }]);
    setShowCreditStore(false);
    streamMessage(option);
  };

  const freeRemaining = Math.max(0, credits.free_total - credits.free_used);
  const totalRemaining = freeRemaining + credits.paid_remaining;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/services">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h1 className="text-sm font-heading font-bold">Website Consultation</h1>
                <p className="text-xs text-muted-foreground">
                  {briefConfirmed ? "Plan confirmed ✓" : "Planning your project"}
                </p>
              </div>
            </div>
          </div>

          {/* Credits indicator */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="flex items-center gap-1 text-xs">
                <Zap className="h-3 w-3 text-primary" />
                <span className="font-medium">
                  {freeRemaining > 0
                    ? `${freeRemaining} free`
                    : credits.paid_remaining > 0
                    ? `${credits.paid_remaining} credits`
                    : "No credits"}
                </span>
              </div>
              {freeRemaining > 0 && credits.paid_remaining > 0 && (
                <p className="text-[10px] text-muted-foreground">+{credits.paid_remaining} paid</p>
              )}
            </div>
            {!briefConfirmed && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setShowCreditStore(!showCreditStore)}
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                Buy
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Credit store */}
      {showCreditStore && (
        <div className="border-b border-border bg-card px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-sm font-heading font-bold mb-3">Get More Messages</h3>
            <div className="grid grid-cols-2 gap-3">
              {CREDIT_PACKS.map((pack) => (
                <button
                  key={pack.id}
                  onClick={() => handlePurchase(pack.id)}
                  disabled={!!purchasingPack}
                  className={`relative p-4 rounded-xl border text-left transition-all ${
                    pack.popular
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  {pack.popular && (
                    <span className="absolute -top-2 right-3 text-[10px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                      Best Value
                    </span>
                  )}
                  <p className="font-bold text-lg">{pack.price}</p>
                  <p className="text-sm text-muted-foreground">{pack.label}</p>
                  {purchasingPack === pack.id && (
                    <Loader2 className="h-4 w-4 animate-spin absolute top-3 right-3" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          {isInitializing && messages.length === 0 && (
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Starting your consultation...</span>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && (
                <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm prose-invert max-w-none [&>p]:my-1 [&>ul]:my-1 [&>ol]:my-1">
                    <ReactMarkdown>{cleanContent(msg.content)}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
              {msg.role === "user" && (
                <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-1">
                  <User className="h-3.5 w-3.5 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.content === "" && (
            <div className="flex gap-3">
              <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Bot className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="bg-card border border-border rounded-2xl px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Brief confirmed banner */}
      {briefConfirmed && (
        <div className="border-t border-border bg-primary/5 px-4 py-4">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium">Project brief confirmed!</p>
              <p className="text-xs text-muted-foreground">
                We'll review your plan and get back to you within 24 hours.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Out of credits banner */}
      {!briefConfirmed && totalRemaining <= 0 && !isInitializing && (
        <div className="border-t border-border bg-destructive/5 px-4 py-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Out of messages</p>
              <p className="text-xs text-muted-foreground">Purchase credits to continue planning.</p>
            </div>
            <Button size="sm" onClick={() => setShowCreditStore(true)}>
              <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
              Buy Credits
            </Button>
          </div>
        </div>
      )}

      {/* Input */}
      {!briefConfirmed && totalRemaining > 0 && (
        <div className="border-t border-border bg-card/50 backdrop-blur-xl p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your response..."
                rows={1}
                className="resize-none min-h-[44px] max-h-[120px]"
                disabled={isLoading}
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="shrink-0 h-[44px] w-[44px]"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
              {freeRemaining > 0
                ? `${freeRemaining} of ${credits.free_total} free messages remaining`
                : `${credits.paid_remaining} paid credits remaining`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consultation;
