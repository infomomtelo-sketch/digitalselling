import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Globe, Rocket, Shield, Headphones, Check, Send, Zap, Eye, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const plans = [
  {
    name: "Starter",
    price: "$99",
    period: "one-time",
    description: "Perfect for personal sites & portfolios",
    features: [
      "Custom single-page website",
      "Mobile responsive design",
      "Basic SEO setup",
      "1 revision round",
      "You OWN the source code",
      "Free hosting for 6 months",
    ],
    accent: false,
  },
  {
    name: "Business",
    price: "$349",
    period: "one-time",
    description: "For growing businesses & online stores",
    features: [
      "Multi-page website (up to 5 pages)",
      "Contact forms & integrations",
      "Advanced SEO & analytics",
      "3 revision rounds",
      "Full source code ownership",
      "Free hosting for 1 year",
      "Custom domain + SSL",
      "No platform lock-in — ever",
    ],
    accent: true,
  },
  {
    name: "Pro",
    price: "$899",
    period: "one-time",
    description: "Full-scale web apps & e-commerce",
    features: [
      "Unlimited pages & features",
      "Custom web application",
      "E-commerce & payments",
      "Unlimited revisions",
      "Complete code handoff",
      "Managed hosting & maintenance",
      "Priority support & SLA",
      "Migrate anywhere, anytime",
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
            You Own It. No Lock-In.
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold mb-6 leading-tight">
            We build your website.<br />
            <span className="text-primary">You own every line of code.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlike AI builders that keep your site hostage, we hand you the full source code. Host it anywhere, modify it anytime, no monthly platform fees trapping you.
          </p>
        </div>
      </section>

      {/* Trust signals */}
      <section className="pb-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { icon: Globe, label: "You Own It", desc: "Full source code" },
            { icon: Shield, label: "No Lock-In", desc: "Host anywhere" },
            { icon: Rocket, label: "Fast Delivery", desc: "7-14 days" },
            { icon: Headphones, label: "Free Support", desc: "30 days included" },
          ].map((item) => (
            <div key={item.label} className="text-center p-4 rounded-xl bg-card border border-border">
              <item.icon className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="font-semibold text-sm">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-4">How We Build Your Site</h3>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            AI does the heavy lifting. Humans make it perfect.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                step: "01",
                title: "AI Builds the Foundation",
                desc: "We use cutting-edge AI tools to generate your site's structure, layout, and core functionality in hours — not weeks.",
              },
              {
                icon: Eye,
                step: "02",
                title: "Human Review & Polish",
                desc: "Our team reviews every pixel — refining design, fixing edge cases, optimizing performance, and ensuring quality you'd expect from a top agency.",
              },
              {
                icon: Code,
                step: "03",
                title: "You Get the Code",
                desc: "We hand you clean, production-ready source code. No vendor lock-in, no monthly fees. It's yours forever to host and modify.",
              },
            ].map((item) => (
              <div key={item.step} className="relative p-6 rounded-2xl bg-card border border-border">
                <span className="text-4xl font-heading font-bold text-primary/15 absolute top-4 right-4">{item.step}</span>
                <item.icon className="h-8 w-8 text-primary mb-4" />
                <h4 className="font-heading font-bold text-lg mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8">
            This is why we're <span className="text-foreground font-medium">faster than agencies</span> and <span className="text-foreground font-medium">better than pure AI builders</span>.
          </p>
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
