import { useEffect, useState } from "react";
import { endpoints } from "@/lib/endpoints";
import { Link } from "@tanstack/react-router";
import { useShop } from "@/lib/store";
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Zap, 
  Flame, 
  Tag, 
  ChevronRight,
  Clock,
  ShieldAlert
} from "lucide-react";

const CATEGORY_BUBBLES = [
  { name: "Women", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=300", query: "Women" },
  { name: "Men", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=300", query: "Men" },
  { name: "Kids", image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=300", query: "Kids" },
  { name: "Beauty", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=300", query: "Beauty" },
  { name: "Home", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=300", query: "Home" },
];

export function HomePage() {
  const { user, setUser } = useShop();
  const [activeCampaign, setActiveCampaign] = useState<any>(null);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [flashDeals, setFlashDeals] = useState<any[]>([]);
  const [budgetUnder999, setBudgetUnder999] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Synchronize user session state on page load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      endpoints.getProfile?.()
        .then((res: any) => {
          if (res?.success && res.user && setUser) {
            setUser(res.user);
          }
        })
        .catch(console.error);
    }
  }, [user, setUser]);

  useEffect(() => {
    async function loadCatalog() {
      try {
        setLoading(true);
        const [campaignRes, allRes, under999Res] = await Promise.allSettled([
          endpoints.getActiveCampaign?.() || Promise.resolve({ success: false }),
          endpoints.getProducts(),
          endpoints.getProducts({ maxPrice: 999 }),
        ]);

        if (campaignRes.status === "fulfilled" && campaignRes.value?.success && campaignRes.value.campaign) {
          setActiveCampaign(campaignRes.value.campaign);
        }

        if (allRes.status === "fulfilled" && allRes.value?.success && allRes.value.products) {
          setFeaturedProducts(allRes.value.products.slice(0, 8));
          const activeDeals = allRes.value.products.filter(
            (p: any) => p.dealType === "Hot" || p.dealType === "Wow"
          );
          setFlashDeals(activeDeals.slice(0, 4));
        }

        if (under999Res.status === "fulfilled" && under999Res.value?.success && under999Res.value.products) {
          setBudgetUnder999(under999Res.value.products.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to load home page sections:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCatalog();
  }, []);

  const renderProductItem = (product: any) => {
    const isDealActive = product.dealType && product.dealType !== "None" && product.dealPrice;
    const effectivePrice = isDealActive ? Number(product.dealPrice) : Number(product.price);
    const originalMrp = Number(product.mrp || product.price);
    const discountPercent = originalMrp > effectivePrice 
      ? Math.round(((originalMrp - effectivePrice) / originalMrp) * 100) 
      : 0;

    return (
      <Link 
        key={product._id} 
        to="/product/$productId" 
        params={{ productId: product._id }} 
        className="group block bg-card border border-border rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all"
      >
        <div className="aspect-[3/4] bg-secondary/20 overflow-hidden relative">
          <img 
            src={product.images?.[0]?.url || product.images?.[0] || ""} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />

          {/* Deal Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {product.dealType === "Wow" && (
              <span className="flex items-center gap-1 rounded bg-blue-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
                <Zap className="h-3 w-3 fill-amber-300 text-amber-300" /> WOW DEAL
              </span>
            )}
            {product.dealType === "Hot" && (
              <span className="flex items-center gap-1 rounded bg-amber-500 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
                <Flame className="h-3 w-3 fill-white text-white" /> HOT DEAL
              </span>
            )}
          </div>
        </div>

        <div className="p-4 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">
            {product.brand || "Dwell Trends"}
          </p>
          <h3 className="font-display text-sm font-semibold truncate text-foreground">{product.name}</h3>
          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-sm font-bold text-primary">₹{effectivePrice}</span>
            {originalMrp > effectivePrice && (
              <span className="text-xs text-muted-foreground line-through">₹{originalMrp}</span>
            )}
            {discountPercent > 0 && (
              <span className="text-[10px] font-bold text-green-700">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {product.dealType === "Hot" && (
            <p className="text-[10px] font-bold text-amber-600">Hot Deal Applied</p>
          )}
          {product.dealType === "Wow" && (
            <p className="text-[10px] font-bold text-blue-600">Special Offer Applied</p>
          )}
        </div>
      </Link>
    );
  };

  return (
    <div className="space-y-14 pb-16">
      {/* 1. Category Quick Bubble Nav */}
      <section className="border-b border-border bg-card py-4 shadow-xs">
        <div className="container-page flex items-center justify-between sm:justify-center gap-6 overflow-x-auto no-scrollbar py-1">
          {CATEGORY_BUBBLES.map((cat) => (
            <Link
              key={cat.name}
              to="/products"
              search={{ mainCategory: cat.query }}
              className="flex flex-col items-center gap-2 group shrink-0"
            >
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all p-0.5 shadow-xs">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover rounded-full group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. Hero Section (Dynamic Grand Gala Campaign OR Default Hero) */}
      <section className="container-page">
        {activeCampaign?.bannerImage?.url ? (
          /* DWELL GRAND GALA HERO BANNER */
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border min-h-[440px] sm:min-h-[520px] flex flex-col justify-end p-6 sm:p-12 text-white group bg-card">
            <img
              src={activeCampaign.bannerImage.url}
              alt={activeCampaign.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.70]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent" />

            <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-amber-500 text-black px-3.5 py-1 rounded-full text-xs font-black tracking-wider uppercase shadow-md flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 fill-black" /> {activeCampaign.badgeText || "GRAND GALA LIVE"}
                </span>
                {activeCampaign.expiresAt && (
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 text-amber-200">
                    <Clock className="h-3.5 w-3.5" /> Limited Time Event
                  </span>
                )}
              </div>

              <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight drop-shadow-md">
                {activeCampaign.title}
              </h1>

              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-lg drop-shadow line-clamp-2 sm:line-clamp-none">
                {activeCampaign.tagline}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/products"
                  search={{ dealType: "Wow" }}
                  className="px-6 sm:px-8 py-3 bg-primary text-primary-foreground rounded-full text-xs font-bold uppercase tracking-wider hover:opacity-95 shadow-lg flex items-center gap-2 transition-transform active:scale-95"
                >
                  Explore Gala Steals <ArrowRight className="h-4 w-4" />
                </Link>

                {/* Role-Protected Admin Portal Button */}
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="px-5 sm:px-6 py-3 border border-amber-400/50 bg-black/65 backdrop-blur-md text-amber-300 rounded-full text-xs font-bold hover:bg-black/85 transition-colors flex items-center gap-1.5 shadow-md"
                  >
                    <ShieldAlert className="h-4 w-4 text-amber-400" /> Admin Portal
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* STANDARD HERO LAYOUT FALLBACK */
          <div className="relative rounded-3xl bg-secondary/40 border border-border overflow-hidden p-8 sm:p-14 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                <Sparkles className="h-3.5 w-3.5" /> Modern Living & Festive Edit
              </div>
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black leading-tight text-foreground">
                Style That Speaks <br />
                <span className="text-primary font-serif italic">Your Heritage.</span>
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md">
                Unbox artisanal ensembles, trending prints, and exclusive token-powered deals curated for the modern wardrobe.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/products"
                  className="px-8 py-3.5 bg-primary text-primary-foreground rounded-full text-xs font-bold uppercase tracking-wider hover:opacity-95 shadow-md flex items-center gap-2"
                >
                  Shop Collection <ArrowRight className="h-4 w-4" />
                </Link>

                {/* Role-Protected Admin Portal Button */}
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="px-6 py-3.5 border border-border bg-card rounded-full text-xs font-bold hover:bg-secondary/60 transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <ShieldAlert className="h-4 w-4 text-primary" /> Admin Portal
                  </Link>
                )}
              </div>
            </div>
            <div className="aspect-[4/3] md:aspect-[5/4] max-h-[460px] rounded-2xl overflow-hidden shadow-lg border border-border bg-card">
              <img
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1200"
                alt="Artisanal Ethnic Wear Showcase"
                className="w-full h-full object-cover object-top hover:scale-102 transition-transform duration-700"
              />
            </div>
          </div>
        )}
      </section>

      {/* 3. Flash Sale / Gala Deals Rail */}
      {flashDeals.length > 0 && (
        <section className="container-page space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                <Flame className="h-5 w-5 fill-amber-500" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold">Today's Flash Deals</h2>
                <p className="text-xs text-muted-foreground">Limited inventory at promotional pricing</p>
              </div>
            </div>
            <Link
              to="/products"
              search={{ dealType: "Hot" }}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              View All <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {flashDeals.map(renderProductItem)}
          </div>
        </section>
      )}

      {/* 4. Value Propositions */}
      <section className="container-page grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-4 p-5 bg-card border border-border rounded-2xl">
          <Truck className="h-7 w-7 text-primary shrink-0" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider">Free Delivery</h3>
            <p className="text-[11px] text-muted-foreground">Orders above ₹999 ship free</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 bg-card border border-border rounded-2xl">
          <RotateCcw className="h-7 w-7 text-primary shrink-0" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider">7-Day Easy Returns</h3>
            <p className="text-[11px] text-muted-foreground">Doorstep pickup & quick checks</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 bg-card border border-border rounded-2xl">
          <ShieldCheck className="h-7 w-7 text-primary shrink-0" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider">100% Safe Payments</h3>
            <p className="text-[11px] text-muted-foreground">Verified UPI reference tracking</p>
          </div>
        </div>
      </section>

      {/* 5. Budget Store: Under ₹999 */}
      <section className="container-page space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Budget Store · Under ₹999</h2>
              <p className="text-xs text-muted-foreground">Affordable everyday ethnic styles</p>
            </div>
          </div>
          <Link
            to="/products"
            search={{ maxPrice: 999 }}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            View All <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {budgetUnder999.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {budgetUnder999.map(renderProductItem)}
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed border-border rounded-2xl text-xs text-muted-foreground">
            No items under ₹999 found in the catalog.
          </div>
        )}
      </section>

      {/* 6. Featured Catalog Drops */}
      <section className="container-page space-y-6">
        <div className="flex justify-between items-end border-b border-border pb-4">
          <div>
            <h2 className="font-display text-xl font-bold">New Arrivals</h2>
            <p className="text-xs text-muted-foreground">Freshly updated styles directly from your database</p>
          </div>
          <Link to="/products" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            Explore All <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16 text-xs text-muted-foreground">Loading collection...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map(renderProductItem)}
          </div>
        )}
      </section>
    </div>
  );
}