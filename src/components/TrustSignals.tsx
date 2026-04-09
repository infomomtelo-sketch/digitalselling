import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, BadgeCheck, Zap, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";

const recentSales = [
  { buyer: "Alex M.", product: "Ultimate UI Kit", price: "$49", time: "2m ago" },
  { buyer: "Priya S.", product: "SaaS Starter", price: "$79", time: "5m ago" },
  { buyer: "Jordan K.", product: "Copywriting Playbook", price: "$29", time: "8m ago" },
  { buyer: "Emily R.", product: "Video Editing Masterclass", price: "$129", time: "11m ago" },
  { buyer: "Marcus L.", product: "Notion Finance Tracker", price: "$19", time: "14m ago" },
];

const TrustBar = () => {
  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
        {[
          { icon: ShieldCheck, label: "Secure" },
          { icon: CreditCard, label: "Stripe" },
          { icon: BadgeCheck, label: "Verified" },
          { icon: Zap, label: "Instant" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2">
            <Icon size={16} className="text-primary" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

const SalesToast = () => {
  const [currentSale, setCurrentSale] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showSale = () => {
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          setCurrentSale((prev) => (prev + 1) % recentSales.length);
        }, 400);
      }, 3500);
    };

    const timer = setTimeout(showSale, 5000);
    const interval = setInterval(showSale, 10000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const sale = recentSales[currentSale];

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-[280px]">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="bg-card border border-border rounded-2xl p-4 shadow-xl flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-full magnetic-gradient flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{sale.buyer.charAt(0)}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                {sale.buyer} bought <span className="text-primary">{sale.product}</span>
              </p>
              <p className="text-[10px] text-muted-foreground">{sale.price} · {sale.time}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { TrustBar, SalesToast };
