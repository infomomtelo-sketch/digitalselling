import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "UI Designer",
    avatar: "SC",
    revenue: "$42,000+",
    quote: "I uploaded my first UI kit on a whim. Six months later it's my main income stream. The passive revenue lets me focus on creating instead of chasing clients.",
    product: "Ultimate UI Kit",
    rating: 5,
    gradient: "from-violet-500 to-fuchsia-500",
  },
  {
    name: "Marcus Lee",
    role: "Video Creator",
    avatar: "ML",
    revenue: "$128,000+",
    quote: "My editing course hit 1,000 sales in the first month. dropvault's checkout flow converts like crazy — I just focus on making great content.",
    product: "Video Editing Masterclass",
    rating: 5,
    gradient: "from-orange-500 to-amber-500",
  },
  {
    name: "Priya Sharma",
    role: "Notion Creator",
    avatar: "PS",
    revenue: "$89,000+",
    quote: "I went from freelancing 60 hours a week to earning more from templates I built once. Last month I made $12k while on vacation.",
    product: "Notion Finance Tracker",
    rating: 5,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    name: "Jordan Patel",
    role: "Software Engineer",
    avatar: "JP",
    revenue: "$63,000+",
    quote: "Selling my component library here was the best decision I made. Zero marketing — the marketplace brings buyers to me. I just ship updates.",
    product: "React Component Library",
    rating: 5,
    gradient: "from-sky-500 to-indigo-500",
  },
];

const stats = [
  { label: "Creators earning", value: "12,000+" },
  { label: "Products sold", value: "2.4M+" },
  { label: "Total paid out", value: "$18M+" },
  { label: "Avg. creator revenue", value: "$1,500/mo" },
];

const Testimonials = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0d0f1a] relative overflow-hidden">
      <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] rounded-full bg-[#af52de] opacity-[0.03] blur-[150px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Stats bar */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-16 p-6 rounded-2xl border border-white/10 bg-white/[0.03]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-white/40 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
            Creators love dropvault
          </h2>
          <p className="mt-4 text-white/50 max-w-xl mx-auto">
            Real stories from creators who turned their skills into passive income.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 transition-all"
            >
              <Quote size={28} className="text-white/5 absolute top-5 right-5" />

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-sm font-bold text-white`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-heading text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-white/40">{t.role} · {t.product}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-heading text-sm font-bold magnetic-gradient-text">{t.revenue}</p>
                  <div className="flex gap-0.5 justify-end mt-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={10} className="text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-sm text-white/50 leading-relaxed">{t.quote}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
