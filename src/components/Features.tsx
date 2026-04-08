import { motion } from "framer-motion";
import { Upload, CreditCard, BarChart3, Globe, Shield, Sparkles } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Upload anything",
    description: "PDFs, videos, code, templates — any digital file becomes a product in seconds.",
  },
  {
    icon: CreditCard,
    title: "Instant payments",
    description: "Stripe-powered checkout. Your customers pay, you get paid — no delays.",
  },
  {
    icon: BarChart3,
    title: "Revenue dashboard",
    description: "Track sales, revenue, and conversions in real-time. Know what's working.",
  },
  {
    icon: Globe,
    title: "Your own storefront",
    description: "A beautiful, branded page for all your products. Share one link everywhere.",
  },
  {
    icon: Shield,
    title: "Secure delivery",
    description: "Files are protected with unique download links. No piracy headaches.",
  },
  {
    icon: Sparkles,
    title: "AI descriptions",
    description: "Generate compelling product descriptions and SEO metadata automatically.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
            Everything you need to sell
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            From upload to payout — we handle the boring stuff so you can focus on creating.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-6 hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon size={20} className="text-primary" />
              </div>
              <h3 className="font-heading text-base font-semibold text-card-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
