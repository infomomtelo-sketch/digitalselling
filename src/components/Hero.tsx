import { motion } from "framer-motion";
import { Search, ArrowRight, Store, Briefcase, Code, Palette, Video, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";

const categories = [
  { icon: Palette, label: "Design Assets" },
  { icon: Code, label: "Software" },
  { icon: FileText, label: "Templates" },
  { icon: Video, label: "Courses" },
  { icon: Briefcase, label: "Services" },
  { icon: Store, label: "All Products" },
];

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-background">
      {/* Subtle gradient backdrop */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-primary/8 rounded-full blur-[160px]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Platform badge */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card text-muted-foreground text-xs font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Trusted by 12,000+ creators & freelancers
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground text-center leading-[1.05]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          Your digital store.
          <br />
          <span className="text-primary">Products & services.</span>
        </motion.h1>

        <motion.p
          className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-center leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          Sell digital products, offer freelance services, and build your brand — all from one storefront. Like Shopify meets Fiverr, built for creators.
        </motion.p>

        {/* Search bar */}
        <motion.div
          className="mt-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <div className="relative flex items-center">
            <Search size={20} className="absolute left-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, services, templates, courses..."
              className="w-full h-14 pl-12 pr-36 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            <Link to="/auth" className="absolute right-2">
              <Button className="h-10 px-6 rounded-lg magnetic-gradient border-0 text-white font-semibold text-sm">
                Start Selling
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Category pills */}
        <motion.div
          className="mt-6 flex flex-wrap items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          {categories.map((cat) => (
            <a
              key={cat.label}
              href="#products"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card/50 text-muted-foreground text-xs font-medium hover:border-primary/40 hover:text-foreground hover:bg-card transition-all"
            >
              <cat.icon size={14} />
              {cat.label}
            </a>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px rounded-xl overflow-hidden border border-border bg-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {[
            { value: "$18M+", label: "Creator earnings" },
            { value: "2.4M+", label: "Products sold" },
            { value: "12K+", label: "Active stores" },
            { value: "5%", label: "Platform fee" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card px-6 py-5 text-center">
              <p className="font-heading text-xl sm:text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
