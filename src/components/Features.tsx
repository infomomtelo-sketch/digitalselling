import { motion } from "framer-motion";
import { Upload, CreditCard, BarChart3, Globe, Shield, Sparkles } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Upload anything",
    description: "PDFs, videos, code, templates — any digital file becomes a product in seconds.",
    color: "text-[#ff2d55]",
    bg: "bg-[#ff2d55]/10",
  },
  {
    icon: CreditCard,
    title: "Instant payments",
    description: "Stripe-powered checkout. Your customers pay, you get paid — no delays.",
    color: "text-[#ff6b35]",
    bg: "bg-[#ff6b35]/10",
  },
  {
    icon: BarChart3,
    title: "Revenue dashboard",
    description: "Track sales, revenue, and conversions in real-time. Know what's working.",
    color: "text-[#af52de]",
    bg: "bg-[#af52de]/10",
  },
  {
    icon: Globe,
    title: "Your own storefront",
    description: "A beautiful, branded page for all your products. Share one link everywhere.",
    color: "text-[#5856d6]",
    bg: "bg-[#5856d6]/10",
  },
  {
    icon: Shield,
    title: "Secure delivery",
    description: "Files are protected with unique download links. No piracy headaches.",
    color: "text-[#007aff]",
    bg: "bg-[#007aff]/10",
  },
  {
    icon: Sparkles,
    title: "AI descriptions",
    description: "Generate compelling product descriptions and SEO metadata automatically.",
    color: "text-[#34c759]",
    bg: "bg-[#34c759]/10",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0c16] relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-[#ff2d55] opacity-[0.03] blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#5856d6] opacity-[0.04] blur-[150px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
            Everything you need to sell
          </h2>
          <p className="mt-4 text-white/50 max-w-xl mx-auto">
            From upload to payout — we handle the boring stuff so you can focus on creating.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className={`w-10 h-10 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon size={20} className={feature.color} />
              </div>
              <h3 className="font-heading text-base font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
