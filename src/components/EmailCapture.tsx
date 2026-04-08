import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
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
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-2xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl magnetic-gradient mb-6">
          <Mail size={24} className="text-white" />
        </div>

        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
          Get creator tips & hot drops
        </h2>
        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
          Join 8,000+ creators getting weekly tips on building passive income with digital products. No spam, unsubscribe anytime.
        </p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-4 rounded-xl bg-primary/10 text-primary font-medium text-sm"
          >
            ✓ You're on the list! Check your inbox.
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="h-12 rounded-full px-5 flex-1"
            />
            <Button type="submit" className="h-12 rounded-full px-6 magnetic-gradient border-0 text-white font-semibold gap-2 shadow-[0_0_30px_rgba(255,45,85,0.2)]">
              Subscribe <ArrowRight size={16} />
            </Button>
          </form>
        )}

        <p className="mt-4 text-xs text-muted-foreground">
          Trusted by creators at Google, Meta, Spotify & more
        </p>
      </motion.div>
    </section>
  );
};

export default EmailCapture;
