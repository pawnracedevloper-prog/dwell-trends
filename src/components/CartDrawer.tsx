import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useShop, cartTotals, itemKey } from "@/lib/store";
import { PRODUCTS, inr } from "@/lib/products";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, setQty, removeFromCart } = useShop();

  if (!open) return null;

  // Compute totals safely supporting both dynamic backend products & static mock fallback
  const calculatedTotals = () => {
    try {
      const totals = cartTotals(cart);
      if (totals && totals.total > 0) return totals;
    } catch {
      // Fallback manual calculation if cartTotals relies on static list
    }

    const mrp = cart.reduce(
      (acc, item) =>
        acc +
        (item.productDetails?.mrp ||
          item.mrp ||
          PRODUCTS.find((p) => p.id === item.id)?.mrp ||
          item.productDetails?.price ||
          item.price ||
          0) *
          item.qty,
      0
    );

    const totalItemPrice = cart.reduce(
      (acc, item) =>
        acc +
        (item.productDetails?.price ||
          item.price ||
          PRODUCTS.find((p) => p.id === item.id)?.price ||
          0) *
          item.qty,
      0
    );

    const discount = mrp > totalItemPrice ? mrp - totalItemPrice : 0;
    const shipping = totalItemPrice > 0 && totalItemPrice < 999 ? 79 : 0;
    const total = totalItemPrice + shipping;

    return { mrp, discount, shipping, total };
  };

  const { total, shipping, discount, mrp } = calculatedTotals();

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="font-display text-base font-bold">
              Your Bag ({cart.reduce((n, c) => n + c.qty, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:bg-accent rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/30 stroke-1" />
              <p className="mt-4 font-display text-base font-semibold">Your bag is empty</p>
              <p className="text-xs text-muted-foreground mt-1">
                Explore our collection to add your favourite styles.
              </p>
              <button
                onClick={onClose}
                className="mt-6 rounded-full bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:opacity-95 transition-opacity"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {cart.map((item) => {
                const staticProduct = PRODUCTS?.find((p) => p.id === (item.id || item.productId));
                const name = item.productDetails?.name || item.name || staticProduct?.name || "Product";
                const price =
                  item.productDetails?.price || item.price || staticProduct?.price || 0;
                const image =
                  item.productDetails?.images?.[0]?.url ||
                  item.image ||
                  staticProduct?.images?.[0] ||
                  "";
                const key = itemKey ? itemKey(item) : `${item.id || item.productId}__${item.size}__${item.colour}`;

                return (
                  <li key={key} className="flex gap-4 py-4">
                    <img
                      src={image}
                      alt={name}
                      className="h-24 w-20 rounded-lg object-cover bg-secondary border border-border shrink-0"
                    />
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between gap-2">
                          <h4 className="line-clamp-1 text-xs font-bold text-foreground">{name}</h4>
                          <button
                            onClick={() => removeFromCart(key)}
                            className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Size: <span className="font-semibold text-foreground">{item.size}</span> | Colour:{" "}
                          <span className="font-semibold text-foreground">{item.colour}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center rounded-lg border border-border bg-background">
                          <button
                            onClick={() => setQty(key, item.qty - 1)}
                            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold">{item.qty}</span>
                          <button
                            onClick={() => setQty(key, item.qty + 1)}
                            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-primary">{inr(price * item.qty)}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div className="border-t border-border bg-secondary/20 p-5 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Total MRP</span>
                <span>{inr(mrp)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-700 font-medium">
                  <span>Discount</span>
                  <span>-{inr(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-700 font-semibold">FREE</span> : inr(shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-border/70 pt-2 text-sm font-bold text-foreground">
                <span>Total</span>
                <span className="text-primary text-base">{inr(total)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              onClick={onClose}
              className="flex w-full items-center justify-center rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-md transition-opacity hover:opacity-95"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}