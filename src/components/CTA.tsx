import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-5xl mx-auto text-center rounded-[2rem] p-12 sm:p-20 relative overflow-hidden magnetic-gradient"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[80px] orb-float" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/10 rounded-full blur-[60px] orb-float-delayed" />

        {/* Grain */}
        <div className="absolute inset-0 opacity-[0.04] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')]" />

        <div className="relative z-10">
          <motion.h2
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Start earning
            <br />
            while you sleep.
          </motion.h2>
          <motion.p
            className="mt-6 text-white/70 text-lg max-w-lg mx-auto"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Join 12,000+ creators who turned their skills into products — and their products into passive income.
          </motion.p>
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link to="/auth">
              <Button size="lg" className="text-base px-10 h-14 rounded-full bg-white text-foreground font-semibold hover:bg-white/90 shadow-[0_10px_40px_rgba(0,0,0,0.2)] gap-2">
                Create your store <ArrowRight size={18} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
