import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    features: ["3 products", "Storefront", "Stripe payouts", "5% fee"],
    cta: "Start free",
    popular: false,
  },
  {
    name: "Creator",
    price: "$1",
    period: "/mo",
    features: ["Unlimited products", "Service listings", "Analytics", "AI tools", "5% fee"],
    cta: "Open store",
    popular: true,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    features: ["Everything in Creator", "Custom domain", "API access", "3% fee", "White-label"],
    cta: "Go Pro",
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[140px]" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-foreground">
            Start free.
            <br />
            <span className="text-muted-foreground">Scale when ready.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`relative rounded-2xl border p-7 flex flex-col ${
                plan.popular
                  ? "border-primary/40 bg-card ring-1 ring-primary/20 scale-[1.02]"
                  : "border-border bg-card"
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 magnetic-gradient text-white text-xs border-0 px-4 py-1">
                  Popular
                </Badge>
              )}

              <h3 className="font-heading text-lg font-semibold text-foreground">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-heading text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>

              <ul className="mt-8 space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm text-foreground/80">
                    <Check size={16} className="text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to="/auth" className="mt-8">
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className={`w-full h-12 rounded-xl gap-2 text-sm ${
                    plan.popular ? "magnetic-gradient border-0 text-white shadow-lg shadow-primary/20" : ""
                  }`}
                >
                  {plan.cta} {plan.popular && <ArrowRight size={16} />}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
