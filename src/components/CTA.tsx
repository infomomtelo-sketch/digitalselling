import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Big glowing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[150px] orb-float" />

      <motion.div
        className="max-w-3xl mx-auto text-center relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-heading text-4xl sm:text-6xl font-bold text-foreground leading-[0.95]">
          Your store is
          <br />
          <span className="magnetic-gradient-text">one click away.</span>
        </h2>
        <p className="mt-6 text-base text-muted-foreground max-w-md mx-auto">
          Free to start. $1/month for everything.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/auth">
            <Button size="lg" className="h-14 px-10 rounded-2xl magnetic-gradient border-0 text-white font-semibold gap-2 text-base shadow-lg shadow-primary/25">
              Create your store <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
