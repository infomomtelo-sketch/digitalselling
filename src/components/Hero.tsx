import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroShapes from "@/assets/hero-shapes.png";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-background">
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary/20 rounded-full blur-[120px] orb-float" />
      <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-violet-500/15 rounded-full blur-[140px] orb-float-delayed" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/8 rounded-full blur-[160px] orb-float-slow" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          className="flex justify-center mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            12,000+ creators already selling
          </div>
        </motion.div>

        {/* 3D Shapes visual */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src={heroShapes}
            alt="3D geometric shapes"
            className="w-40 h-40 sm:w-52 sm:h-52 orb-float object-contain"
            width={1024}
            height={1024}
          />
        </motion.div>

        {/* Headline — short, punchy */}
        <motion.h1
          className="font-heading text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight text-foreground leading-[0.95]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          Sell what
          <br />
          <span className="magnetic-gradient-text">you create.</span>
        </motion.h1>

        {/* One-liner */}
        <motion.p
          className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-md mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          Digital products. Services. One storefront.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link to="/auth">
            <Button size="lg" className="h-14 px-10 rounded-2xl magnetic-gradient border-0 text-white font-semibold text-base gap-2 shadow-lg shadow-primary/25">
              Start selling free <ArrowRight size={18} />
            </Button>
          </Link>
          <Link to="/marketplace">
            <Button variant="outline" size="lg" className="h-14 px-10 rounded-2xl text-base border-border/50 hover:bg-card">
              Browse marketplace
            </Button>
          </Link>
        </motion.div>

        {/* Minimal stats */}
        <motion.div
          className="mt-20 flex items-center justify-center gap-8 sm:gap-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {[
            { value: "$18M+", label: "Earned" },
            { value: "2.4M", label: "Sold" },
            { value: "5%", label: "Fee" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-2xl sm:text-3xl font-bold magnetic-gradient-text">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
