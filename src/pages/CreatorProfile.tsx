import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Users, Heart, ArrowLeft } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useFollow } from "@/hooks/useFollow";
import { useProductLike } from "@/hooks/useProductLike";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface CreatorData {
  user_id: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  social_links: Record<string, string> | null;
}

interface ProductData {
  id: string;
  title: string;
  description: string | null;
  price: number;
  cover_image_url: string | null;
  category: string;
  sales_count: number;
}

const ProductCard = ({ product }: { product: ProductData }) => {
  const { isLiked, likeCount, toggleLike } = useProductLike(product.id);
  const { user } = useAuth();

  return (
    <motion.div
      className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Link to={`/product/${product.id}`}>
        <div className="aspect-video bg-muted overflow-hidden">
          {product.cover_image_url ? (
            <img src={product.cover_image_url} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No preview</div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-[10px] font-normal">{product.category}</Badge>
          <button
            onClick={(e) => { e.preventDefault(); if (user) toggleLike(); }}
            className={`flex items-center gap-1 text-xs transition-colors ${isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}
          >
            <Heart size={14} className={isLiked ? "fill-current" : ""} />
            <span>{likeCount}</span>
          </button>
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-heading text-sm font-semibold text-card-foreground mb-1 group-hover:text-primary transition-colors">{product.title}</h3>
        </Link>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-heading text-lg font-bold text-foreground">${product.price}</span>
          <span className="text-[10px] text-muted-foreground">{product.sales_count} sales</span>
        </div>
      </div>
    </motion.div>
  );
};

const CreatorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [creator, setCreator] = useState<CreatorData | null>(null);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const { isFollowing, followerCount, toggleFollow, loading: followLoading } = useFollow(id);

  useEffect(() => {
    if (!id) return;

    const fetchCreator = async () => {
      setLoading(true);

      const { data: profile } = await supabase
        .from("profiles")
        .select("user_id, display_name, bio, avatar_url, social_links")
        .eq("user_id", id)
        .single();

      if (profile) {
        setCreator(profile as CreatorData);
      }

      const { data: prods } = await supabase
        .from("products")
        .select("id, title, description, price, cover_image_url, category, sales_count")
        .eq("creator_id", id)
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      setProducts(prods || []);
      setLoading(false);
    };

    fetchCreator();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center flex-col gap-4">
          <h1 className="font-heading text-2xl font-bold text-foreground">Creator not found</h1>
          <Link to="/" className="text-primary hover:underline text-sm">← Back to store</Link>
        </div>
      </div>
    );
  }

  const initials = (creator.display_name || "?").slice(0, 2).toUpperCase();
  const totalSales = products.reduce((sum, p) => sum + p.sales_count, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={16} /> Back to store
          </Link>

          {/* Creator header */}
          <motion.div
            className="rounded-2xl border border-border bg-card p-6 sm:p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                {creator.avatar_url ? (
                  <img src={creator.avatar_url} alt={creator.display_name || ""} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-heading text-2xl font-bold text-primary">{initials}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="font-heading text-xl sm:text-2xl font-bold text-foreground truncate">
                    {creator.display_name || "Creator"}
                  </h1>
                  <BadgeCheck size={20} className="text-primary flex-shrink-0" />
                </div>

                {creator.bio && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{creator.bio}</p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-5 text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Users size={14} />
                    <span className="font-semibold text-foreground">{followerCount}</span> followers
                  </span>
                  <span className="text-muted-foreground">
                    <span className="font-semibold text-foreground">{products.length}</span> products
                  </span>
                  <span className="text-muted-foreground">
                    <span className="font-semibold text-foreground">{totalSales}</span> sales
                  </span>
                </div>

                <div className="mt-3">
                  <ShareButtons title={creator.display_name || "Creator"} />
                </div>
              </div>

              {/* Follow button */}
              {user && user.id !== id && (
                <Button
                  onClick={toggleFollow}
                  disabled={followLoading}
                  variant={isFollowing ? "outline" : "default"}
                  className="flex-shrink-0"
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              )}
              {!user && (
                <Link to="/auth">
                  <Button variant="outline" className="flex-shrink-0">
                    Sign in to follow
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>

          {/* Products grid */}
          <h2 className="font-heading text-lg font-bold text-foreground mb-4">
            Products by {creator.display_name || "this creator"}
          </h2>

          {products.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <p className="text-muted-foreground">No products published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreatorProfile;
