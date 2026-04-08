import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Send, Bot, User, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-consultation`;

const Consultation = () => {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [briefConfirmed, setBriefConfirmed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load existing messages or start conversation
  useEffect(() => {
    if (!id) return;

    const loadConversation = async () => {
      // Check if conversation exists
      const { data: existing } = await supabase
        .from("consultation_messages")
        .select("role, content, created_at")
        .eq("service_request_id", id)
        .order("created_at", { ascending: true });

      if (existing && existing.length > 0) {
        setMessages(existing.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })));
        // Check if brief already confirmed
        const lastAssistant = [...existing].reverse().find((m) => m.role === "assistant");
        if (lastAssistant?.content.includes("BRIEF_CONFIRMED:")) {
          setBriefConfirmed(true);
        }
        setIsInitializing(false);
      } else {
        // Start the conversation - AI will greet the user
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
        body: JSON.stringify({
          serviceRequestId: id,
          message: userMessage,
        }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error("Failed to connect to consultation service");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // Add empty assistant message
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
            if (parsed.content) {
              assistantContent += parsed.content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: assistantContent };
                return updated;
              });
            }
          } catch {
            // partial JSON
          }
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
    await streamMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Clean display content (remove BRIEF_CONFIRMED: prefix for display)
  const cleanContent = (content: string) => {
    return content.replace("BRIEF_CONFIRMED:", "").trim();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
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
      </div>

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

      {/* Input */}
      {!briefConfirmed && (
        <div className="border-t border-border bg-card/50 backdrop-blur-xl p-4">
          <div className="max-w-3xl mx-auto flex gap-2">
            <Textarea
              ref={textareaRef}
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
        </div>
      )}
    </div>
  );
};

export default Consultation;
