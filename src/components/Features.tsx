import { motion } from "framer-motion";
import { Upload, CreditCard, BarChart3, Store, MessageSquare, Zap } from "lucide-react";

const features = [
  { icon: Store, title: "Your storefront", color: "from-primary to-violet-500", emoji: "🏪" },
  { icon: Upload, title: "Sell any file", color: "from-violet-500 to-pink-500", emoji: "📦" },
  { icon: MessageSquare, title: "Offer services", color: "from-emerald-500 to-cyan-500", emoji: "💼" },
  { icon: CreditCard, title: "Instant payouts", color: "from-blue-500 to-primary", emoji: "⚡" },
  { icon: BarChart3, title: "Live analytics", color: "from-amber-500 to-orange-500", emoji: "📊" },
  { icon: Zap, title: "5% fee only", color: "from-pink-500 to-rose-500", emoji: "✨" },
];

const Features = () => {
  return (
    <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/10 rounded-full blur-[120px] -translate-y-1/2" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-foreground">
            Everything you need.
            <br />
            <span className="text-muted-foreground">Nothing you don't.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="group text-center"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <span className="text-2xl sm:text-3xl">{feature.emoji}</span>
              </div>
              <h3 className="font-heading text-sm sm:text-base font-semibold text-foreground">{feature.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
