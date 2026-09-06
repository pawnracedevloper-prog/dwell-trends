import { useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { CATEGORIES } from "@/lib/products";

interface FilterProps {
  selectedCategory?: string;
  sortBy?: string;
  maxPrice?: number;
}

const FABRICS = ["Silk", "Chanderi", "Cotton", "Georgette", "Rayon"];
const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
];

export function FilterSortSidebar({ selectedCategory, sortBy = "newest", maxPrice }: FilterProps) {
  const navigate = useNavigate();

  function updateSearch(updates: Record<string, unknown>) {
    navigate({
      to: "/products",
      search: (prev: Record<string, unknown>) => ({ ...prev, ...updates }),
    });
  }

  function clearFilters() {
    navigate({
      to: "/products",
      search: { q: undefined, category: undefined, sortBy: undefined, maxPrice: undefined },
    });
  }

  return (
    <aside className="w-full space-y-6">
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold tracking-wide">Filters</h3>
        </div>
        <button
          type="button"
          onClick={clearFilters}
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-rose-deep"
        >
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>

      {/* Sort Option */}
      <div className="space-y-2">
        <label className="eyebrow block text-muted-foreground">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => updateSearch({ sortBy: e.target.value })}
          className="h-9 w-full rounded-lg border border-border bg-card px-3 text-xs outline-none focus:border-rose-deep"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div className="space-y-2.5">
        <label className="eyebrow block text-muted-foreground">Category</label>
        <div className="space-y-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => updateSearch({ category: selectedCategory === c ? undefined : c })}
              className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition-colors ${
                selectedCategory === c
                  ? "bg-primary font-medium text-primary-foreground"
                  : "text-foreground/80 hover:bg-accent hover:text-foreground"
              }`}
            >
              <span>{c}</span>
              {selectedCategory === c && <span className="text-[10px]">•</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Fabric Tags */}
      <div className="space-y-2.5">
        <label className="eyebrow block text-muted-foreground">Fabric</label>
        <div className="flex flex-wrap gap-1.5">
          {FABRICS.map((fabric) => (
            <button
              key={fabric}
              type="button"
              className="rounded-md border border-border/80 bg-card px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {fabric}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}