import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BadgeCheck, Users, Package, TrendingUp, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

interface CreatorWithStats {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  product_count: number;
  total_sales: number;
  follower_count: number;
}

const Creators = () => {
  const [creators, setCreators] = useState<CreatorWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      // Get all profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url, bio");

      if (!profiles || profiles.length === 0) {
        setLoading(false);
        return;
      }

      // Get product counts and sales per creator
      const { data: products } = await supabase
        .from("products")
        .select("creator_id, sales_count")
        .eq("is_published", true);

      // Get follower counts
      const { data: follows } = await supabase
        .from("follows")
        .select("following_id");

      const productMap = new Map<string, { count: number; sales: number }>();
      (products || []).forEach((p) => {
        const existing = productMap.get(p.creator_id) || { count: 0, sales: 0 };
        productMap.set(p.creator_id, {
          count: existing.count + 1,
          sales: existing.sales + p.sales_count,
        });
      });

      const followerMap = new Map<string, number>();
      (follows || []).forEach((f) => {
        followerMap.set(f.following_id, (followerMap.get(f.following_id) || 0) + 1);
      });

      const creatorsWithStats: CreatorWithStats[] = profiles
        .map((p) => ({
          ...p,
          product_count: productMap.get(p.user_id)?.count || 0,
          total_sales: productMap.get(p.user_id)?.sales || 0,
          follower_count: followerMap.get(p.user_id) || 0,
        }))
        .filter((c) => c.product_count > 0 || c.follower_count > 0)
        .sort((a, b) => b.follower_count + b.total_sales - (a.follower_count + a.total_sales));

      setCreators(creatorsWithStats);
      setLoading(false);
    };

    fetchCreators();
  }, []);

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

          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 text-xs font-medium">
              <TrendingUp size={12} className="mr-1" /> Top Creators
            </Badge>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
              Discover creators on dropvault
            </h1>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Follow your favorite creators to get notified when they launch new products.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading creators...</div>
          ) : creators.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <p className="text-muted-foreground">No creators yet. Be the first to publish a product!</p>
              <Link to="/auth" className="text-primary hover:underline text-sm mt-2 inline-block">
                Start selling →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {creators.map((creator, i) => (
                <motion.div
                  key={creator.user_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/creator/${creator.user_id}`}
                    className="block rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {creator.avatar_url ? (
                          <img src={creator.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-heading text-lg font-bold text-primary">
                            {(creator.display_name || "?").slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-heading text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {creator.display_name || "Creator"}
                          </h3>
                          <BadgeCheck size={14} className="text-primary flex-shrink-0" />
                        </div>
                        {creator.bio && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{creator.bio}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        <span className="font-medium text-foreground">{creator.follower_count}</span> followers
                      </span>
                      <span className="flex items-center gap-1">
                        <Package size={12} />
                        <span className="font-medium text-foreground">{creator.product_count}</span> products
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Creators;
