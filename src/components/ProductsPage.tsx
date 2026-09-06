import { useEffect, useState } from "react";
import { endpoints } from "@/lib/endpoints";
import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useShop } from "@/lib/store";

export function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { wishlist, toggleWishlist } = useShop();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await endpoints.getProducts(selectedCategory === "all" ? undefined : selectedCategory);
        if (res.success) {
          setProducts(res.products);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [selectedCategory]);

  return (
    <div className="container-page py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Catalogue</h1>
          <p className="text-xs text-muted-foreground mt-1">Explore our live inventory straight from the database.</p>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
          {["all", "suits", "kurtis", "lehengas", "anarkali"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? "bg-primary text-primary-foreground font-semibold" 
                  : "bg-secondary text-secondary-foreground hover:opacity-80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-24 text-xs text-muted-foreground">Loading inventory...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-2xl">
          <p className="text-xs text-muted-foreground">No products found in this category.</p>
          <Link to="/admin" className="text-xs text-primary font-medium underline mt-2 inline-block">Add items via Admin Dashboard</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const isWishlisted = wishlist.includes(product._id);
            return (
              <div key={product._id} className="group relative bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                <Link to={`/product/$productId`} params={{ productId: product._id }} className="block aspect-[3/4] bg-secondary/20 overflow-hidden relative">
                  <img
                    src={product.images?.[0]?.url || "https://placehold.co/400x600"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.isNewItem && (
                    <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] uppercase px-2 py-1 rounded tracking-wider font-semibold">
                      New
                    </span>
                  )}
                </Link>

                <button
                  onClick={() => toggleWishlist(product._id)}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                    isWishlisted ? "bg-primary text-primary-foreground" : "bg-card/80 text-foreground hover:bg-card"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
                </button>

                <div className="p-4">
                  <Link to={`/product/$productId`} params={{ productId: product._id }} className="block">
                    <h3 className="font-display text-sm font-semibold truncate hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{product.fabric || product.category}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-sm font-bold text-primary">₹{product.price}</span>
                    {product.mrp && product.mrp > product.price && (
                      <span className="text-xs text-muted-foreground line-through">₹{product.mrp}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}