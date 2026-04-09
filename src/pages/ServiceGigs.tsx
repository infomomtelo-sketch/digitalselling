import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Clock, Star, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface Service {
  id: string;
  title: string;
  description: string | null;
  category: string;
  cover_image_url: string | null;
  basic_price: number;
  basic_delivery_days: number | null;
  sales_count: number;
  creator_id: string;
  creator_name?: string;
  creator_avatar?: string;
}

const categories = ["All", "Design", "Development", "Marketing", "Writing", "Video", "Music", "Consulting", "Other"];

const ServiceGigs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "All";
  const sort = searchParams.get("sort") || "newest";

  useEffect(() => {
    fetchServices();
  }, [query, category, sort]);

  const fetchServices = async () => {
    setLoading(true);
    let q = supabase
      .from("services")
      .select("id, title, description, category, cover_image_url, basic_price, basic_delivery_days, sales_count, creator_id")
      .eq("is_published", true);

    if (query) q = q.ilike("title", `%${query}%`);
    if (category !== "All") q = q.eq("category", category.toLowerCase());
    if (sort === "newest") q = q.order("created_at", { ascending: false });
    else if (sort === "popular") q = q.order("sales_count", { ascending: false });
    else if (sort === "price_low") q = q.order("basic_price", { ascending: true });
    else if (sort === "price_high") q = q.order("basic_price", { ascending: false });

    const { data } = await q.limit(50);

    if (data) {
      const creatorIds = [...new Set(data.map((s) => s.creator_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .in("user_id", creatorIds);

      const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);
      setServices(data.map((s) => ({
        ...s,
        creator_name: profileMap.get(s.creator_id)?.display_name || "Freelancer",
        creator_avatar: profileMap.get(s.creator_id)?.avatar_url || undefined,
      })));
    }
    setLoading(false);
  };

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "All") params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-1">Services</h1>
            <p className="text-sm text-muted-foreground mb-4">Hire talented freelancers for your next project</p>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-10" placeholder="Search services..." value={query} onChange={(e) => updateParam("q", e.target.value)} />
              </div>
              <Select value={sort} onValueChange={(v) => updateParam("sort", v)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="price_low">Price: Low → High</SelectItem>
                  <SelectItem value="price_high">Price: High → Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            {categories.map((cat) => (
              <Button key={cat} variant={category === cat ? "default" : "outline"} size="sm" className="flex-shrink-0 text-xs" onClick={() => updateParam("category", cat)}>
                {cat}
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <div key={i} className="rounded-xl border border-border bg-card animate-pulse h-72" />)}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase size={48} className="mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-lg text-muted-foreground">No services found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <Link key={service.id} to={`/service/${service.id}`} className="group rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all overflow-hidden">
                  <div className="aspect-video bg-muted overflow-hidden">
                    {service.cover_image_url ? (
                      <img src={service.cover_image_url} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Briefcase size={32} className="text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary overflow-hidden flex-shrink-0">
                        {service.creator_avatar ? <img src={service.creator_avatar} alt="" className="w-full h-full object-cover" /> : service.creator_name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="text-xs text-muted-foreground truncate">{service.creator_name}</span>
                    </div>
                    <h3 className="font-heading text-sm font-semibold text-card-foreground line-clamp-2 mb-2">{service.title}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock size={12} />
                        <span>{service.basic_delivery_days || 7}d delivery</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-muted-foreground">Starting at</p>
                        <p className="font-heading text-base font-bold text-foreground">${service.basic_price}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceGigs;
