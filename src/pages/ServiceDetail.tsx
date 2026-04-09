import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Check, Star, MessageSquare, ShieldCheck, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface ServiceData {
  id: string;
  title: string;
  description: string | null;
  long_description: string | null;
  category: string;
  cover_image_url: string | null;
  basic_price: number;
  basic_description: string | null;
  basic_delivery_days: number | null;
  standard_price: number | null;
  standard_description: string | null;
  standard_delivery_days: number | null;
  premium_price: number | null;
  premium_description: string | null;
  premium_delivery_days: number | null;
  sales_count: number;
  creator_id: string;
}

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [service, setService] = useState<ServiceData | null>(null);
  const [creator, setCreator] = useState<{ display_name: string; avatar_url: string | null; bio: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState("basic");

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    if (!id) return;
    const { data } = await supabase.from("services").select("*").eq("id", id).single();
    if (data) {
      setService(data);
      const { data: profile } = await supabase.from("profiles").select("display_name, avatar_url, bio").eq("user_id", data.creator_id).single();
      if (profile) setCreator(profile);
    }
    setLoading(false);
  };

  const handleContact = async () => {
    if (!user || !service) {
      toast({ title: "Please sign in to contact the seller", variant: "destructive" });
      return;
    }
    const p1 = [user.id, service.creator_id].sort()[0];
    const p2 = [user.id, service.creator_id].sort()[1];

    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("participant_one", p1)
      .eq("participant_two", p2)
      .single();

    if (existing) {
      window.location.href = `/messages?conv=${existing.id}`;
    } else {
      const { data: newConv } = await supabase
        .from("conversations")
        .insert({ participant_one: p1, participant_two: p2 })
        .select("id")
        .single();
      if (newConv) window.location.href = `/messages?conv=${newConv.id}`;
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!service) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Service not found</p></div>;

  const tiers = [
    { key: "basic", label: "Basic", price: service.basic_price, desc: service.basic_description, days: service.basic_delivery_days || 7 },
    ...(service.standard_price ? [{ key: "standard", label: "Standard", price: service.standard_price, desc: service.standard_description, days: service.standard_delivery_days || 14 }] : []),
    ...(service.premium_price ? [{ key: "premium", label: "Premium", price: service.premium_price, desc: service.premium_description, days: service.premium_delivery_days || 21 }] : []),
  ];

  const activeTier = tiers.find((t) => t.key === selectedTier) || tiers[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Link to="/gigs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft size={16} /> Back to services
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Left */}
            <div className="lg:col-span-3">
              {service.cover_image_url && (
                <div className="rounded-2xl overflow-hidden border border-border mb-6 aspect-video">
                  <img src={service.cover_image_url} alt={service.title} className="w-full h-full object-cover" />
                </div>
              )}
              <Badge variant="outline" className="text-xs mb-3">{service.category}</Badge>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">{service.title}</h1>

              {/* Creator */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary overflow-hidden">
                  {creator?.avatar_url ? <img src={creator.avatar_url} alt="" className="w-full h-full object-cover" /> : creator?.display_name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{creator?.display_name}</p>
                  <p className="text-xs text-muted-foreground">{service.sales_count} orders completed</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{service.description}</p>
              {service.long_description && (
                <div className="prose prose-sm prose-invert max-w-none">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-3">About this service</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{service.long_description}</p>
                </div>
              )}
            </div>

            {/* Right: Pricing */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-border bg-card p-5 sticky top-24">
                {tiers.length > 1 && (
                  <Tabs value={selectedTier} onValueChange={setSelectedTier} className="mb-4">
                    <TabsList className="w-full">
                      {tiers.map((t) => (
                        <TabsTrigger key={t.key} value={t.key} className="flex-1 text-xs">{t.label}</TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                )}

                <div className="flex items-end gap-2 mb-3">
                  <span className="font-heading text-3xl font-bold text-foreground">${activeTier.price}</span>
                </div>

                {activeTier.desc && <p className="text-sm text-muted-foreground mb-4">{activeTier.desc}</p>}

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Clock size={14} />
                  <span>{activeTier.days}-day delivery</span>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10 mb-4">
                  <ShieldCheck size={16} className="text-primary flex-shrink-0" />
                  <span className="text-xs font-medium text-primary">Money-back guarantee</span>
                </div>

                <Button size="lg" className="w-full mb-3">
                  Continue (${activeTier.price})
                </Button>

                <Button variant="outline" size="lg" className="w-full" onClick={handleContact}>
                  <MessageSquare size={16} className="mr-2" /> Contact Seller
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceDetail;
