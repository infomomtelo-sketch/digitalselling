import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConnectStatus {
  connected: boolean;
  onboarded: boolean;
}

const StripeConnectCard = () => {
  const { toast } = useToast();
  const [status, setStatus] = useState<ConnectStatus>({ connected: false, onboarded: false });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const checkStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("check-connect-status");
      if (error) throw error;
      setStatus({ connected: data.connected, onboarded: data.onboarded });
    } catch {
      // Not connected yet
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  // Re-check on return from Stripe
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("stripe_onboarded") === "true" || params.get("stripe_refresh") === "true") {
      checkStatus();
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const handleOnboard = async () => {
    setActionLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-connect-account");
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setActionLoading(false);
  };

  const handleDashboard = async () => {
    setActionLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-connect-login");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setActionLoading(false);
  };

  if (loading) return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <CreditCard size={16} className="text-primary" /> Payouts
          {status.onboarded ? (
            <Badge variant="default" className="ml-auto text-[10px]">
              <CheckCircle2 size={10} className="mr-1" /> Active
            </Badge>
          ) : (
            <Badge variant="secondary" className="ml-auto text-[10px]">
              <AlertCircle size={10} className="mr-1" /> Setup needed
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {status.onboarded ? (
          <div>
            <p className="text-xs text-muted-foreground mb-3">
              Your Stripe account is connected. Payments are automatically split — you receive 90% of each sale.
            </p>
            <Button variant="outline" size="sm" onClick={handleDashboard} disabled={actionLoading}>
              <ExternalLink size={14} className="mr-1" /> View Stripe Dashboard
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-xs text-muted-foreground mb-3">
              Connect your Stripe account to receive payouts when your products sell. Takes ~2 minutes.
            </p>
            <Button size="sm" onClick={handleOnboard} disabled={actionLoading}>
              {actionLoading ? "Loading..." : "Connect Stripe Account"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StripeConnectCard;
