import { motion } from "framer-motion";
import { Star, Download, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { products } from "@/data/products";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const BentoProducts = () => {
  return (
    <section id="products" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 text-xs font-medium">
            <TrendingUp size={12} className="mr-1" /> Trending Now
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
            Best-selling digital products
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            From templates to full courses — creators are earning passive income every day.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {products.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id}>
            <motion.div
              variants={item}
              className={`${product.span} group relative rounded-2xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden h-full`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center`}>
                    <product.icon size={20} className={product.iconColor} />
                  </div>
                  {product.featured && (
                    <Badge className="bg-primary text-primary-foreground text-[10px]">Featured</Badge>
                  )}
                </div>

                <Badge variant="outline" className="text-[10px] mb-3 font-normal">{product.category}</Badge>
                <h3 className="font-heading text-lg font-semibold text-card-foreground mb-2">{product.title}</h3>

                {product.featured && (
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    A complete design system with 500+ components, built for modern SaaS products. Ship faster, look better.
                  </p>
                )}

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  <span className="font-heading text-xl font-bold text-foreground">{product.price}</span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star size={12} className="text-amber-500 fill-amber-500" /> {product.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download size={12} /> {product.sales}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BentoProducts;
