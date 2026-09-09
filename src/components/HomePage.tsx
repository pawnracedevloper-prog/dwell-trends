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
  ShieldAlert,
  Star,
} from "lucide-react";

const CATEGORY_BUBBLES = [
  { name: "Women", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=300", query: "Women" },
  { name: "Men", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=300", query: "Men" },
  { name: "Kids", image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=300", query: "Kids" },
  { name: "Beauty", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=300", query: "Beauty" },
  { name: "Home", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=300", query: "Home" },
];

function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-muted" />
      <div className="p-4 space-y-2">
        <div className="h-2.5 w-1/3 bg-muted rounded" />
        <div className="h-3.5 w-3/4 bg-muted rounded" />
        <div className="h-3.5 w-1/2 bg-muted rounded" />
      </div>
    </div>
  );
}

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
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          if (setUser) setUser(null);
        });
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
        className="group block bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:border-rose-deep/50 hover:shadow-lift transition-colors duration-300"
      >
        <div className="aspect-[3/4] bg-muted overflow-hidden relative">
          <img
            src={product.images?.[0]?.url || product.images?.[0] || ""}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transform-gpu group-hover:scale-[1.04] transition-transform duration-500"
          />

          {/* Deal Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {product.dealType === "Wow" && (
              <span className="flex items-center gap-1 rounded-full bg-gold px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-primary shadow-md">
                <Zap className="h-3 w-3 fill-primary text-primary" /> Wow Deal
              </span>
            )}
            {product.dealType === "Hot" && (
              <span className="flex items-center gap-1 rounded-full bg-rose-deep px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-white shadow-md">
                <Flame className="h-3 w-3 fill-white text-white" /> Hot Deal
              </span>
            )}
          </div>
        </div>

        <div className="p-4 space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground truncate">
            {product.brand || "Dwell Trends"}
          </p>
          <h3 className="font-display text-sm font-semibold truncate text-foreground group-hover:text-rose-deep transition-colors">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 pt-0.5 flex-wrap">
            <span className="text-sm font-black text-primary">₹{effectivePrice}</span>
            {originalMrp > effectivePrice && (
              <span className="text-xs text-muted-foreground line-through">₹{originalMrp}</span>
            )}
            {discountPercent > 0 && (
              <span className="text-[10px] font-black text-rose-deep bg-accent px-1.5 py-0.5 rounded-md">
                {discountPercent}% off
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="space-y-14 pb-16">
      {/* 1. Category Quick Bubble Nav */}
      <section className="border-b border-border bg-card py-4">
        <div className="container-page flex items-center justify-between sm:justify-center gap-6 overflow-x-auto hide-scrollbar py-1">
          {CATEGORY_BUBBLES.map((cat) => (
            <Link
              key={cat.name}
              to="/products"
              search={{ mainCategory: cat.query }}
              className="flex flex-col items-center gap-2 group shrink-0"
            >
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden border-2 border-border group-hover:border-rose-deep transition-colors p-0.5 bg-secondary/40">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover rounded-full transform-gpu group-hover:scale-[1.05] transition-transform duration-300"
                />
              </div>
              <span className="text-xs font-bold text-muted-foreground group-hover:text-rose-deep transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. Hero Section (Dynamic Campaign OR Default Hero) */}
      <section className="container-page">
        {activeCampaign?.bannerImage?.url ? (
          <div className="relative rounded-3xl overflow-hidden shadow-lift border border-border min-h-[440px] sm:min-h-[520px] flex flex-col justify-end p-6 sm:p-12 text-white group">
            <img
              src={activeCampaign.bannerImage.url}
              alt={activeCampaign.title}
              fetchPriority="high"
              className="absolute inset-0 w-full h-full object-cover transform-gpu group-hover:scale-[1.03] transition-transform duration-500 brightness-[0.68]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

            <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-rose-deep text-white px-3.5 py-1 rounded-full text-xs font-black tracking-wide uppercase shadow-md flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 fill-white" /> {activeCampaign.badgeText || "Gala Live Now"}
                </span>
                {activeCampaign.expiresAt && (
                  <span className="bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> Limited time
                  </span>
                )}
              </div>

              <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-medium leading-tight tracking-tight">
                {activeCampaign.title}
              </h1>

              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-lg line-clamp-2 sm:line-clamp-none">
                {activeCampaign.tagline}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/products"
                  search={{ dealType: "Wow" }}
                  className="px-6 sm:px-8 py-3 bg-rose-deep text-white rounded-full text-xs font-bold uppercase tracking-wide hover:opacity-90 shadow-md flex items-center gap-2 transition-transform active:scale-95"
                >
                  Explore the sale <ArrowRight className="h-4 w-4" />
                </Link>

                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="px-5 sm:px-6 py-3 border border-white/25 bg-black/50 text-white rounded-full text-xs font-bold hover:bg-black/70 transition-colors flex items-center gap-1.5"
                  >
                    <ShieldAlert className="h-4 w-4" /> Admin Portal
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative rounded-3xl bg-secondary/30 border border-border overflow-hidden p-8 sm:p-14 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent text-rose-deep px-3.5 py-1 rounded-full text-xs font-bold">
                <Sparkles className="h-3.5 w-3.5" /> New season, just landed
              </div>
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-medium leading-tight text-foreground">
                Style that feels
                <br />
                <span className="glam-gradient-text">like you.</span>
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                Artisanal silhouettes, everyday staples, and festive statement pieces — curated for a wardrobe that mixes classic and playful without trying too hard.
              </p>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="flex text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <span className="font-semibold text-foreground">4.7/5</span>
                <span>from 12,000+ happy customers</span>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/products"
                  className="px-8 py-3.5 bg-primary text-primary-foreground rounded-full text-xs font-bold uppercase tracking-wide hover:opacity-90 shadow-md flex items-center gap-2"
                >
                  Shop the collection <ArrowRight className="h-4 w-4" />
                </Link>

                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="px-6 py-3.5 border border-border bg-card rounded-full text-xs font-bold text-rose-deep hover:bg-secondary/60 transition-colors flex items-center gap-1.5"
                  >
                    <ShieldAlert className="h-4 w-4" /> Admin Portal
                  </Link>
                )}
              </div>
            </div>
            <div className="aspect-[4/3] md:aspect-[5/4] max-h-[460px] rounded-2xl overflow-hidden shadow-card border border-border bg-card">
              <img
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1200"
                alt="Artisanal ethnic wear showcase"
                fetchPriority="high"
                className="w-full h-full object-cover object-top"
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
              <div className="p-2 rounded-xl bg-accent text-rose-deep">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-medium">Today's flash deals</h2>
                <p className="text-xs text-muted-foreground">Limited stock at promotional pricing</p>
              </div>
            </div>
            <Link
              to="/products"
              search={{ dealType: "Hot" }}
              className="text-xs font-bold text-rose-deep hover:opacity-80 transition-opacity flex items-center gap-1"
            >
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {flashDeals.map(renderProductItem)}
          </div>
        </section>
      )}

      {/* 4. Value Propositions */}
      <section className="container-page grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-4 p-5 bg-card border border-border rounded-2xl">
          <div className="p-2.5 rounded-full bg-accent shrink-0">
            <Truck className="h-5 w-5 text-rose-deep" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground">Free delivery</h3>
            <p className="text-[11px] text-muted-foreground">On orders above ₹999</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 bg-card border border-border rounded-2xl">
          <div className="p-2.5 rounded-full bg-secondary shrink-0">
            <RotateCcw className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground">7-day easy returns</h3>
            <p className="text-[11px] text-muted-foreground">Doorstep pickup, quick checks</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 bg-card border border-border rounded-2xl">
          <div className="p-2.5 rounded-full bg-gold/25 shrink-0">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground">100% safe payments</h3>
            <p className="text-[11px] text-muted-foreground">Verified UPI reference tracking</p>
          </div>
        </div>
      </section>

      {/* 5. Budget Store: Under ₹999 */}
      <section className="container-page space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-secondary text-primary">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-medium">Under ₹999</h2>
              <p className="text-xs text-muted-foreground">Everyday styles that don't stretch the budget</p>
            </div>
          </div>
          <Link
            to="/products"
            search={{ maxPrice: 999 }}
            className="text-xs font-bold text-rose-deep hover:opacity-80 transition-opacity flex items-center gap-1"
          >
            View all <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {budgetUnder999.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {budgetUnder999.map(renderProductItem)}
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed border-border rounded-2xl text-xs text-muted-foreground">
            Nothing under ₹999 right now — check back soon.
          </div>
        )}
      </section>

      {/* 6. Featured Catalog Drops */}
      <section className="container-page space-y-6">
        <div className="flex justify-between items-end border-b border-border pb-4">
          <div>
            <h2 className="font-display text-xl font-medium">New arrivals</h2>
            <p className="text-xs text-muted-foreground">The latest additions to the collection</p>
          </div>
          <Link to="/products" className="text-xs font-bold text-rose-deep hover:opacity-80 transition-opacity flex items-center gap-1">
            Explore all <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map(renderProductItem)}
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed border-border rounded-2xl text-xs text-muted-foreground">
            New styles are on their way — check back soon.
          </div>
        )}
      </section>
    </div>
  );
}