import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ArrowRight, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ProductSearch from "@/components/ProductSearch";

interface DBProduct {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  cover_image_url: string | null;
  sales_count: number;
  creator_id: string;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const BentoProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("id, title, description, price, category, cover_image_url, sales_count, creator_id")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(12);
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || p.category.toLowerCase() === activeCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, products]);

  return (
    <section id="products" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              Marketplace
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse digital products from verified creators
            </p>
          </div>
          <Link to="/marketplace" className="hidden sm:flex items-center gap-1 text-sm text-primary font-medium hover:underline">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <ProductSearch
          onSearch={setSearchQuery}
          onCategoryChange={setActiveCategory}
          activeCategory={activeCategory}
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card animate-pulse h-64" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-xl">
            <Package size={32} className="mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground text-sm">No products found. Try a different search or category.</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            key={`${searchQuery}-${activeCategory}`}
          >
            {filteredProducts.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id}>
                <motion.div
                  variants={item}
                  className="group relative rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-200 cursor-pointer overflow-hidden h-full flex flex-col"
                >
                  <div className="h-36 bg-muted relative overflow-hidden flex items-center justify-center">
                    {product.cover_image_url ? (
                      <img
                        src={product.cover_image_url}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-muted-foreground/30">
                        {product.title.charAt(0)}
                      </span>
                    )}
                    {product.price === 0 && (
                      <Badge className="absolute top-3 right-3 bg-emerald-500/90 text-white text-[10px] border-0 px-2">
                        Free
                      </Badge>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{product.category}</span>
                    </div>
                    <h3 className="font-heading text-sm font-semibold text-card-foreground mb-1 line-clamp-1">{product.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed flex-1">{product.description}</p>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="font-heading text-base font-bold text-foreground">
                        {product.price === 0 ? "Free" : `$${product.price}`}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{product.sales_count} sales</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BentoProducts;
