import { useState, useEffect } from "react";
import { Menu, X, Search, ShoppingBag, Heart, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-sm" : "bg-background/80 backdrop-blur-sm"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="font-heading text-lg font-bold tracking-tight text-foreground">
            dropvault<span className="text-primary">.</span>
          </Link>

          {/* Center nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/marketplace" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent">Products</Link>
            <Link to="/gigs" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent">Services</Link>
            <Link to="/creators" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent">Creators</Link>
            <a href="#pricing" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent">Pricing</a>
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-1">
                <Link to="/wishlist">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Heart size={16} /></Button>
                </Link>
                <Link to="/messages">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><MessageSquare size={16} /></Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="sm" className="h-8 text-xs font-semibold">Dashboard</Button>
                </Link>
              </div>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">Log in</Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="h-8 text-xs font-semibold magnetic-gradient border-0 text-white">Open Store</Button>
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 border-t border-border mt-2 pt-4 space-y-1">
            <a href="#products" className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-accent">Marketplace</a>
            <Link to="/creators" className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-accent">Creators</Link>
            <Link to="/services" className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-accent">Services</Link>
            <a href="#pricing" className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-accent">Pricing</a>
            <a href="#features" className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-accent">Features</a>
            <div className="flex gap-2 pt-3 px-3">
              {user ? (
                <Link to="/dashboard"><Button size="sm" className="h-8 text-xs">Dashboard</Button></Link>
              ) : (
                <>
                  <Link to="/auth"><Button variant="ghost" size="sm" className="h-8 text-xs">Log in</Button></Link>
                  <Link to="/auth"><Button size="sm" className="h-8 text-xs magnetic-gradient border-0 text-white">Open Store</Button></Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
