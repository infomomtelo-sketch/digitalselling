import { useRef, useEffect, useState } from "react";
import { Send, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useGeneralChat } from "@/hooks/useGeneralChat";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/Navbar";

const Chat = () => {
  const [input, setInput] = useState("");
  const { messages, isLoading, sendMessage, clearMessages } = useGeneralChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput("");
    sendMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full pt-20 pb-4 px-4">
        {/* Header */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft size={18} />
              </Button>
            </Link>
            <div>
              <h1 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                DropVault AI Assistant
              </h1>
              <p className="text-xs text-muted-foreground">Ask anything about our platform</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={clearMessages} className="text-muted-foreground">
            <Trash2 size={14} className="mr-1" /> Clear
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-16 space-y-4">
              <div className="text-5xl">💬</div>
              <div>
                <p className="font-heading font-semibold text-foreground text-lg mb-1">How can I help you?</p>
                <p className="text-sm max-w-md mx-auto">
                  Ask about selling digital products, our website builder service, pricing plans, or anything else about DropVault.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {["How does selling work?", "Tell me about the website builder", "What are the pricing plans?"].map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-2 rounded-xl border border-border transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card text-card-foreground border border-border rounded-bl-md"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm prose-invert max-w-none [&>p]:m-0 [&>ul]:my-1 [&>ol]:my-1">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border pt-4">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-end gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 bg-card text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-border focus:border-primary transition-colors resize-none placeholder:text-muted-foreground min-h-[44px] max-h-[120px]"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" className="h-11 w-11 rounded-xl shrink-0" disabled={!input.trim() || isLoading}>
              <Send size={18} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
