import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { type Product, inr, discountPercent } from "@/lib/products";
import { useShop } from "@/lib/store";

export function ProductCard({ product }: { product: Product }) {
  const { wishlist, toggleWishlist } = useShop();
  const isWished = wishlist.includes(product.id);

  return (
    <Link
      to="/product/$productId"
      params={{ productId: product.id }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.isNew && (
          <span className="absolute left-2.5 top-2.5 rounded bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
            New
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-card/90 backdrop-blur transition-colors hover:bg-card"
        >
          <Heart className={`h-4 w-4 ${isWished ? "fill-rose-deep text-rose-deep" : "text-muted-foreground"}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>{product.brand}</span>
          <div className="flex gap-0.5">
            {product.colours.map((c) => (
              <span
                key={c.name}
                className="h-2.5 w-2.5 rounded-full border border-black/10 shadow-sm"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        <h3 className="line-clamp-2 text-sm font-medium leading-tight text-foreground sm:text-base">
          {product.name}
        </h3>

        <div className="mt-auto pt-3">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-sm font-bold sm:text-base">{inr(product.price)}</span>
            <span className="text-xs text-muted-foreground line-through">{inr(product.mrp)}</span>
            <span className="text-[10px] font-semibold text-rose-deep sm:text-xs">
              {discountPercent(product)}% OFF
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}