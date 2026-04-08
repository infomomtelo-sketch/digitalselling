import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-4xl mx-auto rounded-2xl border border-primary/20 bg-card p-10 sm:p-16 text-center relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Subtle glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-primary/10 rounded-full blur-[100px]" />

        <div className="relative z-10">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground leading-tight">
            Open your store today.
          </h2>
          <p className="mt-4 text-sm text-muted-foreground max-w-md mx-auto">
            Join 12,000+ creators selling digital products and services. Start free — upgrade to a full store for just $1/month.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/auth">
              <Button size="lg" className="h-12 px-8 rounded-lg magnetic-gradient border-0 text-white font-semibold gap-2 text-sm">
                Create your store <ArrowRight size={16} />
              </Button>
            </Link>
            <a href="#products">
              <Button variant="outline" size="lg" className="h-12 px-8 rounded-lg text-sm">
                Browse marketplace
              </Button>
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
