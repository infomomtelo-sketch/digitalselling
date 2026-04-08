import { motion } from "framer-motion";
import { Check, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "Try dropvault risk-free. List up to 3 products.",
    features: ["3 products", "Basic storefront", "Stripe payouts", "5% platform fee", "Email support"],
    cta: "Start free",
    popular: false,
  },
  {
    name: "Creator",
    price: "$1",
    period: "/month",
    description: "Your full digital store. Products + services.",
    features: [
      "Unlimited products",
      "Branded storefront",
      "Service listings",
      "Analytics dashboard",
      "AI descriptions",
      "5% platform fee",
      "Priority support",
    ],
    cta: "Open your store",
    popular: true,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For power sellers scaling their business.",
    features: [
      "Everything in Creator",
      "Custom domain",
      "Premium templates",
      "Affiliate system",
      "API access",
      "3% platform fee",
      "Dedicated support",
      "White-label checkout",
    ],
    cta: "Go Pro",
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            Simple pricing
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Start free. Launch your store for $1/mo. Scale with Pro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`relative rounded-xl border p-6 flex flex-col ${
                plan.popular
                  ? "border-primary/50 bg-card ring-1 ring-primary/20"
                  : "border-border bg-card"
              }`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
            >
              {plan.popular && (
                <Badge className="absolute -top-2.5 left-4 magnetic-gradient text-white text-[10px] border-0 px-2">
                  Most Popular
                </Badge>
              )}

              <h3 className="font-heading text-base font-semibold text-card-foreground">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-heading text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-xs text-muted-foreground">{plan.period}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{plan.description}</p>

              <ul className="mt-6 space-y-2.5 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-xs text-card-foreground">
                    <Check size={14} className="text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to="/auth" className="mt-6">
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className={`w-full gap-2 text-xs ${
                    plan.popular
                      ? "magnetic-gradient border-0 text-white"
                      : ""
                  }`}
                  size="sm"
                >
                  {plan.cta} {plan.popular && <ArrowRight size={14} />}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Upsell hint */}
        <div className="mt-8 p-4 rounded-xl border border-border bg-card/50 text-center">
          <p className="text-xs text-muted-foreground">
            <Star size={12} className="inline text-amber-500 mr-1" />
            Need premium templates, hosting, or marketing tools? Browse our <Link to="/dashboard/cabinet" className="text-primary hover:underline font-medium">Seller Cabinet</Link> for add-ons.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
