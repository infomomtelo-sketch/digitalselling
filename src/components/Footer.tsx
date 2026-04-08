import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border py-10 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <span className="font-heading text-base font-bold text-foreground">
              dropvault<span className="text-primary">.</span>
            </span>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Your digital store for products & services.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">Marketplace</h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li><a href="#products" className="hover:text-foreground transition-colors">Browse Products</a></li>
              <li><Link to="/creators" className="hover:text-foreground transition-colors">Creators</Link></li>
              <li><Link to="/services" className="hover:text-foreground transition-colors">Services</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">Sellers</h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><Link to="/dashboard/cabinet" className="hover:text-foreground transition-colors">Seller Cabinet</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">API Docs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
              <li><Link to="/cookies" className="hover:text-foreground transition-colors">Cookies</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
          <span>© {new Date().getFullYear()} dropvault. All rights reserved.</span>
          <span>Powered by Stripe Connect</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
