import { motion } from "framer-motion";
import { Star, ArrowUpRight } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "UI Designer",
    avatar: "SC",
    revenue: "$42K+",
    quote: "Uploaded my first UI kit on a whim. Six months later it's my main income stream.",
  },
  {
    name: "Marcus Lee",
    role: "Video Creator",
    avatar: "ML",
    revenue: "$128K+",
    quote: "My editing course hit 1,000 sales in the first month. The checkout converts like crazy.",
  },
  {
    name: "Priya Sharma",
    role: "Notion Creator",
    avatar: "PS",
    revenue: "$89K+",
    quote: "Went from freelancing 60 hours/week to earning more from templates I built once.",
  },
  {
    name: "Jordan Patel",
    role: "Software Engineer",
    avatar: "JP",
    revenue: "$63K+",
    quote: "Selling my component library was the best decision. The marketplace brings buyers to me.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            Creators earning real revenue
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Real people, real results. Join thousands of creators building passive income.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="rounded-xl border border-border bg-card p-5 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full magnetic-gradient flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {t.avatar}
                </div>
                <div className="min-w-0">
                  <p className="font-heading text-xs font-semibold text-foreground">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground">{t.role}</p>
                </div>
                <div className="ml-auto text-right shrink-0">
                  <p className="font-heading text-sm font-bold text-primary">{t.revenue}</p>
                  <div className="flex gap-0.5 justify-end">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={8} className="text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">"{t.quote}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
