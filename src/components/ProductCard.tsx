import { Link } from "@tanstack/react-router";
import { Heart, Flame, Zap } from "lucide-react";
import { inr } from "@/lib/products";
import { useShop } from "@/lib/store";

export function ProductCard({ product }: { product: any }) {
  const { wishlist, toggleWishlist } = useShop();
  
  const targetId = product._id || product.id;
  const isWished = wishlist.includes(targetId);

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
    hex: v.colourHex || v.hex || "#000",
  })) || [];

  return (
    <Link
      to="/product/$productId"
      params={{ productId: targetId }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Image & Badges */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5 z-10">
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

          {(product.isNew || product.isNewItem) && product.dealType !== "Wow" && product.dealType !== "Hot" && (
            <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(targetId);
          }}
          className="absolute right-2.5 top-2.5 z-10 grid h-8 w-8 place-items-center rounded-full bg-card/90 backdrop-blur transition-colors hover:bg-card shadow-sm"
        >
          <Heart className={`h-4 w-4 ${isWished ? "fill-rose-600 text-rose-600" : "text-muted-foreground"}`} />
        </button>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-semibold uppercase text-[10px] tracking-wider">
            {product.brand || "Dwell Trends"}
          </span>

          {colours.length > 0 && (
            <div className="flex gap-1">
              {colours.slice(0, 4).map((c: any, i: number) => (
                <span
                  key={i}
                  className="h-2.5 w-2.5 rounded-full border border-black/10 shadow-xs"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>

        <h3 className="line-clamp-1 text-sm font-medium leading-tight text-foreground sm:text-base">
          {product.name}
        </h3>

        {/* Pricing Block */}
        <div className="mt-auto pt-3 space-y-0.5">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-sm font-bold text-foreground sm:text-base">
              {inr ? inr(effectivePrice) : `₹${effectivePrice}`}
            </span>

            {originalMrp > effectivePrice && (
              <span className="text-xs text-muted-foreground line-through">
                {inr ? inr(originalMrp) : `₹${originalMrp}`}
              </span>
            )}

            {discount > 0 && (
              <span className="text-[10px] font-bold text-green-700 sm:text-xs">
                {discount}% OFF
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
      </div>
    </Link>
  );
}