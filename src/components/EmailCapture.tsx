import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const EmailCapture = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast({ title: "You're in! 🎉", description: "We'll send you the best creator tips & product drops." });
    setEmail("");
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <motion.div
        className="max-w-xl mx-auto text-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
          Creator tips & trending products
        </h2>
        <p className="mt-2 text-xs text-muted-foreground">
          Join 8,000+ creators. Weekly tips, no spam.
        </p>

        {submitted ? (
          <div className="mt-6 p-3 rounded-lg bg-primary/10 text-primary font-medium text-xs">
            ✓ You're on the list!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex gap-2 max-w-sm mx-auto">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="h-10 text-sm flex-1"
            />
            <Button type="submit" size="sm" className="h-10 px-4 magnetic-gradient border-0 text-white font-semibold gap-1 text-xs">
              Subscribe <ArrowRight size={14} />
            </Button>
          </form>
        )}
      </motion.div>
    </section>
  );
};

export default EmailCapture;
