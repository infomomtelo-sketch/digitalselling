import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const categories = ["design", "development", "marketing", "writing", "video", "music", "consulting", "other"];

const ServiceForm = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const isNew = id === "new";

  const [form, setForm] = useState({
    title: "",
    description: "",
    long_description: "",
    category: "other",
    cover_image_url: "",
    basic_price: 25,
    basic_description: "",
    basic_delivery_days: 7,
    standard_price: "",
    standard_description: "",
    standard_delivery_days: "",
    premium_price: "",
    premium_description: "",
    premium_delivery_days: "",
    is_published: false,
  });

  useEffect(() => {
    if (!isNew && id) {
      supabase.from("services").select("*").eq("id", id).single().then(({ data }) => {
        if (data) setForm({
          title: data.title,
          description: data.description || "",
          long_description: data.long_description || "",
          category: data.category,
          cover_image_url: data.cover_image_url || "",
          basic_price: data.basic_price,
          basic_description: data.basic_description || "",
          basic_delivery_days: data.basic_delivery_days || 7,
          standard_price: data.standard_price?.toString() || "",
          standard_description: data.standard_description || "",
          standard_delivery_days: data.standard_delivery_days?.toString() || "",
          premium_price: data.premium_price?.toString() || "",
          premium_description: data.premium_description || "",
          premium_delivery_days: data.premium_delivery_days?.toString() || "",
          is_published: data.is_published,
        });
      });
    }
  }, [id, isNew]);

  const handleSave = async (publish?: boolean) => {
    if (!user || !form.title) return;
    setSaving(true);

    const payload = {
      title: form.title,
      description: form.description || null,
      long_description: form.long_description || null,
      category: form.category,
      cover_image_url: form.cover_image_url || null,
      basic_price: form.basic_price,
      basic_description: form.basic_description || null,
      basic_delivery_days: form.basic_delivery_days,
      standard_price: form.standard_price ? Number(form.standard_price) : null,
      standard_description: form.standard_description || null,
      standard_delivery_days: form.standard_delivery_days ? Number(form.standard_delivery_days) : null,
      premium_price: form.premium_price ? Number(form.premium_price) : null,
      premium_description: form.premium_description || null,
      premium_delivery_days: form.premium_delivery_days ? Number(form.premium_delivery_days) : null,
      is_published: publish !== undefined ? publish : form.is_published,
      creator_id: user.id,
    };

    let error;
    if (isNew) {
      ({ error } = await supabase.from("services").insert(payload));
    } else {
      ({ error } = await supabase.from("services").update(payload).eq("id", id));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: isNew ? "Service created!" : "Service updated!" });
      navigate("/dashboard");
    }
    setSaving(false);
  };

  const u = (key: string, value: any) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link to="/dashboard"><Button variant="ghost" size="icon"><ArrowLeft size={18} /></Button></Link>
            <h1 className="font-heading text-lg font-bold">{isNew ? "New Service" : "Edit Service"}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleSave(false)} disabled={saving}>Save Draft</Button>
            <Button size="sm" onClick={() => handleSave(true)} disabled={saving}>
              <Save size={14} className="mr-1.5" /> Publish
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div>
          <label className="text-sm font-medium mb-1 block">Title *</label>
          <Input value={form.title} onChange={(e) => u("title", e.target.value)} placeholder="I will design your logo" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Category</label>
            <Select value={form.category} onValueChange={(v) => u("category", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Cover Image URL</label>
            <Input value={form.cover_image_url} onChange={(e) => u("cover_image_url", e.target.value)} placeholder="https://..." />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Short Description</label>
          <Textarea rows={3} value={form.description} onChange={(e) => u("description", e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Full Description</label>
          <Textarea rows={6} value={form.long_description} onChange={(e) => u("long_description", e.target.value)} />
        </div>

        {/* Pricing Tiers */}
        <h2 className="font-heading text-lg font-bold text-foreground pt-4">Pricing Tiers</h2>

        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <h3 className="font-heading text-sm font-semibold text-primary">Basic Package *</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Price ($)</label>
              <Input type="number" value={form.basic_price} onChange={(e) => u("basic_price", Number(e.target.value))} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Delivery (days)</label>
              <Input type="number" value={form.basic_delivery_days} onChange={(e) => u("basic_delivery_days", Number(e.target.value))} />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">What's included</label>
            <Textarea rows={2} value={form.basic_description} onChange={(e) => u("basic_description", e.target.value)} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <h3 className="font-heading text-sm font-semibold text-foreground">Standard Package (optional)</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Price ($)</label>
              <Input type="number" value={form.standard_price} onChange={(e) => u("standard_price", e.target.value)} placeholder="e.g. 50" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Delivery (days)</label>
              <Input type="number" value={form.standard_delivery_days} onChange={(e) => u("standard_delivery_days", e.target.value)} placeholder="14" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">What's included</label>
            <Textarea rows={2} value={form.standard_description} onChange={(e) => u("standard_description", e.target.value)} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <h3 className="font-heading text-sm font-semibold text-foreground">Premium Package (optional)</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Price ($)</label>
              <Input type="number" value={form.premium_price} onChange={(e) => u("premium_price", e.target.value)} placeholder="e.g. 100" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Delivery (days)</label>
              <Input type="number" value={form.premium_delivery_days} onChange={(e) => u("premium_delivery_days", e.target.value)} placeholder="21" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">What's included</label>
            <Textarea rows={2} value={form.premium_description} onChange={(e) => u("premium_description", e.target.value)} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServiceForm;
