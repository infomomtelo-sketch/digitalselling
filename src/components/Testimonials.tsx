import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "UI Designer",
    revenue: "$42K+",
    quote: "Six months in — this is my main income now.",
    gradient: "from-primary to-violet-500",
  },
  {
    name: "Marcus Lee",
    role: "Video Creator",
    revenue: "$128K+",
    quote: "1,000 sales in the first month. Insane.",
    gradient: "from-violet-500 to-pink-500",
  },
  {
    name: "Priya Sharma",
    role: "Template Maker",
    revenue: "$89K+",
    quote: "Quit freelancing. Templates earn more.",
    gradient: "from-emerald-500 to-cyan-500",
  },
];

const Testimonials = () => {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background orb */}
      <div className="absolute bottom-0 right-[10%] w-80 h-80 bg-violet-500/10 rounded-full blur-[140px] orb-float-delayed" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-foreground">
            Real creators.
            <br />
            <span className="magnetic-gradient-text">Real money.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-8 flex flex-col items-center text-center hover:border-primary/30 transition-colors"
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                <span className="text-white font-bold text-lg">{t.name.charAt(0)}</span>
              </div>
              <p className="font-heading text-3xl font-bold magnetic-gradient-text mb-2">{t.revenue}</p>
              <p className="text-sm text-foreground font-medium mb-1">{t.name}</p>
              <p className="text-xs text-muted-foreground mb-4">{t.role}</p>
              <p className="text-sm text-muted-foreground leading-relaxed italic">"{t.quote}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
