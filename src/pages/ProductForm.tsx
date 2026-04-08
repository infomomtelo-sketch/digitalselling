import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { ArrowLeft, Upload, Image, Sparkles, DollarSign, Gift } from "lucide-react";

const categories = ["Design Assets", "Software", "Online Course", "Templates", "E-book", "Music & Audio", "Photography", "Video", "3D Assets", "Fonts", "Notion Templates", "Figma Files", "Other"];

type TemplateCategory = "free" | "paid";

interface ProductTemplate {
  title: string;
  description: string;
  category: string;
  price: string;
  icon: string;
  tag?: string;
  competitor?: string;
}

const productTemplates: Record<TemplateCategory, ProductTemplate[]> = {
  free: [
    { title: "Free Resource Pack", description: "Starter pack to grow your audience", category: "Templates", price: "0", icon: "🎁", tag: "Lead Magnet" },
    { title: "Free Icon Set", description: "50+ vector icons for any project", category: "Design Assets", price: "0", icon: "✨", tag: "Popular" },
    { title: "Free Wallpaper Pack", description: "HD wallpapers for desktop & mobile", category: "Design Assets", price: "0", icon: "🖼️" },
    { title: "Free Notion Planner", description: "Weekly planner template for Notion", category: "Notion Templates", price: "0", icon: "📋", tag: "Trending" },
    { title: "Free Preset Pack", description: "5 Lightroom presets for beginners", category: "Photography", price: "0", icon: "📷" },
    { title: "Free Sound Kit", description: "10 royalty-free loops & samples", category: "Music & Audio", price: "0", icon: "🎵" },
    { title: "Free Cheat Sheet", description: "Quick-reference PDF guide", category: "E-book", price: "0", icon: "📄", tag: "Lead Magnet" },
    { title: "Free Figma UI Kit", description: "Basic components to kickstart designs", category: "Figma Files", price: "0", icon: "🎯" },
  ],
  paid: [
    { title: "UI Kit Pro", description: "500+ production-ready components", category: "Design Assets", price: "29", icon: "🎨", tag: "Best Seller", competitor: "Others charge $59+" },
    { title: "Online Course", description: "Full video course with certificates", category: "Online Course", price: "49", icon: "🎓", tag: "Popular", competitor: "Others charge $99+" },
    { title: "E-book Guide", description: "In-depth PDF guide with templates", category: "E-book", price: "9", icon: "📘", competitor: "Others charge $19+" },
    { title: "Notion Dashboard", description: "All-in-one workspace template", category: "Notion Templates", price: "12", icon: "🧩", tag: "Trending", competitor: "Others charge $29+" },
    { title: "Figma Design System", description: "Complete design system with tokens", category: "Figma Files", price: "19", icon: "💎", competitor: "Others charge $49+" },
    { title: "Lightroom Presets", description: "25 professional photo presets", category: "Photography", price: "14", icon: "📸", tag: "Popular", competitor: "Others charge $35+" },
    { title: "Music Sample Pack", description: "100+ loops, stems & one-shots", category: "Music & Audio", price: "15", icon: "🎧", competitor: "Others charge $39+" },
    { title: "Font Family", description: "Custom typeface with 6 weights", category: "Fonts", price: "19", icon: "🔤", competitor: "Others charge $49+" },
    { title: "Video LUT Pack", description: "Cinematic color grades for video", category: "Video", price: "12", icon: "🎬", competitor: "Others charge $29+" },
    { title: "3D Model Pack", description: "Low-poly assets for games & web", category: "3D Assets", price: "24", icon: "🧊", competitor: "Others charge $59+" },
    { title: "SaaS Starter Kit", description: "Boilerplate code with auth & payments", category: "Software", price: "39", icon: "🚀", tag: "Best Seller", competitor: "Others charge $79+" },
    { title: "WordPress Theme", description: "Responsive theme with page builder", category: "Software", price: "19", icon: "🌐", competitor: "Others charge $49+" },
  ],
};

const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = id && id !== "new";
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pricingType, setPricingType] = useState<"free" | "paid">("paid");
  const [hasEdited, setHasEdited] = useState(false);

  useUnsavedChanges(hasEdited);

  const [form, _setForm] = useState({
    title: "",
    description: "",
    long_description: "",
    price: "",
    category: "Other",
    is_published: false,
    cover_image_url: "",
    file_url: "",
  });

  const setForm: typeof _setForm = (val) => {
    setHasEdited(true);
    _setForm(val);
  };

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!isEdit || !user) return;
    supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .eq("creator_id", user.id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          toast({ title: "Not found", variant: "destructive" });
          navigate("/dashboard");
          return;
        }
        setForm({
          title: data.title,
          description: data.description || "",
          long_description: data.long_description || "",
          price: String(data.price),
          category: data.category,
          is_published: data.is_published,
          cover_image_url: data.cover_image_url || "",
          file_url: data.file_url || "",
        });
        setPricingType(data.price === 0 ? "free" : "paid");
      });
  }, [isEdit, id, user]);

  const uploadFile = async (file: File, type: "cover" | "file") => {
    if (!user) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${type}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-files").upload(path, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("product-files").getPublicUrl(path);
    if (type === "cover") {
      setForm((f) => ({ ...f, cover_image_url: urlData.publicUrl }));
    } else {
      setForm((f) => ({ ...f, file_url: urlData.publicUrl }));
    }
    setUploading(false);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!user) return;
    setSaving(true);

    const payload = {
      title: form.title,
      description: form.description || null,
      long_description: form.long_description || null,
      price: pricingType === "free" ? 0 : parseFloat(form.price) || 0,
      category: form.category,
      is_published: form.is_published,
      cover_image_url: form.cover_image_url || null,
      file_url: form.file_url || null,
      creator_id: user.id,
    };

    let error;
    if (isEdit) {
      ({ error } = await supabase.from("products").update(payload).eq("id", id));
    } else {
      ({ error } = await supabase.from("products").insert(payload));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setHasEdited(false);
      toast({ title: isEdit ? "Updated" : "Created", description: `Product ${isEdit ? "updated" : "created"} successfully.` });
      navigate("/dashboard");
    }
    setSaving(false);
  };

  const applyTemplate = (template: ProductTemplate) => {
    setForm((f) => ({
      ...f,
      title: template.title,
      description: template.description,
      category: template.category,
      price: template.price,
    }));
    setPricingType(template.price === "0" ? "free" : "paid");
  };

  const [templateTab, setTemplateTab] = useState<TemplateCategory>("paid");

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between h-14 gap-2">
          <Link to="/dashboard" className="text-base text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors shrink-0">
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/dashboard">
              <Button type="button" variant="ghost" size="default" className="text-base">
                Cancel
              </Button>
            </Link>
            <Button size="default" className="text-base" disabled={saving || !form.title} onClick={() => handleSubmit()}>
              {saving ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
          {isEdit ? "Edit Product" : "New Product"}
        </h1>
        <p className="text-base text-muted-foreground mb-8">
          {isEdit ? "Update your product details below." : "Choose a template or start from scratch."}
        </p>

        {/* Product Templates - only for new products */}
        {!isEdit && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-primary" />
              <h2 className="text-lg font-heading font-semibold">Quick Start Templates</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {productTemplates.map((t) => (
                <button
                  key={t.title}
                  type="button"
                  onClick={() => applyTemplate(t)}
                  className="text-left p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  <span className="text-2xl mb-2 block">{t.icon}</span>
                  <p className="text-base font-semibold leading-tight">{t.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
                  <p className="text-sm font-medium text-primary mt-2">
                    {t.price === "0" ? "Free" : `$${t.price}`}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-base font-medium">Title</Label>
            <Input
              id="title"
              className="text-base h-12 mt-1.5"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="My Awesome Product"
              required
            />
          </div>

          {/* Pricing Type Toggle */}
          <div>
            <Label className="text-base font-medium mb-3 block">Pricing</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setPricingType("free"); setForm((f) => ({ ...f, price: "0" })); }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  pricingType === "free"
                    ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <Gift size={22} className={pricingType === "free" ? "text-primary" : "text-muted-foreground"} />
                <p className="text-base font-semibold mt-2">Free</p>
                <p className="text-sm text-muted-foreground">Give it away</p>
              </button>
              <button
                type="button"
                onClick={() => setPricingType("paid")}
                className={`p-4 rounded-xl border text-left transition-all ${
                  pricingType === "paid"
                    ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <DollarSign size={22} className={pricingType === "paid" ? "text-primary" : "text-muted-foreground"} />
                <p className="text-base font-semibold mt-2">Paid</p>
                <p className="text-sm text-muted-foreground">Set your price</p>
              </button>
            </div>
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-2 gap-4">
            {pricingType === "paid" && (
              <div>
                <Label htmlFor="price" className="text-base font-medium">Price ($)</Label>
                <Input
                  id="price"
                  className="text-base h-12 mt-1.5"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="49.00"
                  required
                />
              </div>
            )}
            <div className={pricingType === "free" ? "col-span-2" : ""}>
              <Label className="text-base font-medium">Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                <SelectTrigger className="text-base h-12 mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c} className="text-base">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <Label htmlFor="description" className="text-base font-medium">Short Description</Label>
            <Textarea
              id="description"
              className="text-base mt-1.5"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="A brief description shown in product cards"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="long_description" className="text-base font-medium">Full Description</Label>
            <Textarea
              id="long_description"
              className="text-base mt-1.5"
              value={form.long_description}
              onChange={(e) => setForm((f) => ({ ...f, long_description: e.target.value }))}
              placeholder="Detailed product description shown on the product page"
              rows={5}
            />
          </div>

          {/* Cover Image Upload */}
          <div>
            <Label className="text-base font-medium">Cover Image</Label>
            <div className="mt-2 flex items-center gap-4">
              {form.cover_image_url ? (
                <img src={form.cover_image_url} alt="Cover" className="w-28 h-20 rounded-xl object-cover border border-border" />
              ) : (
                <div className="w-28 h-20 rounded-xl border border-dashed border-border flex items-center justify-center">
                  <Image size={24} className="text-muted-foreground/40" />
                </div>
              )}
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "cover")}
                />
                <Button type="button" variant="outline" size="default" className="text-base" asChild>
                  <span><Upload size={16} className="mr-2" /> {uploading ? "Uploading..." : "Upload"}</span>
                </Button>
              </label>
            </div>
          </div>

          {/* Product File Upload */}
          <div>
            <Label className="text-base font-medium">Product File (downloadable)</Label>
            <div className="mt-2 flex items-center gap-4">
              {form.file_url && (
                <a href={form.file_url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline truncate max-w-[200px]">
                  {form.file_url.split("/").pop()}
                </a>
              )}
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "file")}
                />
                <Button type="button" variant="outline" size="default" className="text-base" asChild>
                  <span><Upload size={16} className="mr-2" /> {uploading ? "Uploading..." : "Upload File"}</span>
                </Button>
              </label>
            </div>
          </div>

          {/* Publish toggle */}
          <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
            <Switch
              checked={form.is_published}
              onCheckedChange={(v) => setForm((f) => ({ ...f, is_published: v }))}
            />
            <div>
              <Label className="text-base font-medium">Publish immediately</Label>
              <p className="text-sm text-muted-foreground">Make this product visible to everyone</p>
            </div>
          </div>

          {/* Bottom action bar */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <Link to="/dashboard">
              <Button type="button" variant="ghost" size="lg" className="text-base">
                ← Dashboard
              </Button>
            </Link>
            <Button type="submit" size="lg" className="text-base" disabled={saving || !form.title}>
              {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ProductForm;
