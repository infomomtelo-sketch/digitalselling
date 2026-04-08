import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Download, ShieldCheck, Clock, Check, BadgeCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProductById, products } from "@/data/products";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || "");
  const [selectedPreview, setSelectedPreview] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Product not found</h1>
          <Link to="/" className="text-primary hover:underline text-sm">← Back to store</Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={16} /> Back to products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Left: Previews */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="rounded-2xl overflow-hidden border border-border bg-card mb-4 aspect-video">
                <img
                  src={product.previews[selectedPreview]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-3">
                {product.previews.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPreview(i)}
                    className={`rounded-lg overflow-hidden border-2 transition-all w-20 h-14 flex-shrink-0 ${
                      i === selectedPreview
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-muted-foreground/40"
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Right: Details & Purchase */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Badge variant="outline" className="text-xs font-normal mb-3">
                {product.category}
              </Badge>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 text-sm">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span className="font-medium text-foreground">{product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Download size={14} /> {product.sales}
                </span>
              </div>

              {/* Creator */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                  {product.creator.avatar}
                </div>
                <span className="text-sm text-muted-foreground">
                  by <span className="text-foreground font-medium">{product.creator.name}</span>
                </span>
                <BadgeCheck size={16} className="text-primary" />
              </div>

              {/* Money-back guarantee */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10 mb-6">
                <ShieldCheck size={16} className="text-primary flex-shrink-0" />
                <span className="text-xs font-medium text-primary">30-day money-back guarantee</span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Price + CTA */}
              <div className="rounded-xl border border-border bg-card p-5 mb-6">
                <div className="flex items-end gap-2 mb-4">
                  <span className="font-heading text-3xl font-bold text-foreground">{product.price}</span>
                  <span className="text-sm text-muted-foreground mb-1">one-time</span>
                </div>
                <Button size="lg" className="w-full text-base font-semibold mb-3">
                  Buy Now
                </Button>
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><ShieldCheck size={12} /> Secure checkout</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> Instant delivery</span>
                </div>
              </div>

              {/* What's included */}
              <div>
                <h3 className="font-heading text-sm font-semibold text-foreground mb-3">What's included</h3>
                <ul className="space-y-2">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check size={14} className="text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Long description */}
          <Separator className="my-12" />
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="font-heading text-xl font-bold text-foreground mb-4">About this product</h2>
            <p className="text-muted-foreground leading-relaxed">{product.longDescription}</p>
          </motion.div>

          {/* Related products */}
          <Separator className="my-12" />
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground mb-6">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="group rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${p.gradient} flex items-center justify-center mb-3`}>
                    <p.icon size={18} className={p.iconColor} />
                  </div>
                  <Badge variant="outline" className="text-[10px] mb-2 font-normal">{p.category}</Badge>
                  <h3 className="font-heading text-sm font-semibold text-card-foreground mb-1">{p.title}</h3>
                  <span className="font-heading text-lg font-bold text-foreground">{p.price}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
