import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-foreground">
      {/* Animated gradient orbs — Apple Music style */}
      <div className="absolute inset-0">
        <div className="orb-float absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#ff2d55] opacity-30 blur-[120px]" />
        <div className="orb-float-delayed absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-[#af52de] opacity-25 blur-[100px]" />
        <div className="orb-float-slow absolute bottom-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-[#5856d6] opacity-20 blur-[140px]" />
        <div className="orb-float absolute bottom-1/3 right-1/3 w-[350px] h-[350px] rounded-full bg-[#ff6b35] opacity-20 blur-[100px]" />
      </div>

      {/* Subtle grain texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')]" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-sm font-medium mb-10 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-[#34c759] animate-pulse" />
            12,000+ creators earning passively
          </div>
        </motion.div>

        <motion.h1
          className="font-heading text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight text-white leading-[0.95]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Sell once.
          <br />
          <span className="magnetic-gradient-text">Earn forever.</span>
        </motion.h1>

        <motion.p
          className="mt-8 text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Upload your ebooks, courses, templates & software. Set your price.
          Get paid instantly — no inventory, no shipping, no limits.
        </motion.p>

        <motion.div
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link to="/auth">
            <Button size="lg" className="text-base px-10 h-14 gap-2 rounded-full magnetic-gradient border-0 text-white font-semibold shadow-[0_0_40px_rgba(255,45,85,0.3)] hover:shadow-[0_0_60px_rgba(255,45,85,0.5)] transition-shadow">
              Start selling free <ArrowRight size={18} />
            </Button>
          </Link>
          <a href="#products">
            <Button variant="outline" size="lg" className="text-base px-10 h-14 rounded-full bg-white/5 border-white/15 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm">
              Browse products
            </Button>
          </a>
        </motion.div>

        {/* Floating metrics */}
        <motion.div
          className="mt-20 grid grid-cols-3 gap-4 max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {[
            { value: "$18M+", label: "Paid out" },
            { value: "2.4M+", label: "Products sold" },
            { value: "0%", label: "Fees to start" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-white/40 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade into content */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
