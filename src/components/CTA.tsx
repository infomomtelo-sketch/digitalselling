import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-4xl mx-auto text-center rounded-3xl bg-foreground p-12 sm:p-16 relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.1)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-background leading-tight">
            Start earning while you sleep.
            <br />
            <span className="text-primary">It takes 5 minutes.</span>
          </h2>
          <p className="mt-6 text-background/70 max-w-lg mx-auto">
            Join 12,000+ creators who turned their skills into products — and their products into passive income.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-base px-8 h-12 gap-2">
              Create your store <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
