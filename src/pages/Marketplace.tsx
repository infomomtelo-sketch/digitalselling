import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Filter, Star, Heart, SlidersHorizontal, Grid3X3, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  cover_image_url: string | null;
  sales_count: number;
  creator_id: string;
  creator_name?: string;
}

const categories = ["All", "Design", "Software", "Marketing", "Education", "Templates", "Audio", "Photography", "Other"];

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");

  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "All";
  const sort = searchParams.get("sort") || "newest";
  const minPrice = searchParams.get("min") || "";
  const maxPrice = searchParams.get("max") || "";

  useEffect(() => {
    fetchProducts();
  }, [query, category, sort, minPrice, maxPrice]);

  const fetchProducts = async () => {
    setLoading(true);
    let q = supabase
      .from("products")
      .select("id, title, description, price, category, cover_image_url, sales_count, creator_id")
      .eq("is_published", true);

    if (query) q = q.ilike("title", `%${query}%`);
    if (category !== "All") q = q.eq("category", category.toLowerCase());
    if (minPrice) q = q.gte("price", Number(minPrice));
    if (maxPrice) q = q.lte("price", Number(maxPrice));

    if (sort === "newest") q = q.order("created_at", { ascending: false });
    else if (sort === "popular") q = q.order("sales_count", { ascending: false });
    else if (sort === "price_low") q = q.order("price", { ascending: true });
    else if (sort === "price_high") q = q.order("price", { ascending: false });

    const { data } = await q.limit(50);

    if (data) {
      const creatorIds = [...new Set(data.map((p) => p.creator_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", creatorIds);

      const profileMap = new Map(profiles?.map((p) => [p.user_id, p.display_name]) || []);
      setProducts(data.map((p) => ({ ...p, creator_name: profileMap.get(p.creator_id) || "Creator" })));
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
          {/* Search bar */}
          <div className="mb-8">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">Marketplace</h1>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="Search products..."
                  value={query}
                  onChange={(e) => updateParam("q", e.target.value)}
                />
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
              <div className="hidden sm:flex gap-1 border border-border rounded-lg p-0.5">
                <Button variant={view === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => setView("grid")}><Grid3X3 size={16} /></Button>
                <Button variant={view === "list" ? "secondary" : "ghost"} size="icon" onClick={() => setView("list")}><LayoutList size={16} /></Button>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? "default" : "outline"}
                size="sm"
                className="flex-shrink-0 text-xs"
                onClick={() => updateParam("category", cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Price filters */}
          <div className="flex items-center gap-3 mb-6">
            <SlidersHorizontal size={16} className="text-muted-foreground" />
            <Input
              type="number"
              placeholder="Min $"
              className="w-24"
              value={minPrice}
              onChange={(e) => updateParam("min", e.target.value)}
            />
            <span className="text-muted-foreground text-sm">to</span>
            <Input
              type="number"
              placeholder="Max $"
              className="w-24"
              value={maxPrice}
              onChange={(e) => updateParam("max", e.target.value)}
            />
          </div>

          {/* Results */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card animate-pulse h-64" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <Search size={48} className="mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-lg text-muted-foreground">No products found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className={view === "grid" ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-3"}>
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className={`group rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all overflow-hidden ${view === "list" ? "flex gap-4 p-4" : ""}`}
                >
                  <div className={`bg-muted ${view === "list" ? "w-20 h-20 rounded-lg flex-shrink-0" : "aspect-[4/3]"} overflow-hidden`}>
                    {product.cover_image_url ? (
                      <img src={product.cover_image_url} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 text-2xl font-bold">
                        {product.title.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className={view === "list" ? "flex-1 min-w-0" : "p-3"}>
                    <Badge variant="outline" className="text-[10px] mb-1.5 font-normal">{product.category}</Badge>
                    <h3 className="font-heading text-sm font-semibold text-card-foreground truncate">{product.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">by {product.creator_name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-heading text-base font-bold text-foreground">
                        {product.price === 0 ? "Free" : `$${product.price}`}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{product.sales_count} sales</span>
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

export default Marketplace;
