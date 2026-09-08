import { useEffect, useState } from "react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { endpoints, ProductQueryParams } from "@/lib/endpoints";
import { ProductCard } from "@/components/ProductCard";
import { SlidersHorizontal, RefreshCw, X, ChevronDown } from "lucide-react";

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
    <div className="container-page py-10 space-y-8">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">
            {currentMainCategory === "All" ? "Complete Catalog" : `${currentMainCategory}'s Collection`}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Showing {products.length} {products.length === 1 ? "style" : "styles"} found
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Main Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto bg-secondary/40 p-1 rounded-xl border border-border">
            {MAIN_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  currentMainCategory === cat
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
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
            className="p-2 bg-card border border-border rounded-xl text-xs font-semibold outline-none focus:border-primary"
          >
            <option value="newest">Featured & Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Active Filter Badges */}
      {(currentMainCategory !== "All" || currentDealType || currentMaxPrice || subCategoryFilter) && (
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-muted-foreground font-semibold">Active Filters:</span>
          {currentMainCategory !== "All" && (
            <span className="bg-secondary px-2.5 py-1 rounded-lg border border-border flex items-center gap-1 font-medium">
              Category: {currentMainCategory}
            </span>
          )}
          {currentDealType && (
            <span className="bg-amber-500/10 text-amber-700 border border-amber-500/20 px-2.5 py-1 rounded-lg font-bold">
              Deal: {currentDealType} Deals
            </span>
          )}
          {currentMaxPrice && (
            <span className="bg-secondary px-2.5 py-1 rounded-lg border border-border font-medium">
              Max Price: ₹{currentMaxPrice}
            </span>
          )}
          <button
            onClick={handleClearFilters}
            className="text-xs text-primary font-bold hover:underline flex items-center gap-1 ml-2"
          >
            <X className="h-3.5 w-3.5" /> Clear All
          </button>
        </div>
      )}

      {/* Product Grid */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto text-primary" />
          <p className="text-xs text-muted-foreground">Filtering styles...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl space-y-3">
          <p className="font-display text-base font-bold">No products found</p>
          <p className="text-xs text-muted-foreground">
            No items matched "{currentMainCategory}". Try adjusting your filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold"
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