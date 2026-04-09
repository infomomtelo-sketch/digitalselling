import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface WishlistItem {
  id: string;
  product_id: string | null;
  service_id: string | null;
  product?: { id: string; title: string; price: number; category: string; cover_image_url: string | null };
  service?: { id: string; title: string; basic_price: number; category: string; cover_image_url: string | null };
}

const Wishlist = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchWishlist();
  }, [user]);

  const fetchWishlist = async () => {
    const { data } = await supabase
      .from("wishlists")
      .select("id, product_id, service_id, products:product_id(id, title, price, category, cover_image_url), services:service_id(id, title, basic_price, category, cover_image_url)")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });

    if (data) {
      setItems(data.map((d: any) => ({
        id: d.id,
        product_id: d.product_id,
        service_id: d.service_id,
        product: d.products || undefined,
        service: d.services || undefined,
      })));
    }
    setLoading(false);
  };

  const removeItem = async (id: string) => {
    await supabase.from("wishlists").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast({ title: "Removed from wishlist" });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please sign in to view your wishlist</p>
          <Link to="/auth"><Button>Sign In</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Link to="/"><Button variant="ghost" size="icon"><ArrowLeft size={18} /></Button></Link>
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">Wishlist</h1>
              <p className="text-sm text-muted-foreground">{items.length} items saved</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="rounded-xl border border-border bg-card animate-pulse h-20" />)}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <Heart size={48} className="mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-lg text-muted-foreground">Your wishlist is empty</p>
              <p className="text-sm text-muted-foreground mt-1">Browse the marketplace to find products you love</p>
              <Link to="/marketplace" className="mt-4 inline-block"><Button>Browse Marketplace</Button></Link>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => {
                const isProduct = !!item.product;
                const data = item.product || item.service;
                if (!data) return null;
                return (
                  <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                    <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                      {(data as any).cover_image_url ? (
                        <img src={(data as any).cover_image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Package size={20} className="text-muted-foreground/40" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px]">{isProduct ? "Product" : "Service"}</Badge>
                        <Badge variant="outline" className="text-[10px]">{data.category}</Badge>
                      </div>
                      <Link to={isProduct ? `/product/${data.id}` : `/service/${data.id}`} className="font-heading text-sm font-semibold text-foreground hover:text-primary truncate block">
                        {data.title}
                      </Link>
                      <p className="text-sm font-bold text-foreground mt-0.5">
                        ${isProduct ? (data as any).price : (data as any).basic_price}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive flex-shrink-0" onClick={() => removeItem(item.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
