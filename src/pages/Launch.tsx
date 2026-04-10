import { motion } from "framer-motion";
import { ArrowRight, Star, Zap, Users, Gift, Clock, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import launchRocket from "@/assets/launch-rocket.png";

// Set your launch date here
const LAUNCH_DATE = new Date("2026-05-01T12:00:00Z");

function useCountdown(target: Date) {
  const calc = () => {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const Launch = () => {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const countdown = useCountdown(LAUNCH_DATE);

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("launch_emails").insert({ email });
      if (error) {
        if (error.code === "23505") {
          toast({ title: "You're already on the list! 🎉", description: "We'll notify you on launch day." });
          setJoined(true);
        } else {
          throw error;
        }
      } else {
        setJoined(true);
        toast({ title: "You're on the list! 🚀", description: "We'll notify you on launch day." });
      }
    } catch {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
      setEmail("");
    }
  };

  const supporters = [
    { name: "Alex", avatar: "A" },
    { name: "Sarah", avatar: "S" },
    { name: "Mike", avatar: "M" },
    { name: "Priya", avatar: "P" },
    { name: "Jordan", avatar: "J" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Orbs */}
      <div className="absolute top-20 left-[5%] w-80 h-80 bg-primary/20 rounded-full blur-[140px] orb-float" />
      <div className="absolute bottom-40 right-[5%] w-96 h-96 bg-violet-500/15 rounded-full blur-[160px] orb-float-delayed" />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-[120px] orb-float-slow" />

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <Link to="/" className="font-heading text-xl font-bold text-foreground">
          DropVault
        </Link>
        <Link to="/auth">
          <Button variant="outline" size="sm" className="rounded-xl border-border/50">
            Sign in
          </Button>
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-4xl mx-auto text-center px-4 pt-8 sm:pt-16 pb-20">
        {/* Product Hunt badge */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff6154]/10 border border-[#ff6154]/20 text-[#ff6154] text-xs font-semibold">
            <span className="text-sm">🐱</span>
            Launching on Product Hunt
          </div>
        </motion.div>

        {/* Rocket visual */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, scale: 0.7, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src={launchRocket}
            alt="Launch rocket"
            className="w-36 h-36 sm:w-48 sm:h-48 orb-float object-contain drop-shadow-2xl"
          />
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[0.95]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          The creator store
          <br />
          <span className="magnetic-gradient-text">you've been waiting for.</span>
        </motion.h1>

        <motion.p
          className="mt-6 text-base sm:text-lg text-muted-foreground max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Sell templates, UI kits, services — everything digital. Zero setup. Only 5% fee.
        </motion.p>

        {/* Countdown */}
        <motion.div
          className="mt-12 flex items-center justify-center gap-3 sm:gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {[
            { val: countdown.days, label: "Days" },
            { val: countdown.hours, label: "Hours" },
            { val: countdown.minutes, label: "Min" },
            { val: countdown.seconds, label: "Sec" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-card border border-border/50 flex items-center justify-center">
                <span className="font-heading text-2xl sm:text-3xl font-bold magnetic-gradient-text">
                  {String(item.val).padStart(2, "0")}
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-muted-foreground mt-2 uppercase tracking-wider">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Email capture */}
        <motion.div
          className="mt-12 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          {joined ? (
            <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20 text-primary font-semibold text-sm">
              ✓ You're on the launch list! We'll email you on day one.
            </div>
          ) : (
            <form onSubmit={handleNotify} className="flex gap-3">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="h-13 text-sm flex-1 rounded-xl bg-card border-border/50"
              />
              <Button
                type="submit"
                className="h-13 px-6 rounded-xl magnetic-gradient border-0 text-white font-semibold gap-1 shrink-0"
              >
                Notify me <ArrowRight size={16} />
              </Button>
            </form>
          )}
        </motion.div>

        {/* Social proof — supporter avatars */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="flex -space-x-3">
            {supporters.map((s) => (
              <div
                key={s.name}
                className="w-9 h-9 rounded-full magnetic-gradient flex items-center justify-center text-white text-xs font-bold border-2 border-background"
              >
                {s.avatar}
              </div>
            ))}
            <div className="w-9 h-9 rounded-full bg-card border-2 border-background flex items-center justify-center text-muted-foreground text-[10px] font-semibold">
              +847
            </div>
          </div>
          <p className="text-xs text-muted-foreground">852 creators already waiting</p>
        </motion.div>
      </section>

      {/* What you get section */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 pb-24">
        <motion.h2
          className="text-center font-heading text-2xl sm:text-3xl font-bold text-foreground mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Why creators are switching
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: <Gift className="text-emerald-400" size={24} />,
              title: "Free templates",
              desc: "Start with 10+ premium templates. Portfolio, blog, SaaS — ready to customize.",
              color: "bg-emerald-400/10 border-emerald-400/20",
            },
            {
              icon: <Zap className="text-amber-400" size={24} />,
              title: "5% fee. That's it.",
              desc: "No monthly plans. No hidden costs. Keep 95% of what you earn.",
              color: "bg-amber-400/10 border-amber-400/20",
            },
            {
              icon: <Users className="text-sky-400" size={24} />,
              title: "Built-in audience",
              desc: "Marketplace traffic from day one. Your store gets discovered.",
              color: "bg-sky-400/10 border-sky-400/20",
            },
            {
              icon: <Star className="text-violet-400" size={24} />,
              title: "Services + products",
              desc: "Sell digital downloads AND freelance services. One dashboard.",
              color: "bg-violet-400/10 border-violet-400/20",
            },
            {
              icon: <Clock className="text-rose-400" size={24} />,
              title: "Launch in 5 minutes",
              desc: "Pick a template, upload your product, set a price. Done.",
              color: "bg-rose-400/10 border-rose-400/20",
            },
            {
              icon: <ExternalLink className="text-primary" size={24} />,
              title: "Stripe Connect",
              desc: "Get paid directly to your bank. Instant payouts, global support.",
              color: "bg-primary/10 border-primary/20",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              className={`p-6 rounded-2xl border ${item.color} backdrop-blur-sm`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="mb-3">{item.icon}</div>
              <h3 className="font-heading text-base font-semibold text-foreground mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 max-w-3xl mx-auto text-center px-4 pb-24">
        <motion.div
          className="p-8 sm:p-12 rounded-3xl bg-card border border-border/50 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 magnetic-gradient opacity-5" />
          <div className="relative z-10">
            <p className="text-4xl mb-4">🎯</p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              Early birds get early sales.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
              Be first in line. Launch day supporters get a featured creator badge + priority placement.
            </p>
            <div className="mt-8">
              <Link to="/auth">
                <Button size="lg" className="h-14 px-10 rounded-2xl magnetic-gradient border-0 text-white font-semibold text-base gap-2 shadow-lg shadow-primary/25">
                  Claim your spot <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-8">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} DropVault · Made for creators
        </p>
      </footer>
    </div>
  );
};

export default Launch;
