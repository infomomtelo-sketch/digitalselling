import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textClass = scrolled ? "text-foreground" : "text-white";
  const mutedTextClass = scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/60 hover:text-white";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-xl border-b border-border" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className={`font-heading text-xl font-bold tracking-tight ${textClass}`}>
            dropvault<span className="text-primary">.</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#products" className={`text-sm font-medium ${mutedTextClass} transition-colors`}>Products</a>
            <Link to="/creators" className={`text-sm font-medium ${mutedTextClass} transition-colors`}>Creators</Link>
            <a href="#features" className={`text-sm font-medium ${mutedTextClass} transition-colors`}>Features</a>
            <a href="#pricing" className={`text-sm font-medium ${mutedTextClass} transition-colors`}>Pricing</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link to="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/auth"><Button variant="ghost" size="sm" className={mutedTextClass}>Log in</Button></Link>
                <Link to="/auth"><Button size="sm">Start Selling</Button></Link>
              </>
            )}
          </div>

          <button className={`md:hidden ${textClass}`} onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <div className={`md:hidden pb-4 border-t ${scrolled ? "border-border" : "border-white/10"} mt-2 pt-4 space-y-3 ${scrolled ? "" : "bg-foreground/80 backdrop-blur-xl -mx-4 px-4 rounded-b-xl"}`}>
            <a href="#products" className={`block text-sm font-medium ${mutedTextClass}`}>Products</a>
            <Link to="/creators" className={`block text-sm font-medium ${mutedTextClass}`}>Creators</Link>
            <a href="#features" className={`block text-sm font-medium ${mutedTextClass}`}>Features</a>
            <a href="#pricing" className={`block text-sm font-medium ${mutedTextClass}`}>Pricing</a>
            <div className="flex gap-2 pt-2">
              {user ? (
                <Link to="/dashboard"><Button size="sm">Dashboard</Button></Link>
              ) : (
                <>
                  <Link to="/auth"><Button variant="ghost" size="sm" className={mutedTextClass}>Log in</Button></Link>
                  <Link to="/auth"><Button size="sm">Start Selling</Button></Link>
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
