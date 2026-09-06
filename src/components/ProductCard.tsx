import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { discountPercent, inr, type Product } from "@/lib/products";
import { useShop } from "@/lib/store";
import { RatingPill } from "./Rating";

export function ProductCard({ product }: { product: Product }) {
  const { wishlist, toggleWishlist } = useShop();
  const wished = wishlist.includes(product.id);

  return (
    <Link
      to="/product/$productId"
      params={{ productId: product.id }}
      className="group relative block overflow-hidden rounded-xl border border-border/70 bg-card shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          width={800}
          height={1067}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.isNew && (
          <span className="eyebrow absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-primary-foreground">
            New
          </span>
        )}
        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-card/90 backdrop-blur transition-colors hover:bg-card"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${wished ? "fill-rose-deep text-rose-deep" : "text-muted-foreground"}`}
          />
        </button>
      </div>

      <div className="space-y-1.5 p-3.5 sm:p-4">
        <p className="eyebrow text-muted-foreground">{product.fabric}</p>
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground sm:text-[0.95rem]">
          {product.name}
        </h3>
        <RatingPill rating={product.rating} count={product.ratingCount} />
        <div className="flex flex-wrap items-baseline gap-2 pt-0.5">
          <span className="text-base font-semibold text-foreground">{inr(product.price)}</span>
          <span className="text-xs text-muted-foreground line-through">{inr(product.mrp)}</span>
          <span className="text-xs font-semibold text-sale">{discountPercent(product)}% off</span>
        </div>
      </div>
    </Link>
  );
}
