import { useState } from "react";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { Product } from "@/lib/products";
import { useShop } from "@/lib/store";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export function AddToCartBar({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const { addToCart, wishlist, toggleWishlist } = useShop();
  const wished = wishlist.includes(product.id);

  function handleAdd() {
    if (!selectedSize) {
      setError("Please select a size first");
      return;
    }
    setError(null);
    addToCart(product, selectedSize, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-4 pt-2">
      <div>
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-foreground">Select Size</span>
          <button type="button" className="text-rose-deep underline hover:text-rose-deep/80">
            Size Chart
          </button>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => {
                setSelectedSize(size);
                setError(null);
              }}
              className={`grid h-10 w-12 place-items-center rounded-lg border text-xs font-semibold uppercase transition-all ${
                selectedSize === size
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-foreground hover:border-primary/50"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={handleAdd}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-95"
        >
          {added ? (
            <>
              <Check className="h-4 w-4" /> Added to Bag
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" /> Add to Bag
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label="Save to wishlist"
          className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card transition-colors hover:bg-accent"
        >
          <Heart className={`h-5 w-5 ${wished ? "fill-rose-deep text-rose-deep" : "text-foreground"}`} />
        </button>
      </div>
    </div>
  );
}