import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Download, Check, ShieldCheck, Clock, Layers, Code2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShareButtons from "@/components/ShareButtons";
import { getTemplateById, templates } from "@/data/templates";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const TemplateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const template = getTemplateById(id || "");
  const [buying, setBuying] = useState(false);
  const { toast } = useToast();

  if (!template) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Template not found</h1>
          <Link to="/" className="text-primary hover:underline text-sm">← Back to store</Link>
        </div>
      </div>
    );
  }

  const related = templates.filter((t) => t.id !== template.id).slice(0, 3);

  const handleGetTemplate = async () => {
    if (template.isFree) {
      toast({ title: "Template ready!", description: "Scroll down to request your free build." });
      document.getElementById("get-started")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setBuying(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          product_id: template.id,
          price_amount: template.price,
          product_title: template.name + " Template",
        },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast({ title: "Checkout error", description: err.message, variant: "destructive" });
    }
    setBuying(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={16} /> Back to templates
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Preview */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="rounded-2xl overflow-hidden border border-border bg-card aspect-video">
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-full object-cover"
                  width={800}
                  height={512}
                />
              </div>
            </motion.div>

            {/* Details */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Badge variant="outline" className="text-xs font-normal mb-3">
                {template.category}
              </Badge>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">
                {template.name}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 text-sm">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span className="font-medium text-foreground">{template.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Download size={14} /> {template.downloads} downloads
                </span>
              </div>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-2 mb-6">
                {template.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-[10px]">
                    <Code2 size={10} className="mr-1" />
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10 mb-6">
                <ShieldCheck size={16} className="text-primary flex-shrink-0" />
                <span className="text-xs font-medium text-primary">
                  {template.isFree ? "Free forever — no credit card needed" : "30-day money-back guarantee"}
                </span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {template.description}
              </p>

              {/* Price + CTA */}
              <div className="rounded-xl border border-border bg-card p-5 mb-6">
                <div className="flex items-end gap-2 mb-4">
                  <span className="font-heading text-3xl font-bold text-foreground">
                    {template.isFree ? "Free" : `$${template.price}`}
                  </span>
                  {!template.isFree && (
                    <span className="text-sm text-muted-foreground mb-1">one-time</span>
                  )}
                </div>
                <Button
                  size="lg"
                  className="w-full text-base font-semibold mb-3"
                  disabled={buying}
                  onClick={handleGetTemplate}
                >
                  {buying
                    ? "Loading..."
                    : template.isFree
                    ? "Get Free Template"
                    : "Buy Now"}
                </Button>
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Layers size={12} /> Full source code</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> Instant access</span>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-heading text-sm font-semibold text-foreground mb-3">What's included</h3>
                <ul className="space-y-2">
                  {template.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check size={14} className="text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <ShareButtons title={template.name} />
              </div>
            </motion.div>
          </div>

          {/* Long description */}
          <Separator className="my-12" />
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="font-heading text-xl font-bold text-foreground mb-4">About this template</h2>
            <p className="text-muted-foreground leading-relaxed">{template.longDescription}</p>
          </motion.div>

          {/* Get started CTA */}
          <div id="get-started" className="my-12 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
            <h3 className="font-heading text-xl font-bold text-foreground mb-2">
              Want us to build this for you?
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              Pick this template and we'll customize it with your branding, content, and features. Full source code ownership included.
            </p>
            <Link to="/services">
              <Button size="lg">Request a Custom Build →</Button>
            </Link>
          </div>

          {/* Related */}
          <Separator className="my-12" />
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground mb-6">More templates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((t) => (
                <Link
                  key={t.id}
                  to={`/templates/${t.id}`}
                  className="group rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      width={800}
                      height={512}
                    />
                  </div>
                  <div className="p-4">
                    <Badge variant="outline" className="text-[10px] mb-2 font-normal">{t.category}</Badge>
                    <h3 className="font-heading text-sm font-semibold text-card-foreground mb-1">{t.name}</h3>
                    <span className="font-heading text-lg font-bold text-foreground">
                      {t.isFree ? "Free" : `$${t.price}`}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TemplateDetail;
