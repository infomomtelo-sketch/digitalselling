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
import { ArrowLeft, Upload, Image } from "lucide-react";

const categories = ["Design Assets", "Software", "Online Course", "Templates", "E-book", "Other"];

const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = id && id !== "new";
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    long_description: "",
    price: "",
    category: "Other",
    is_published: false,
    cover_image_url: "",
    file_url: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    const payload = {
      title: form.title,
      description: form.description || null,
      long_description: form.long_description || null,
      price: parseFloat(form.price) || 0,
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
      toast({ title: isEdit ? "Updated" : "Created", description: `Product ${isEdit ? "updated" : "created"} successfully.` });
      navigate("/dashboard");
    }
    setSaving(false);
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between h-14">
          <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors">
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/dashboard">
              <Button type="button" variant="ghost" size="sm">Cancel</Button>
            </Link>
            <Button size="sm" disabled={saving || !form.title} onClick={handleSubmit}>
              {saving ? "Saving..." : isEdit ? "Update" : "Create Product"}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-heading text-2xl font-bold text-foreground mb-6">
          {isEdit ? "Edit Product" : "New Product"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="My Awesome Product"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="49.00"
                required
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="A brief description shown in product cards"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="long_description">Full Description</Label>
            <Textarea
              id="long_description"
              value={form.long_description}
              onChange={(e) => setForm((f) => ({ ...f, long_description: e.target.value }))}
              placeholder="Detailed product description shown on the product page"
              rows={5}
            />
          </div>

          {/* Cover Image Upload */}
          <div>
            <Label>Cover Image</Label>
            <div className="mt-1 flex items-center gap-4">
              {form.cover_image_url ? (
                <img src={form.cover_image_url} alt="Cover" className="w-24 h-16 rounded-lg object-cover border border-border" />
              ) : (
                <div className="w-24 h-16 rounded-lg border border-dashed border-border flex items-center justify-center">
                  <Image size={20} className="text-muted-foreground/40" />
                </div>
              )}
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "cover")}
                />
                <Button type="button" variant="outline" size="sm" asChild>
                  <span><Upload size={14} className="mr-1" /> {uploading ? "Uploading..." : "Upload"}</span>
                </Button>
              </label>
            </div>
          </div>

          {/* Product File Upload */}
          <div>
            <Label>Product File (downloadable)</Label>
            <div className="mt-1 flex items-center gap-4">
              {form.file_url && (
                <a href={form.file_url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline truncate max-w-[200px]">
                  {form.file_url.split("/").pop()}
                </a>
              )}
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "file")}
                />
                <Button type="button" variant="outline" size="sm" asChild>
                  <span><Upload size={14} className="mr-1" /> {uploading ? "Uploading..." : "Upload File"}</span>
                </Button>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={form.is_published}
              onCheckedChange={(v) => setForm((f) => ({ ...f, is_published: v }))}
            />
            <Label>Publish immediately</Label>
          </div>

          {/* Bottom action bar */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Link to="/dashboard">
              <Button type="button" variant="ghost">← Back to Dashboard</Button>
            </Link>
            <Button type="submit" disabled={saving || !form.title}>
              {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ProductForm;
