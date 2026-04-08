import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Star, Download, TrendingUp, BadgeCheck, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import ProductSearch from "@/components/ProductSearch";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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
    <section id="products" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0c16] relative overflow-hidden">
      {/* Subtle gradient orb */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[#5856d6] opacity-[0.04] blur-[150px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 text-xs font-medium bg-white/10 text-white/70 border-white/10 hover:bg-white/15">
            <TrendingUp size={12} className="mr-1" /> Trending Now
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
            Best-selling digital products
          </h2>
          <p className="mt-4 text-white/50 max-w-xl mx-auto">
            From templates to full courses — creators are earning passive income every day.
          </p>
        </div>

        <ProductSearch
          onSearch={setSearchQuery}
          onCategoryChange={setActiveCategory}
          activeCategory={activeCategory}
        />

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/50">No products found. Try a different search or category.</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            key={`${searchQuery}-${activeCategory}`}
          >
            {filteredProducts.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id}>
              <motion.div
                variants={item}
                className={`${product.span} group relative rounded-2xl border border-white/10 bg-[#12152a] p-6 hover:border-[#5856d6]/40 hover:shadow-lg hover:shadow-[#5856d6]/10 transition-all duration-300 cursor-pointer overflow-hidden h-full`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center`}>
                      <product.icon size={20} className={product.iconColor} />
                    </div>
                    {product.featured && (
                      <Badge className="magnetic-gradient text-white text-[10px] border-0">Featured</Badge>
                    )}
                  </div>

                  <Badge variant="outline" className="text-[10px] mb-3 font-normal border-white/15 text-white/60">{product.category}</Badge>
                  <h3 className="font-heading text-lg font-semibold text-white mb-2">{product.title}</h3>

                  {product.featured && (
                    <p className="text-sm text-white/50 mb-4 leading-relaxed">
                      A complete design system with 500+ components, built for modern SaaS products. Ship faster, look better.
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-xl font-bold text-white">{product.price}</span>
                      <span className="flex items-center gap-0.5 text-[10px] text-[#5856d6]">
                        <ShieldCheck size={10} /> Guaranteed
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <Star size={12} className="text-amber-500 fill-amber-500" /> {product.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <BadgeCheck size={12} className="text-[#af52de]" /> {product.sales}
                      </span>
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
