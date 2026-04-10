import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Star, Download, ShieldCheck, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import ProductSearch from "@/components/ProductSearch";

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

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <section id="products" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              Marketplace
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse digital products from verified creators
            </p>
          </div>
          <Link to="/creators" className="hidden sm:flex items-center gap-1 text-sm text-primary font-medium hover:underline">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <ProductSearch
          onSearch={setSearchQuery}
          onCategoryChange={setActiveCategory}
          activeCategory={activeCategory}
        />

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-xl">
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
                  {/* Product image/gradient header */}
                  <div className={`h-36 bg-gradient-to-br ${product.gradient} relative flex items-center justify-center`}>
                    <product.icon size={32} className="text-foreground/20" />
                    {product.featured && (
                      <Badge className="absolute top-3 left-3 magnetic-gradient text-white text-[10px] border-0 px-2">
                        Featured
                      </Badge>
                    )}
                    {product.priceAmount === 0 && (
                      <Badge className="absolute top-3 right-3 bg-emerald-500/90 text-white text-[10px] border-0 px-2">
                        Free
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{product.category}</span>
                    </div>
                    <h3 className="font-heading text-sm font-semibold text-card-foreground mb-1 line-clamp-1">{product.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed flex-1">{product.description}</p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="font-heading text-base font-bold text-foreground">{product.price}</span>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <Star size={10} className="text-amber-500 fill-amber-500" /> {product.rating}
                        </span>
                        <span>·</span>
                        <span>{product.sales}</span>
                      </div>
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
