import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Package, DollarSign, TrendingUp, LogOut, User, ChevronRight, Eye, EyeOff, Trash2, Sparkles, Briefcase, BarChart3, MessageSquare, ShieldCheck } from "lucide-react";
import StripeConnectCard from "@/components/StripeConnectCard";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  is_published: boolean;
  sales_count: number;
  cover_image_url: string | null;
  created_at: string;
}

interface OrderStat {
  total_revenue: number;
  total_orders: number;
}

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [stats, setStats] = useState<OrderStat>({ total_revenue: 0, total_orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [productsRes, ordersRes, servicesRes] = await Promise.all([
        supabase
          .from("products")
          .select("id, title, price, category, is_published, sales_count, cover_image_url, created_at")
          .eq("creator_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("orders")
          .select("amount, product_id, products!inner(creator_id)")
          .eq("products.creator_id", user.id),
        supabase
          .from("services")
          .select("id, title, basic_price, category, is_published, sales_count, cover_image_url, created_at")
          .eq("creator_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (servicesRes.data) setServices(servicesRes.data);

      if (ordersRes.data) {
        const revenue = ordersRes.data.reduce((sum, o) => sum + Number(o.amount), 0);
        setStats({ total_revenue: revenue, total_orders: ordersRes.data.length });
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Deleted", description: "Product removed." });
    }
  };

  const togglePublish = async (id: string, current: boolean) => {
    const { error } = await supabase.from("products").update({ is_published: !current }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, is_published: !current } : p)));
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <Link to="/" className="font-heading text-xl font-bold tracking-tight text-foreground">
            dropvault<span className="text-primary">.</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/dashboard/profile">
              <Button variant="ghost" size="default" className="text-base">
                <User size={18} className="mr-1.5" /> <span className="hidden sm:inline">Profile</span>
              </Button>
            </Link>
            <Button variant="ghost" size="default" className="text-base" onClick={signOut}>
              <LogOut size={18} className="mr-1.5" /> <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-base text-muted-foreground mt-1">Manage your products and track sales</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto flex-wrap">
            <Link to="/dashboard/analytics">
              <Button variant="outline" size="lg" className="text-base">
                <BarChart3 size={18} className="mr-1.5" /> Analytics
              </Button>
            </Link>
            <Link to="/messages">
              <Button variant="outline" size="lg" className="text-base">
                <MessageSquare size={18} className="mr-1.5" /> Messages
              </Button>
            </Link>
            <Link to="/dashboard/cabinet">
              <Button variant="outline" size="lg" className="text-base">
                <Sparkles size={18} className="mr-1.5" /> Cabinet
              </Button>
            </Link>
            <Link to="/dashboard/products/new">
              <Button size="lg" className="text-base">
                <Plus size={18} className="mr-1.5" /> Product
              </Button>
            </Link>
            <Link to="/dashboard/services/new">
              <Button size="lg" className="text-base" variant="secondary">
                <Briefcase size={18} className="mr-1.5" /> Service
              </Button>
            </Link>
          </div>
        </div>

        {/* Stripe Connect */}
        <div className="mb-8">
          <StripeConnectCard />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-muted-foreground flex items-center gap-2">
                <Package size={18} /> Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-3xl font-bold">{products.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign size={18} /> Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-3xl font-bold">${stats.total_revenue.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp size={18} /> Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-3xl font-bold">{stats.total_orders}</p>
            </CardContent>
          </Card>
        </div>

        {/* Products list */}
        <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Your Products</h2>
        {products.length === 0 ? (
          <Card className="p-12 text-center">
            <Package size={48} className="mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-lg text-muted-foreground mb-4">No products yet. Create your first digital product!</p>
            <Link to="/dashboard/products/new">
              <Button size="lg" className="text-base">
                <Plus size={18} className="mr-1.5" /> Create Product
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <Card key={p.id} className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Image + info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-16 h-16 rounded-xl bg-muted flex-shrink-0 overflow-hidden">
                      {p.cover_image_url ? (
                        <img src={p.cover_image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={24} className="text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-heading text-base font-semibold truncate">{p.title}</h3>
                        <Badge variant={p.is_published ? "default" : "secondary"} className="text-xs shrink-0">
                          {p.is_published ? "Live" : "Draft"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {p.category} · {p.price === 0 ? "Free" : `$${p.price}`} · {p.sales_count} sales
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0 sm:ml-auto">
                    <Button
                      variant="ghost"
                      size="default"
                      className="text-sm"
                      onClick={() => togglePublish(p.id, p.is_published)}
                    >
                      {p.is_published ? <EyeOff size={16} className="mr-1.5" /> : <Eye size={16} className="mr-1.5" />}
                      {p.is_published ? "Unpublish" : "Publish"}
                    </Button>
                    <Link to={`/dashboard/products/${p.id}`}>
                      <Button variant="outline" size="default" className="text-sm">
                        Edit <ChevronRight size={16} className="ml-1" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(p.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Services list */}
        <h2 className="font-heading text-xl font-semibold text-foreground mb-4 mt-10">Your Services</h2>
        {services.length === 0 ? (
          <Card className="p-8 text-center">
            <Briefcase size={40} className="mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-base text-muted-foreground mb-4">No services yet. Start offering freelance gigs!</p>
            <Link to="/dashboard/services/new">
              <Button size="lg" className="text-base">
                <Plus size={18} className="mr-1.5" /> Create Service
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {services.map((s: any) => (
              <Card key={s.id} className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-16 h-16 rounded-xl bg-muted flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {s.cover_image_url ? (
                        <img src={s.cover_image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Briefcase size={24} className="text-muted-foreground/40" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-heading text-base font-semibold truncate">{s.title}</h3>
                        <Badge variant={s.is_published ? "default" : "secondary"} className="text-xs shrink-0">
                          {s.is_published ? "Live" : "Draft"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{s.category} · From ${s.basic_price} · {s.sales_count} orders</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link to={`/dashboard/services/${s.id}`}>
                      <Button variant="outline" size="default" className="text-sm">
                        Edit <ChevronRight size={16} className="ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
