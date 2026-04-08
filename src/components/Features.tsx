import { motion } from "framer-motion";
import { Upload, CreditCard, BarChart3, Globe, Shield, Sparkles, Store, MessageSquare, Zap } from "lucide-react";

const features = [
  { icon: Store, title: "Your own storefront", description: "A branded page for products + services. One link, everything you offer.", accent: "from-primary/20 to-primary/5" },
  { icon: Upload, title: "Sell any digital file", description: "PDFs, videos, code, templates, courses — upload and sell in seconds.", accent: "from-violet-500/20 to-violet-500/5" },
  { icon: MessageSquare, title: "Offer freelance services", description: "List gigs with tiered pricing. Clients book, you deliver. Fiverr-style.", accent: "from-emerald-500/20 to-emerald-500/5" },
  { icon: CreditCard, title: "Instant Stripe payouts", description: "Get paid directly via Stripe Connect. No delays, no middleman.", accent: "from-blue-500/20 to-blue-500/5" },
  { icon: BarChart3, title: "Revenue dashboard", description: "Track sales, orders, and revenue in real-time. Know what converts.", accent: "from-amber-500/20 to-amber-500/5" },
  { icon: Sparkles, title: "AI-powered tools", description: "Auto-generate descriptions, SEO tags, and marketing copy with AI.", accent: "from-pink-500/20 to-pink-500/5" },
  { icon: Globe, title: "Custom domain", description: "Connect your own domain for a fully branded experience.", accent: "from-cyan-500/20 to-cyan-500/5" },
  { icon: Shield, title: "Secure delivery", description: "Files protected with unique download links. No piracy headaches.", accent: "from-red-500/20 to-red-500/5" },
  { icon: Zap, title: "5% platform fee", description: "No monthly fees to start. We earn when you earn — aligned incentives.", accent: "from-orange-500/20 to-orange-500/5" },
];

const Features = () => {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            Built for serious sellers
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-lg">
            Everything you need to run a digital business — products, services, payments, and analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-5 hover:border-primary/20 transition-all duration-200"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${feature.accent} flex items-center justify-center mb-3`}>
                <feature.icon size={18} className="text-foreground/70" />
              </div>
              <h3 className="font-heading text-sm font-semibold text-card-foreground mb-1">{feature.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
