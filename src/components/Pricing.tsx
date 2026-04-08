import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect to get started and test the waters.",
    features: ["Up to 5 products", "Basic analytics", "Standard checkout", "Email support"],
    cta: "Start free",
    variant: "outline" as const,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For serious creators earning passive income.",
    features: [
      "Unlimited products",
      "Advanced analytics",
      "Custom storefront",
      "Priority support",
      "AI descriptions",
      "Custom domain",
    ],
    cta: "Go Pro",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Business",
    price: "$49",
    period: "/month",
    description: "For teams and high-volume sellers.",
    features: [
      "Everything in Pro",
      "Team accounts",
      "API access",
      "Affiliate system",
      "White-label checkout",
      "Dedicated support",
    ],
    cta: "Contact us",
    variant: "outline" as const,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Start free. Scale when you're ready. No hidden fees, ever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`relative rounded-2xl border p-8 ${
                plan.popular
                  ? "border-primary bg-card shadow-xl shadow-primary/10 scale-[1.02]"
                  : "border-border bg-card"
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}

              <h3 className="font-heading text-lg font-semibold text-card-foreground">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-heading text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-card-foreground">
                    <Check size={16} className="text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button variant={plan.variant} className="w-full mt-8 gap-2" size="lg">
                {plan.cta} {plan.popular && <ArrowRight size={16} />}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
