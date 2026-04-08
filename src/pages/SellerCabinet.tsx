import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, ExternalLink, LayoutTemplate, Megaphone,
  Wrench, GraduationCap, Sparkles, Search
} from "lucide-react";
import Navbar from "@/components/Navbar";

interface Resource {
  id: string;
  title: string;
  description: string | null;
  category: string;
  affiliate_url: string;
  partner_name: string;
  partner_logo_url: string | null;
  is_free: boolean;
  badge: string | null;
  sort_order: number;
}

const categoryConfig = {
  templates: { label: "Templates", icon: LayoutTemplate, color: "text-purple-400" },
  marketing: { label: "Marketing", icon: Megaphone, color: "text-pink-400" },
  tools: { label: "Business Tools", icon: Wrench, color: "text-blue-400" },
  courses: { label: "Courses & Guides", icon: GraduationCap, color: "text-green-400" },
};

const SellerCabinet = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchResources = async () => {
      const { data } = await supabase
        .from("seller_resources")
        .select("*")
        .order("sort_order", { ascending: true });
      setResources((data as Resource[]) || []);
      setLoading(false);
    };
    fetchResources();
  }, []);

  const filtered = resources.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.partner_name.toLowerCase().includes(search.toLowerCase()) ||
      (r.description || "").toLowerCase().includes(search.toLowerCase())
  );

  const byCategory = (cat: string) => filtered.filter((r) => r.category === cat);

  const ResourceCard = ({ resource }: { resource: Resource }) => (
    <a
      href={resource.affiliate_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 h-full group-hover:shadow-lg group-hover:shadow-primary/5">
        <CardContent className="p-5 flex flex-col h-full">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">{resource.partner_name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {resource.is_free && (
                <Badge variant="secondary" className="text-[10px] bg-green-500/10 text-green-400 border-green-500/20">
                  Free
                </Badge>
              )}
              {resource.badge && !resource.badge.includes("Free") && (
                <Badge variant="secondary" className="text-[10px]">
                  {resource.badge}
                </Badge>
              )}
            </div>
          </div>

          <h3 className="font-heading font-semibold text-foreground text-sm mb-2 group-hover:text-primary transition-colors">
            {resource.title}
          </h3>

          <p className="text-xs text-muted-foreground flex-1 line-clamp-2 mb-4">
            {resource.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">
              {categoryConfig[resource.category as keyof typeof categoryConfig]?.label}
            </span>
            <ExternalLink size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </CardContent>
      </Card>
    </a>
  );

  const TabContent = ({ category }: { category: string }) => {
    const items = category === "all" ? filtered : byCategory(category);
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-card border-border animate-pulse">
              <CardContent className="p-5 h-40" />
            </Card>
          ))}
        </div>
      );
    }
    if (items.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <p>No resources found{search ? " matching your search" : ""}.</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((r) => (
          <ResourceCard key={r.id} resource={r} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
              <Sparkles size={22} className="text-primary" />
              Seller Cabinet
            </h1>
            <p className="text-sm text-muted-foreground">
              Free tools, templates, and resources to grow your business
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mt-6 mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources..."
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all">
          <TabsList className="bg-secondary/50 mb-6 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            {Object.entries(categoryConfig).map(([key, cfg]) => (
              <TabsTrigger key={key} value={key} className="text-xs flex items-center gap-1.5">
                <cfg.icon size={13} />
                {cfg.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <TabContent category="all" />
          </TabsContent>
          {Object.keys(categoryConfig).map((key) => (
            <TabsContent key={key} value={key}>
              <TabContent category={key} />
            </TabsContent>
          ))}
        </Tabs>

        {/* Affiliate note */}
        <p className="text-[10px] text-muted-foreground/50 text-center mt-8">
          Some links may be affiliate links. We may earn a commission at no extra cost to you.
        </p>
      </div>
    </div>
  );
};

export default SellerCabinet;
