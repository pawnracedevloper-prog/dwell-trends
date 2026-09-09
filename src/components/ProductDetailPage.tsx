import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useShop } from "@/lib/store";
import { ShieldCheck, Truck, RotateCcw, Check, Zap, Flame, Sparkles, Heart } from "lucide-react";

export function ProductDetailPage() {
  const params = useParams({ strict: false }) as any;
  const targetId = params?.productId || params?.id;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [activeImage, setActiveImage] = useState("");
  const [added, setAdded] = useState(false);
  const { addToCart, toggleWishlist, wishlist } = useShop();

  useEffect(() => {
    async function fetchProductDetails() {
      if (!targetId) return;
      setLoading(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL || "https://dwell-trends-backend.vercel.app/api/v1";
        const res = await fetch(`${API_URL}/products/${targetId}`);
        const data = await res.json();

        if (data.success && data.product) {
          setProduct(data.product);
          if (data.product.images?.length > 0) {
            setActiveImage(data.product.images[0].url || data.product.images[0]);
          }
          if (data.product.variants?.length > 0) {
            setSelectedVariant(data.product.variants[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load product details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProductDetails();
  }, [targetId]);

  if (loading) {
    return (
      <div className="text-center py-28 text-xs font-black uppercase tracking-widest text-rose-deep animate-pulse">
        ✦ Loading exclusive drop details... ✦
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-28 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Product not found.
      </div>
    );
  }

  // Calculate dynamic deal price override
  const isDealActive = product.dealType && product.dealType !== "None" && product.dealPrice;
  const effectivePrice = isDealActive ? product.dealPrice : product.price;
  const originalMrp = product.mrp || product.price;
  const discountPercent = Math.round(((originalMrp - effectivePrice) / originalMrp) * 100);
  const isWishlisted = wishlist?.includes(product._id);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product._id,
      size: selectedVariant?.size || "Standard",
      colour: selectedVariant?.colourName || "Default",
      qty: 1,
      price: effectivePrice,
      mrp: originalMrp,
      productDetails: {
        ...product,
        price: effectivePrice,
      },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="container-page py-12 text-foreground min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-card rounded-3xl overflow-hidden border border-border relative shadow-card backdrop-blur-md group">
            <img
              src={activeImage || product.images?.[0]?.url || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Wishlist Floating Button */}
            <button
              type="button"
              onClick={() => toggleWishlist?.(product._id)}
              className="absolute top-4 right-4 p-3 rounded-2xl bg-card/80 backdrop-blur-md border border-rose-deep/20 text-foreground hover:text-rose-deep transition-all hover:scale-110 shadow-md"
              aria-label="Wishlist"
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? "fill-rose-deep text-rose-deep" : "text-rose-deep"}`} />
            </button>
          </div>

          {product.images?.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {product.images.map((img: any, idx: number) => {
                const url = img.url || img;
                const isSelected = activeImage === url;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(url)}
                    className={`aspect-[3/4] rounded-2xl overflow-hidden border transition-all ${
                      isSelected
                        ? "border-rose-deep ring-2 ring-rose-deep/30 scale-105 shadow-xs"
                        : "border-border opacity-70 hover:opacity-100 hover:border-rose-deep/40"
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Info & Actions */}
        <div className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-rose-deep/30 bg-secondary text-[10px] font-black uppercase tracking-widest text-rose-deep mb-2.5 glam-glow">
              <span>✦</span> {product.brand || "Dwell Trends"} • {product.mainCategory || "Collection"} / {product.subCategory || product.category}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black mt-1 text-foreground leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Pricing & Deal Badges */}
          <div className="space-y-3.5 p-6 rounded-3xl bg-card border border-border shadow-card backdrop-blur-md">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-primary">₹{effectivePrice}</span>
              {originalMrp > effectivePrice && (
                <span className="text-base text-muted-foreground line-through font-semibold">₹{originalMrp}</span>
              )}
              {discountPercent > 0 && (
                <span className="bg-secondary text-rose-deep border border-rose-deep/25 text-xs px-3 py-0.5 rounded-full font-black tracking-wider uppercase">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* WOW Deal Banner */}
            {product.dealType === "Wow" && (
              <div className="rounded-2xl bg-secondary border border-rose-deep/30 p-4 text-foreground shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-gold text-primary text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                      WOW DEAL
                    </span>
                    <span className="text-sm font-black text-rose-deep">Buy at ₹{product.dealPrice}</span>
                  </div>
                  <Zap className="h-4 w-4 fill-rose-deep text-rose-deep animate-pulse" />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                  Special flash promotion applied! Grab it before stock runs out.
                </p>
              </div>
            )}

            {/* Hot Deal Tag */}
            {product.dealType === "Hot" && (
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-rose-deep bg-secondary px-3.5 py-1.5 rounded-full border border-rose-deep/25">
                <Flame className="h-3.5 w-3.5 text-rose-deep fill-rose-deep" />
                <span>Hot Deal Price Applied</span>
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Specifications */}
          {(product.fabric || product.work) && (
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-border text-xs">
              {product.fabric && (
                <div className="p-3.5 rounded-2xl bg-background border border-border">
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-deep block">Fabric</span>
                  <span className="font-bold text-foreground mt-0.5 block">{product.fabric}</span>
                </div>
              )}
              {product.work && (
                <div className="p-3.5 rounded-2xl bg-background border border-border">
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-deep block">Work Type</span>
                  <span className="font-bold text-foreground mt-0.5 block">{product.work}</span>
                </div>
              )}
            </div>
          )}

          {/* Variant Selection */}
          {product.variants?.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-rose-deep block flex items-center justify-between">
                <span>Select Size & Colour</span>
                <span className="text-foreground font-bold">
                  {selectedVariant?.size} / {selectedVariant?.colourName}
                </span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v: any, i: number) => {
                  const isSelected =
                    selectedVariant?.size === v.size && selectedVariant?.colourName === v.colourName;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2.5 rounded-2xl text-xs border transition-all flex items-center gap-2 font-bold ${
                        isSelected
                          ? "border-rose-deep bg-secondary text-rose-deep ring-2 ring-rose-deep/20 shadow-xs"
                          : "border-border bg-card text-muted-foreground hover:border-rose-deep/40 hover:text-foreground"
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-border shadow-xs"
                        style={{ backgroundColor: v.colourHex || "#FF2A85" }}
                      />
                      {v.size} — {v.colourName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            className="w-full py-4 bg-primary text-primary-foreground rounded-full text-xs font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-card"
          >
            {added ? (
              <>
                <Check className="h-4 w-4" /> Added to Bag
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 fill-rose-soft text-rose-soft animate-pulse" /> Claim Drop — ₹{effectivePrice}
              </>
            )}
          </button>

          {/* Value Props */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border text-center">
            <div className="p-3.5 bg-card rounded-2xl border border-border">
              <Truck className="h-4 w-4 mx-auto mb-1 text-rose-deep" />
              <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">Free Express</span>
            </div>
            <div className="p-3.5 bg-card rounded-2xl border border-border">
              <RotateCcw className="h-4 w-4 mx-auto mb-1 text-primary" />
              <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">7-Day Returns</span>
            </div>
            <div className="p-3.5 bg-card rounded-2xl border border-border">
              <ShieldCheck className="h-4 w-4 mx-auto mb-1 text-primary" />
              <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">100% Authentic</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}