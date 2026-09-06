import { useEffect, useState } from "react";
import { endpoints } from "@/lib/endpoints";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, ShieldCheck, Truck, RotateCcw } from "lucide-react";

export function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await endpoints.getProducts();
        if (res.success) {
          setFeaturedProducts(res.products.slice(0, 4)); // Grab top 4 items for showcase
        }
      } catch (err) {
        console.error("Failed to load featured items:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-secondary/30 py-20 md:py-32 border-b border-border">
        <div className="container-page grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="h-3.5 w-3.5" /> Handcrafted Ethnic Elegance
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Timeless Fashion for the Modern Wardrobe
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
              Explore exquisite handwoven silks, elegant anarkalis, and rich traditional attire curated specifically for festive celebrations and everyday grace.
            </p>
            <div className="flex gap-4 pt-2">
              <Link to="/products" className="px-6 py-3.5 bg-primary text-primary-foreground rounded-full text-xs font-medium hover:opacity-95 flex items-center gap-2">
                Explore Collection <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/admin" className="px-6 py-3.5 border border-border bg-card rounded-full text-xs font-medium hover:bg-secondary/50">
                Admin Portal
              </Link>
            </div>
          </div>
          <div className="aspect-[4/5] bg-secondary/50 rounded-2xl overflow-hidden shadow-sm relative">
            <img 
              src={featuredProducts[0]?.images?.[0]?.url || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800"} 
              alt="Hero Showcase" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="container-page grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="flex items-center gap-4 p-6 bg-card border border-border rounded-xl">
          <Truck className="h-8 w-8 text-primary shrink-0" />
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider">Free Shipping</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">On all orders above ₹999 across India</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-6 bg-card border border-border rounded-xl">
          <RotateCcw className="h-8 w-8 text-primary shrink-0" />
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider">7-Day Returns</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Easy hassle-free doorstep returns</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-6 bg-card border border-border rounded-xl">
          <ShieldCheck className="h-8 w-8 text-primary shrink-0" />
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider">100% Secure</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Protected checkout and payments</p>
          </div>
        </div>
      </section>

      {/* Featured Live Inventory */}
      <section className="container-page space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-display text-2xl font-bold">Featured Drop</h2>
            <p className="text-xs text-muted-foreground mt-1">Live updates straight from your database catalog.</p>
          </div>
          <Link to="/products" className="text-xs font-medium text-primary hover:underline">View All &rarr;</Link>
        </div>

        {loading ? (
          <div className="text-center py-16 text-xs text-muted-foreground">Loading featured inventory...</div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-xl">
            <p className="text-xs text-muted-foreground">No items published yet.</p>
            <Link to="/admin" className="text-xs text-primary font-medium underline mt-1 inline-block">Add products in Admin Dashboard</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product._id} to={`/product/$productId`} params={{ productId: product._id }} className="group block bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="aspect-[3/4] bg-secondary/20 overflow-hidden relative">
                  <img src={product.images?.[0]?.url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-sm font-semibold truncate">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-bold text-primary">₹{product.price}</span>
                    {product.mrp && product.mrp > product.price && (
                      <span className="text-xs text-muted-foreground line-through">₹{product.mrp}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}