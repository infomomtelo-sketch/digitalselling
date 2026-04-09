import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Send, ArrowLeft, MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Conversation {
  id: string;
  participant_one: string;
  participant_two: string;
  last_message_at: string;
  other_name?: string;
  other_avatar?: string;
  last_preview?: string;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

const Messages = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const activeConvId = searchParams.get("conv");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (!activeConvId || !user) return;
    fetchMessages(activeConvId);

    const channel = supabase
      .channel(`conv-${activeConvId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "conversation_messages",
        filter: `conversation_id=eq.${activeConvId}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeConvId, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .order("last_message_at", { ascending: false });

    if (data && user) {
      const otherIds = data.map((c) => c.participant_one === user.id ? c.participant_two : c.participant_one);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .in("user_id", otherIds);

      const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);

      setConversations(
        data.map((c) => {
          const otherId = c.participant_one === user.id ? c.participant_two : c.participant_one;
          const profile = profileMap.get(otherId);
          return { ...c, other_name: profile?.display_name || "User", other_avatar: profile?.avatar_url || undefined };
        })
      );
    }
  };

  const fetchMessages = async (convId: string) => {
    const { data } = await supabase
      .from("conversation_messages")
      .select("*")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });

    if (data) setMessages(data);

    // Mark as read
    if (user) {
      await supabase
        .from("conversation_messages")
        .update({ is_read: true })
        .eq("conversation_id", convId)
        .neq("sender_id", user.id);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !activeConvId || !user) return;
    setSending(true);
    await supabase.from("conversation_messages").insert({
      conversation_id: activeConvId,
      sender_id: user.id,
      content: newMessage.trim(),
    });
    setNewMessage("");
    setSending(false);
  };

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const filtered = conversations.filter((c) =>
    c.other_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please sign in to view messages</p>
          <Link to="/auth"><Button>Sign In</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon"><ArrowLeft size={18} /></Button>
            </Link>
            <h1 className="font-heading text-lg font-bold">Messages</h1>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <div className={`w-full md:w-80 border-r border-border flex flex-col ${activeConvId ? "hidden md:flex" : "flex"}`}>
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare size={32} className="mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">No conversations yet</p>
              </div>
            ) : (
              filtered.map((conv) => (
                <Link
                  key={conv.id}
                  to={`/messages?conv=${conv.id}`}
                  className={`flex items-center gap-3 p-3 border-b border-border hover:bg-card transition-colors ${activeConvId === conv.id ? "bg-card" : ""}`}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary flex-shrink-0 overflow-hidden">
                    {conv.other_avatar ? (
                      <img src={conv.other_avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      conv.other_name?.charAt(0)?.toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{conv.other_name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {new Date(conv.last_message_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className={`flex-1 flex flex-col ${!activeConvId ? "hidden md:flex" : "flex"}`}>
          {!activeConvId ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">Select a conversation</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="border-b border-border p-3 flex items-center gap-3">
                <Link to="/messages" className="md:hidden">
                  <Button variant="ghost" size="icon"><ArrowLeft size={18} /></Button>
                </Link>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                  {activeConv?.other_name?.charAt(0)?.toUpperCase()}
                </div>
                <p className="font-medium text-sm">{activeConv?.other_name}</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === user.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                        msg.sender_id === user.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border text-foreground"
                      }`}
                    >
                      {msg.content}
                      <p className={`text-[10px] mt-1 ${msg.sender_id === user.id ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="border-t border-border p-3">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex gap-2"
                >
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={sending || !newMessage.trim()}>
                    <Send size={18} />
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
