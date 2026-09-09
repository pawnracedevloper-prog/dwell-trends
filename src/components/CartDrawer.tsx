import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, X, Sparkles, ArrowRight } from "lucide-react";
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
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-card border-l border-border/80 text-foreground shadow-2xl overflow-hidden">
        {/* Soft Pink Ambient Glow Orbs */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-rose-deep/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-rose-soft/20 blur-3xl" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-border/70 px-5 py-4 bg-background/50 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-secondary text-rose-deep border border-rose-deep/20 glam-glow">
              <ShoppingBag className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="font-display text-sm font-black uppercase tracking-wider text-foreground">
                Your Bag ({cart.reduce((n, c) => n + c.qty, 0)})
              </h2>
              <p className="text-[10px] text-muted-foreground font-medium">Curated drop items</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-rose-deep hover:bg-secondary rounded-xl transition-all border border-transparent hover:border-border/60"
            aria-label="Close cart"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="relative z-10 flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="p-4 rounded-3xl bg-secondary/60 text-rose-deep border border-rose-deep/20 glam-glow">
                <ShoppingBag className="h-10 w-10 stroke-[1.5]" />
              </div>
              <p className="font-display text-base font-black text-foreground">Your bag is empty</p>
              <p className="text-xs text-muted-foreground max-w-[220px]">
                Explore our collection to add your favourite statement styles.
              </p>
              <button
                onClick={onClose}
                className="mt-4 rounded-full bg-primary px-7 py-3 text-xs font-black uppercase tracking-widest text-primary-foreground hover:opacity-90 active:scale-95 transition-all shadow-card flex items-center gap-2"
              >
                <span>Start Shopping</span>
                <ArrowRight className="h-3.5 w-3.5" />
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
                  <li key={key} className="flex gap-4 py-4.5 first:pt-1">
                    <img
                      src={image}
                      alt={name}
                      className="h-24 w-20 rounded-2xl object-cover bg-background border border-border/80 shrink-0 shadow-xs"
                    />
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="line-clamp-1 text-xs font-bold text-foreground hover:text-rose-deep transition-colors">
                            {name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(key)}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-1 rounded-lg transition-colors shrink-0"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                          Size: <span className="font-bold text-rose-deep">{item.size}</span> · Colour:{" "}
                          <span className="font-bold text-rose-deep">{item.colour}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center rounded-xl border border-border/80 bg-background/80 p-0.5 shadow-xs">
                          <button
                            onClick={() => setQty(key, item.qty - 1)}
                            className="p-1.5 text-muted-foreground hover:text-rose-deep hover:bg-secondary rounded-lg transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-black text-foreground">{item.qty}</span>
                          <button
                            onClick={() => setQty(key, item.qty + 1)}
                            className="p-1.5 text-muted-foreground hover:text-rose-deep hover:bg-secondary rounded-lg transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-primary">{inr(price * item.qty)}</p>
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
          <div className="relative z-10 border-t border-border/80 bg-background/70 backdrop-blur-md p-5 space-y-3.5 shadow-lg">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Total MRP</span>
                <span className="font-medium text-foreground">{inr(mrp)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-rose-deep font-bold">
                  <span>Discount</span>
                  <span>-{inr(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground items-center">
                <span>Delivery Charges</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-rose-deep font-bold bg-secondary px-2 py-0.5 rounded-md text-[10px] border border-rose-deep/20">
                      FREE
                    </span>
                  ) : (
                    inr(shipping)
                  )}
                </span>
              </div>
              <div className="flex justify-between border-t border-border/70 pt-2.5 text-sm font-black text-foreground">
                <span className="uppercase tracking-wider">Total Amount</span>
                <span className="text-primary text-base font-black">{inr(total)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-xs font-black uppercase tracking-widest text-primary-foreground shadow-card hover:opacity-90 active:scale-95 transition-all"
            >
              <Sparkles className="h-4 w-4 fill-rose-soft text-rose-soft animate-pulse" />
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}