import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, DollarSign, Eye, Package, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Analytics = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, views: 0 });
  const [revenueData, setRevenueData] = useState<{ date: string; amount: number }[]>([]);
  const [topProducts, setTopProducts] = useState<{ title: string; sales: number; revenue: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchAnalytics();
  }, [user]);

  const fetchAnalytics = async () => {
    const [ordersRes, productsRes] = await Promise.all([
      supabase
        .from("orders")
        .select("amount, created_at, product_id, products!inner(creator_id, title)")
        .eq("products.creator_id", user!.id),
      supabase.from("products").select("id, title, sales_count, price").eq("creator_id", user!.id),
    ]);

    const orders = ordersRes.data || [];
    const products = productsRes.data || [];

    const totalRevenue = orders.reduce((s, o) => s + Number(o.amount), 0);
    setStats({
      revenue: totalRevenue,
      orders: orders.length,
      products: products.length,
      views: products.reduce((s, p) => s + p.sales_count * 12, 0), // estimate
    });

    // Revenue by day (last 30 days)
    const dayMap = new Map<string, number>();
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      dayMap.set(d.toISOString().split("T")[0], 0);
    }
    orders.forEach((o) => {
      const day = o.created_at.split("T")[0];
      if (dayMap.has(day)) dayMap.set(day, (dayMap.get(day) || 0) + Number(o.amount));
    });
    setRevenueData(Array.from(dayMap.entries()).map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString("en", { month: "short", day: "numeric" }),
      amount,
    })));

    // Top products
    setTopProducts(
      products
        .sort((a, b) => b.sales_count - a.sales_count)
        .slice(0, 5)
        .map((p) => ({ title: p.title, sales: p.sales_count, revenue: p.sales_count * p.price }))
    );

    setLoading(false);
  };

  if (!user) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Please sign in</p></div>;
  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading analytics...</p></div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link to="/dashboard"><Button variant="ghost" size="icon"><ArrowLeft size={18} /></Button></Link>
            <h1 className="font-heading text-lg font-bold flex items-center gap-2">
              <BarChart3 size={18} className="text-primary" /> Analytics
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Revenue", value: `$${stats.revenue.toFixed(0)}`, icon: DollarSign, color: "text-emerald-500" },
            { label: "Orders", value: stats.orders, icon: TrendingUp, color: "text-primary" },
            { label: "Products", value: stats.products, icon: Package, color: "text-amber-500" },
            { label: "Est. Views", value: stats.views, icon: Eye, color: "text-blue-500" },
          ].map((s) => (
            <Card key={s.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <s.icon size={14} className={s.color} /> {s.label}
                </CardTitle>
              </CardHeader>
              <CardContent><p className="font-heading text-2xl font-bold">{s.value}</p></CardContent>
            </Card>
          ))}
        </div>

        {/* Revenue chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base">Revenue (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sales data yet</p>
            ) : (
              topProducts.map((p, i) => (
                <div key={p.title} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground w-6">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.sales} sales</p>
                  </div>
                  <span className="text-sm font-bold text-foreground">${p.revenue.toFixed(0)}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Analytics;
