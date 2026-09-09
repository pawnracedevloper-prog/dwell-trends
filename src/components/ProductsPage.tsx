import { useEffect, useState } from "react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { endpoints, ProductQueryParams } from "@/lib/endpoints";
import { ProductCard } from "@/components/ProductCard";
import { SlidersHorizontal, RefreshCw, X, ChevronDown, Sparkles } from "lucide-react";

const MAIN_CATEGORIES = ["All", "Women", "Men", "Kids", "Beauty", "Home"];

export function ProductsPage() {
  const searchParams = useSearch({ strict: false }) as any;
  const navigate = useNavigate();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Filter States
  const currentMainCategory = searchParams?.mainCategory || "All";
  const currentDealType = searchParams?.dealType || "";
  const currentMaxPrice = searchParams?.maxPrice ? Number(searchParams.maxPrice) : null;
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "newest">("newest");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");

  useEffect(() => {
    async function loadFilteredProducts() {
      setLoading(true);
      try {
        const query: ProductQueryParams = {};

        if (currentMainCategory && currentMainCategory !== "All") {
          query.mainCategory = currentMainCategory;
        }

        if (currentDealType) {
          query.dealType = currentDealType;
        }

        if (currentMaxPrice) {
          query.maxPrice = currentMaxPrice;
        }

        if (subCategoryFilter) {
          query.subCategory = subCategoryFilter;
        }

        if (sortBy === "price-asc" || sortBy === "price-desc") {
          query.sort = sortBy;
        }

        const res = await endpoints.getProducts(query);
        if (res.success && res.products) {
          let items = res.products;

          // In-memory fallback if backend hasn't applied sorting
          if (sortBy === "price-asc") {
            items = [...items].sort((a, b) => (a.dealPrice || a.price) - (b.dealPrice || b.price));
          } else if (sortBy === "price-desc") {
            items = [...items].sort((a, b) => (b.dealPrice || b.price) - (a.dealPrice || a.price));
          }

          setProducts(items);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }

    loadFilteredProducts();
  }, [currentMainCategory, currentDealType, currentMaxPrice, subCategoryFilter, sortBy]);

  const handleCategoryChange = (category: string) => {
    navigate({
      to: "/products",
      search: category === "All" ? {} : { mainCategory: category },
    });
  };

  const handleClearFilters = () => {
    setSubCategoryFilter("");
    navigate({ to: "/products", search: {} });
  };

  return (
    <div className="container-page py-10 space-y-8 min-h-screen text-foreground">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight glam-gradient-text flex items-center gap-2">
            <span>{currentMainCategory === "All" ? "Complete Collection" : `${currentMainCategory}'s Edit`}</span>
            <span className="text-primary text-sm">✦</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Showing <span className="text-rose-soft font-bold">{products.length}</span> {products.length === 1 ? "statement piece" : "statement pieces"} curated
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Main Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto bg-[#14171e]/90 p-1.5 rounded-2xl border border-border/80 shadow-md backdrop-blur-md">
            {MAIN_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  currentMainCategory === cat
                    ? "bg-primary text-white glam-glow shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="p-2.5 bg-[#14171e]/90 border border-border/80 rounded-2xl text-xs font-bold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-md backdrop-blur-md"
          >
            <option value="newest">Featured & Newest Drops</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Active Filter Badges */}
      {(currentMainCategory !== "All" || currentDealType || currentMaxPrice || subCategoryFilter) && (
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-muted-foreground font-black uppercase tracking-widest text-[10px] flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-primary" /> Active Filters:
          </span>
          {currentMainCategory !== "All" && (
            <span className="bg-secondary/80 text-rose-soft px-3 py-1 rounded-full border border-primary/30 flex items-center gap-1.5 font-bold shadow-xs">
              <span className="text-[10px]">✦</span> Category: {currentMainCategory}
            </span>
          )}
          {currentDealType && (
            <span className="bg-primary/15 text-rose-soft border border-primary/40 px-3 py-1 rounded-full font-black uppercase tracking-wider glam-glow">
              Deal: {currentDealType}
            </span>
          )}
          {currentMaxPrice && (
            <span className="bg-secondary/80 text-foreground px-3 py-1 rounded-full border border-border/80 font-bold">
              Under ₹{currentMaxPrice}
            </span>
          )}
          <button
            onClick={handleClearFilters}
            className="text-xs text-primary font-black uppercase tracking-wider hover:underline flex items-center gap-1 ml-2 transition-all hover:scale-105"
          >
            <X className="h-3.5 w-3.5" /> Clear All
          </button>
        </div>
      )}

      {/* Product Grid */}
      {loading ? (
        <div className="py-28 text-center space-y-3">
          <RefreshCw className="h-7 w-7 animate-spin mx-auto text-primary" />
          <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase">Filtering Drops...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border/80 bg-[#14171e]/50 backdrop-blur-md rounded-3xl space-y-4 max-w-md mx-auto">
          <p className="font-display text-lg font-black glam-gradient-text">No Styles Found</p>
          <p className="text-xs text-muted-foreground leading-relaxed px-4">
            No items matched your active selections for "{currentMainCategory}". Adjust your filters to discover more.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-wider glam-glow hover:opacity-95 transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}