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
      <div className="text-center py-28 text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
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
          <div className="aspect-[3/4] bg-[#14171e]/90 rounded-3xl overflow-hidden border border-border/80 relative shadow-2xl backdrop-blur-md group">
            <img
              src={activeImage || product.images?.[0]?.url || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Wishlist Floating Button */}
            <button
              type="button"
              onClick={() => toggleWishlist?.(product._id)}
              className="absolute top-4 right-4 p-3 rounded-2xl bg-[#0d0f14]/80 backdrop-blur-md border border-primary/30 text-foreground hover:text-primary transition-all hover:scale-110 shadow-lg"
              aria-label="Wishlist"
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? "fill-primary text-primary" : "text-rose-soft"}`} />
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
                        ? "border-primary ring-2 ring-primary/40 glam-glow scale-105"
                        : "border-border/80 opacity-60 hover:opacity-100 hover:border-primary/40"
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-[10px] font-black uppercase tracking-widest text-rose-soft mb-2 glam-glow">
              <span>✦</span> {product.brand || "Dwell Trends"} • {product.mainCategory || "Collection"} / {product.subCategory || product.category}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black mt-1 text-foreground leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Pricing & Deal Badges */}
          <div className="space-y-3 p-5 rounded-3xl bg-[#14171e]/90 border border-border/80 backdrop-blur-md shadow-xl">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-primary">₹{effectivePrice}</span>
              {originalMrp > effectivePrice && (
                <span className="text-base text-muted-foreground line-through font-semibold">₹{originalMrp}</span>
              )}
              {discountPercent > 0 && (
                <span className="bg-primary/20 text-rose-soft border border-primary/40 text-xs px-3 py-1 rounded-full font-black tracking-wider uppercase glam-glow">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* WOW Deal Banner */}
            {product.dealType === "Wow" && (
              <div className="rounded-2xl bg-gradient-to-r from-primary via-rose-deep to-primary p-4 text-white shadow-lg glam-glow border border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-white text-black text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                      WOW DEAL
                    </span>
                    <span className="text-sm font-black">Buy at ₹{product.dealPrice}</span>
                  </div>
                  <Zap className="h-4 w-4 fill-white text-white animate-pulse" />
                </div>
                <p className="text-[11px] text-white/90 mt-1 font-medium">
                  Special flash promotion applied! Grab it before stock runs out.
                </p>
              </div>
            )}

            {/* Hot Deal Tag */}
            {product.dealType === "Hot" && (
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-rose-soft bg-primary/15 px-3.5 py-1.5 rounded-full border border-primary/40 glam-glow">
                <Flame className="h-3.5 w-3.5 text-primary fill-primary" />
                <span>Hot Deal Price Applied</span>
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Specifications */}
          {(product.fabric || product.work) && (
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/80 text-xs">
              {product.fabric && (
                <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border/60">
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-soft block">Fabric</span>
                  <span className="font-bold text-foreground mt-0.5 block">{product.fabric}</span>
                </div>
              )}
              {product.work && (
                <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border/60">
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-soft block">Work Type</span>
                  <span className="font-bold text-foreground mt-0.5 block">{product.work}</span>
                </div>
              )}
            </div>
          )}

          {/* Variant Selection */}
          {product.variants?.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-rose-soft block flex items-center justify-between">
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
                          ? "border-primary bg-primary/20 text-rose-soft glam-glow ring-2 ring-primary/40"
                          : "border-border/80 bg-secondary/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-white/20 shadow-xs"
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
            className="w-full py-4 bg-primary text-white rounded-full text-xs font-black uppercase tracking-widest hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 glam-glow shadow-xl"
          >
            {added ? (
              <>
                <Check className="h-4 w-4" /> Added to Bag
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Claim Drop — ₹{effectivePrice}
              </>
            )}
          </button>

          {/* Value Props */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/80 text-center">
            <div className="p-3.5 bg-secondary/30 rounded-2xl border border-border/60">
              <Truck className="h-4 w-4 mx-auto mb-1 text-primary" />
              <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">Free Express</span>
            </div>
            <div className="p-3.5 bg-secondary/30 rounded-2xl border border-border/60">
              <RotateCcw className="h-4 w-4 mx-auto mb-1 text-primary" />
              <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">7-Day Returns</span>
            </div>
            <div className="p-3.5 bg-secondary/30 rounded-2xl border border-border/60">
              <ShieldCheck className="h-4 w-4 mx-auto mb-1 text-primary" />
              <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">100% Authentic</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}