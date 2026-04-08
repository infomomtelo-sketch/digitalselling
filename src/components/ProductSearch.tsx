import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const categories = ["All", "Design Assets", "Development", "Templates", "Education"];

interface ProductSearchProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
  activeCategory: string;
}

const ProductSearch = ({ onSearch, onCategoryChange, activeCategory }: ProductSearchProps) => {
  const [query, setQuery] = useState("");

  const handleChange = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="mb-8 space-y-4">
      <div className="relative max-w-md mx-auto">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products, templates, courses..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          className="pl-9 bg-card border-border"
        />
      </div>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <SlidersHorizontal size={14} className="text-muted-foreground" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductSearch;
