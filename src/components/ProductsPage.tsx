import { useSearch, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { SlidersHorizontal, PackageOpen } from "lucide-react";
import { PRODUCTS, CATEGORIES, inCategory } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export function ProductsPage() {
  const search: { category?: string } = useSearch({ strict: false });
  const activeCategory = search.category;

  const filteredProducts = useMemo(() => {
    if (!activeCategory) return PRODUCTS;
    return PRODUCTS.filter((p) => inCategory(p, activeCategory));
  }, [activeCategory]);

  return (
    <div className="container-page py-6 sm:py-10">
      <div className="mb-8 border-b border-border/70 pb-6 text-center sm:text-left">
        <h1 className="font-display text-3xl sm:text-4xl">
          {activeCategory || "All Collections"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Showing {filteredProducts.length} beautiful styles for you
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* Desktop Sidebar Filter */}
        <aside className="hidden lg:block space-y-6">
          <div className="flex items-center gap-2 border-b border-border/70 pb-3 font-semibold">
            <SlidersHorizontal className="h-4 w-4" />
            Categories
          </div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/products"
                search={{ category: undefined }}
                className={`block rounded-md px-3 py-2 transition-colors ${
                  !activeCategory ? "bg-primary font-medium text-primary-foreground" : "text-foreground/80 hover:bg-accent"
                }`}
              >
                All Products
              </Link>
            </li>
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <Link
                  to="/products"
                  search={{ category: cat }}
                  className={`block rounded-md px-3 py-2 transition-colors ${
                    activeCategory === cat ? "bg-primary font-medium text-primary-foreground" : "text-foreground/80 hover:bg-accent"
                  }`}
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Mobile Categories (Horizontal Scroll) */}
        <div className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:hidden">
           <Link
              to="/products"
              search={{ category: undefined }}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium ${
                !activeCategory ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
              }`}
            >
              All
            </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to="/products"
              search={{ category: cat }}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium ${
                activeCategory === cat ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Product Grid */}
        <main>
          {filteredProducts.length === 0 ? (
            <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center">
              <PackageOpen className="h-12 w-12 text-muted-foreground/30" />
              <h3 className="mt-4 text-base font-medium">No products found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                We're restocking this category soon.
              </p>
              <Link
                to="/products"
                search={{ category: undefined }}
                className="mt-6 rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground"
              >
                Clear Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}