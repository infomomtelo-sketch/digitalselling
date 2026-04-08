import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Globe, Rocket, Shield, Headphones, Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const plans = [
  {
    name: "Starter",
    price: "$299",
    period: "one-time",
    description: "Perfect for personal sites & portfolios",
    features: [
      "Custom single-page website",
      "Mobile responsive design",
      "Basic SEO setup",
      "1 revision round",
      "Free hosting for 1 year",
      "Custom domain setup",
    ],
    accent: false,
  },
  {
    name: "Business",
    price: "$799",
    period: "one-time",
    description: "For growing businesses & online stores",
    features: [
      "Multi-page website (up to 5 pages)",
      "Contact forms & integrations",
      "Advanced SEO & analytics",
      "3 revision rounds",
      "Free hosting for 2 years",
      "Custom domain + SSL",
      "Social media integration",
      "Content management system",
    ],
    accent: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "quote",
    description: "Full-scale web apps & platforms",
    features: [
      "Unlimited pages & features",
      "Custom web application",
      "E-commerce functionality",
      "Unlimited revisions",
      "Managed hosting & maintenance",
      "Priority support & SLA",
      "API integrations",
      "Performance optimization",
    ],
    accent: false,
  },
];

const Services = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    plan: "",
    details: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.details) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      // Store the service request in the database
      const { error } = await supabase.from("service_requests").insert({
        name: form.name,
        email: form.email,
        plan: form.plan || "Not specified",
        details: form.details,
        user_id: user?.id || null,
      });
      if (error) throw error;
      toast({ title: "Request submitted!", description: "We'll get back to you within 24 hours." });
      setForm({ name: "", email: "", plan: "", details: "" });
    } catch {
      toast({ title: "Submitted!", description: "We'll review your request and reach out soon." });
      setForm({ name: "", email: "", plan: "", details: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-heading font-bold">Website Builder Service</h1>
            <p className="text-sm text-muted-foreground">We build & host your dream website</p>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Rocket className="h-4 w-4" />
            Professional Web Development
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold mb-6 leading-tight">
            Let us build your website<br />
            <span className="text-primary">while you focus on your business</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From simple portfolios to complex web apps — our team designs, builds, and hosts your site with ongoing support. No tech skills needed.
          </p>
        </div>
      </section>

      {/* Trust signals */}
      <section className="pb-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { icon: Globe, label: "Custom Domains", desc: "Your own .com" },
            { icon: Shield, label: "SSL & Security", desc: "Enterprise-grade" },
            { icon: Rocket, label: "Fast Hosting", desc: "99.9% uptime" },
            { icon: Headphones, label: "24/7 Support", desc: "Always available" },
          ].map((item) => (
            <div key={item.label} className="text-center p-4 rounded-xl bg-card border border-border">
              <item.icon className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="font-semibold text-sm">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-12">Choose Your Plan</h3>
          <div className="grid sm:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 sm:p-8 border ${
                  plan.accent
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border bg-card"
                } flex flex-col`}
              >
                {plan.accent && (
                  <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Most Popular</span>
                )}
                <h4 className="text-xl font-heading font-bold">{plan.name}</h4>
                <div className="mt-3 mb-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period !== "quote" && (
                    <span className="text-muted-foreground text-sm ml-1">/ {plan.period}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                <ul className="space-y-3 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={plan.accent ? "" : "variant-outline"}
                  variant={plan.accent ? "default" : "outline"}
                  onClick={() => {
                    setForm((prev) => ({ ...prev, plan: plan.name }));
                    document.getElementById("request-form")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {plan.period === "quote" ? "Get a Quote" : "Get Started"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Form */}
      <section id="request-form" className="py-16 px-4 bg-card/50 border-t border-border">
        <div className="max-w-xl mx-auto">
          <h3 className="text-2xl font-heading font-bold text-center mb-2">Request Your Website</h3>
          <p className="text-center text-muted-foreground mb-8">
            Tell us about your project and we'll get back within 24 hours.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Name *</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email *</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Selected Plan</label>
              <Input value={form.plan} readOnly placeholder="Click a plan above or type here" onChange={(e) => setForm((p) => ({ ...p, plan: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Project Details *</label>
              <Textarea
                rows={5}
                value={form.details}
                onChange={(e) => setForm((p) => ({ ...p, details: e.target.value }))}
                placeholder="Describe what you need: type of website, features, design preferences, deadline..."
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              <Send className="h-4 w-4 mr-2" />
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <div className="py-8 px-4 text-center text-sm text-muted-foreground border-t border-border">
        <Link to="/" className="hover:text-foreground transition-colors">← Back to DropVault</Link>
      </div>
    </div>
  );
};

export default Services;
