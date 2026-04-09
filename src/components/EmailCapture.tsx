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
    toast({ title: "You're in! 🎉", description: "Weekly creator tips coming your way." });
    setEmail("");
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-lg mx-auto text-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-4xl mb-4">💌</p>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
          Stay in the loop
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Weekly tips. No spam. 8,000+ creators.
        </p>

        {submitted ? (
          <div className="mt-8 p-4 rounded-2xl bg-primary/10 text-primary font-semibold text-sm">
            ✓ You're on the list!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex gap-3 max-w-sm mx-auto">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="h-12 text-sm flex-1 rounded-xl"
            />
            <Button type="submit" className="h-12 px-6 rounded-xl magnetic-gradient border-0 text-white font-semibold gap-1">
              Join <ArrowRight size={16} />
            </Button>
          </form>
        )}
      </motion.div>
    </section>
  );
};

export default EmailCapture;
