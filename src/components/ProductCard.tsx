import { Link } from "@tanstack/react-router";
import { Heart, Flame, Zap, Sparkles } from "lucide-react";
import { inr } from "@/lib/products";
import { useShop } from "@/lib/store";

export function ProductCard({ product }: { product: any }) {
  const { wishlist, toggleWishlist } = useShop();
  
  const targetId = product._id || product.id;
  const isWished = wishlist?.includes(targetId);

  // Deal price & discount calculations
  const isDealActive = product.dealType && product.dealType !== "None" && product.dealPrice;
  const effectivePrice = isDealActive ? Number(product.dealPrice) : Number(product.price || 0);
  const originalMrp = Number(product.mrp || product.price || 0);
  const discount = originalMrp > effectivePrice
    ? Math.round(((originalMrp - effectivePrice) / originalMrp) * 100)
    : 0;

  // Safe image extraction
  const imageUrl =
    typeof product.images?.[0] === "string"
      ? product.images[0]
      : product.images?.[0]?.url || "";

  // Safe color/variant extraction
  const colours = product.colours || product.variants?.map((v: any) => ({
    name: v.colourName || v.name,
    hex: v.colourHex || v.hex || "#FF2A85",
  })) || [];

  return (
    <Link
      to="/product/$productId"
      params={{ productId: targetId }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-[#14171e]/90 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_10px_30px_rgba(255,42,135,0.22)]"
    >
      {/* Image & Badges */}
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary/40">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Top Deal Badges */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5 z-10">
          {product.dealType === "Wow" && (
            <span className="flex items-center gap-1 rounded-full border border-primary/40 bg-[#0d0f14]/85 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-rose-soft backdrop-blur-md shadow-md glam-glow">
              <Zap className="h-3 w-3 fill-primary text-primary" /> WOW DEAL
            </span>
          )}

          {product.dealType === "Hot" && (
            <span className="flex items-center gap-1 rounded-full border border-rose-deep/40 bg-rose-deep/80 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md shadow-md">
              <Flame className="h-3 w-3 fill-white text-white" /> HOT DEAL
            </span>
          )}

          {(product.isNew || product.isNewItem) && product.dealType !== "Wow" && product.dealType !== "Hot" && (
            <span className="rounded-full border border-primary/40 bg-primary/20 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-rose-soft backdrop-blur-md glam-glow">
              ✦ New Drop
            </span>
          )}
        </div>

        {/* Wishlist Floating Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(targetId);
          }}
          className="absolute right-2.5 top-2.5 z-10 grid h-8 w-8 place-items-center rounded-full bg-[#0d0f14]/80 backdrop-blur-md border border-primary/30 shadow-md transition-all hover:scale-110 hover:border-primary"
          aria-label="Wishlist"
        >
          <Heart className={`h-4 w-4 transition-colors ${isWished ? "fill-primary text-primary" : "text-rose-soft"}`} />
        </button>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span className="text-[10px] font-bold uppercase tracking-widest text-rose-soft/80 truncate">
            {product.brand || "Dwell Trends"}
          </span>

          {colours.length > 0 && (
            <div className="flex gap-1 shrink-0 ml-1">
              {colours.slice(0, 4).map((c: any, i: number) => (
                <span
                  key={i}
                  className="h-2.5 w-2.5 rounded-full border border-white/20 shadow-xs"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>

        <h3 className="line-clamp-1 font-display text-sm font-semibold text-foreground transition-colors group-hover:text-primary sm:text-base">
          {product.name}
        </h3>

        {/* Pricing Block */}
        <div className="mt-auto pt-3 space-y-0.5">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-sm font-black text-primary sm:text-base">
              {inr ? inr(effectivePrice) : `₹${effectivePrice}`}
            </span>

            {originalMrp > effectivePrice && (
              <span className="text-xs text-muted-foreground line-through font-semibold">
                {inr ? inr(originalMrp) : `₹${originalMrp}`}
              </span>
            )}

            {discount > 0 && (
              <span className="text-[10px] font-black text-rose-soft bg-primary/10 border border-primary/20 px-1.5 py-0.2 rounded-md sm:text-[11px]">
                {discount}% OFF
              </span>
            )}
          </div>

          {product.dealType === "Hot" && (
            <p className="text-[10px] font-bold text-rose-soft/90 flex items-center gap-1">
              <span>✦</span> Hot Deal Applied
            </p>
          )}
          {product.dealType === "Wow" && (
            <p className="text-[10px] font-bold text-primary flex items-center gap-1">
              <span>✦</span> Special Offer Applied
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}