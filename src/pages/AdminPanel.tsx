import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, Package, Briefcase, DollarSign, ShieldCheck, TrendingUp, Handshake, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import SEOHead from "@/components/SEOHead";
import { useToast } from "@/hooks/use-toast";

interface PlatformStats {
  totalUsers: number;
  totalProducts: number;
  totalServices: number;
  totalOrders: number;
  totalRevenue: number;
}

const AdminPanelContent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<PlatformStats>({ totalUsers: 0, totalProducts: 0, totalServices: 0, totalOrders: 0, totalRevenue: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [partnerships, setPartnerships] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    checkAdmin();
  }, [user]);

  const checkAdmin = async () => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user!.id)
      .eq("role", "admin")
      .single();

    if (data) {
      setIsAdmin(true);
      fetchAll();
    } else {
      setIsAdmin(false);
      setLoading(false);
    }
  };

  const fetchAll = async () => {
    const [profilesRes, productsRes, ordersRes, servicesRes, partnershipsRes] = await Promise.all([
      supabase.from("profiles").select("user_id, display_name, avatar_url, created_at").order("created_at", { ascending: false }).limit(50),
      supabase.from("products").select("id, title, price, category, is_published, creator_id, sales_count, created_at").order("created_at", { ascending: false }).limit(50),
      supabase.from("orders").select("id, amount, buyer_email, status, created_at, product_id").order("created_at", { ascending: false }).limit(50),
      supabase.from("services").select("id").limit(1000),
      supabase.from("partnership_applications").select("*").order("created_at", { ascending: false }).limit(50),
    ]);

    // Get accurate counts
    const [usersCount, productsCount, servicesCount, ordersCount] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("services").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id", { count: "exact", head: true }),
    ]);

    setUsers(profilesRes.data || []);
    setProducts(productsRes.data || []);
    setOrders(ordersRes.data || []);
    setPartnerships(partnershipsRes.data || []);

    const totalRevenue = (ordersRes.data || []).reduce((s, o) => s + Number(o.amount), 0);

    setStats({
      totalUsers: usersCount.count ?? 0,
      totalProducts: productsCount.count ?? 0,
      totalServices: servicesCount.count ?? 0,
      totalOrders: ordersCount.count ?? 0,
      totalRevenue,
    });
    setLoading(false);
  };

  const updatePartnershipStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("partnership_applications")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Updated", description: `Application ${status}` });
      setPartnerships((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    }
  };

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ShieldCheck size={48} className="mx-auto text-destructive/50 mb-4" />
          <h1 className="font-heading text-xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-sm text-muted-foreground mb-4">You don't have admin privileges.</p>
          <Link to="/dashboard"><Button variant="outline">Back to Dashboard</Button></Link>
        </div>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Admin Panel — DropVault" description="Platform administration dashboard" />
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link to="/dashboard"><Button variant="ghost" size="icon"><ArrowLeft size={18} /></Button></Link>
            <h1 className="font-heading text-lg font-bold flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary" /> Admin Panel
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Users", value: stats.totalUsers, icon: Users },
            { label: "Products", value: stats.totalProducts, icon: Package },
            { label: "Services", value: stats.totalServices, icon: Briefcase },
            { label: "Orders", value: stats.totalOrders, icon: TrendingUp },
            { label: "Revenue", value: `$${stats.totalRevenue.toFixed(0)}`, icon: DollarSign },
          ].map((s) => (
            <Card key={s.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <s.icon size={14} /> {s.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-heading text-2xl font-bold">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="partnerships">
              Partnerships
              {partnerships.filter((p) => p.status === "pending").length > 0 && (
                <Badge variant="destructive" className="ml-1.5 text-[10px] px-1.5 py-0">
                  {partnerships.filter((p) => p.status === "pending").length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-4 space-y-2">
            {users.map((u) => (
              <Card key={u.user_id} className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                    {u.display_name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{u.display_name || "Unnamed"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</p>
                  </div>
                  <Link to={`/creator/${u.user_id}`}>
                    <Button variant="outline" size="sm" className="text-xs">View</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="products" className="mt-4 space-y-2">
            {products.map((p) => (
              <Card key={p.id} className="p-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{p.title}</p>
                      <Badge variant={p.is_published ? "default" : "secondary"} className="text-[10px]">{p.is_published ? "Live" : "Draft"}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{p.category} · ${p.price} · {p.sales_count} sales</p>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="orders" className="mt-4 space-y-2">
            {orders.map((o) => (
              <Card key={o.id} className="p-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{o.buyer_email}</p>
                    <p className="text-xs text-muted-foreground">${o.amount} · {o.status} · {new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{o.status}</Badge>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="partnerships" className="mt-4 space-y-2">
            {partnerships.length === 0 && (
              <p className="text-sm text-muted-foreground py-8 text-center">No partnership applications yet.</p>
            )}
            {partnerships.map((p) => (
              <Card key={p.id} className="p-4">
                <div className="flex items-start gap-3">
                  <Handshake size={18} className="text-primary mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold">{p.company_name}</p>
                      <Badge
                        variant={p.status === "approved" ? "default" : p.status === "rejected" ? "destructive" : "secondary"}
                        className="text-[10px]"
                      >
                        {p.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.contact_name} · {p.email}</p>
                    <p className="text-xs text-muted-foreground">{p.category} · {p.audience_size} audience · {p.commission_model}</p>
                    <p className="text-xs mt-1">{p.product_description}</p>
                    {p.additional_notes && <p className="text-xs text-muted-foreground mt-1 italic">{p.additional_notes}</p>}
                    <p className="text-[10px] text-muted-foreground mt-1">{new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                  {p.status === "pending" && (
                    <div className="flex gap-1 shrink-0">
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600" onClick={() => updatePartnershipStatus(p.id, "approved")}>
                        <Check size={14} />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => updatePartnershipStatus(p.id, "rejected")}>
                        <X size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

const AdminPanel = () => (
  <ProtectedRoute>
    <AdminPanelContent />
  </ProtectedRoute>
);

export default AdminPanel;
