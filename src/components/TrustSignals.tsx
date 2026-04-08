import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, BadgeCheck, Zap } from "lucide-react";
import { useState, useEffect } from "react";

const recentSales = [
  { buyer: "Alex M.", product: "Ultimate UI Kit", price: "$49", time: "2 min ago" },
  { buyer: "Priya S.", product: "SaaS Starter", price: "$79", time: "5 min ago" },
  { buyer: "Jordan K.", product: "Copywriting Playbook", price: "$29", time: "8 min ago" },
  { buyer: "Emily R.", product: "Video Editing Masterclass", price: "$129", time: "11 min ago" },
  { buyer: "Marcus L.", product: "Notion Finance Tracker", price: "$19", time: "14 min ago" },
  { buyer: "Sam W.", product: "React Component Library", price: "$99", time: "18 min ago" },
  { buyer: "Nina T.", product: "Ultimate UI Kit", price: "$49", time: "22 min ago" },
  { buyer: "Chris B.", product: "SaaS Starter", price: "$79", time: "25 min ago" },
];

const TrustBar = () => {
  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8 border-b border-border bg-card/50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-primary" />
          <span>30-day money-back guarantee</span>
        </div>
        <div className="flex items-center gap-2">
          <BadgeCheck size={18} className="text-primary" />
          <span>Verified creators & reviews</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-primary" />
          <span>Instant digital delivery</span>
        </div>
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
        }, 500);
      }, 4000);
    };

    const timer = setTimeout(showSale, 3000);
    const interval = setInterval(showSale, 8000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const sale = recentSales[currentSale];

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-xs">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-xl p-3 shadow-lg backdrop-blur-sm flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-full magnetic-gradient flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{sale.buyer.charAt(0)}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {sale.buyer} purchased <span className="text-primary">{sale.product}</span>
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
