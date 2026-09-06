import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useShop, cartTotals, itemKey } from "@/lib/store";
import { PRODUCTS, inr } from "@/lib/products";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, setQty, removeFromCart } = useShop();
  const { total, shipping, discount, mrp } = cartTotals(cart);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="font-medium">Your Bag</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-muted-foreground hover:bg-accent rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
              <p className="mt-4 font-medium">Your bag is empty</p>
              <button
                onClick={onClose}
                className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {cart.map((item) => {
                const product = PRODUCTS.find((p) => p.id === item.id);
                if (!product) return null;
                const key = itemKey(item);

                return (
                  <li key={key} className="flex gap-4 py-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-24 w-20 rounded-lg object-cover bg-muted"
                    />
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between gap-2">
                          <h4 className="line-clamp-1 text-sm font-medium">{product.name}</h4>
                          <button
                            onClick={() => removeFromCart(key)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Size: {item.size} | Color: {item.colour}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center rounded-md border border-border">
                          <button
                            onClick={() => setQty(key, item.qty - 1)}
                            className="p-1.5 text-muted-foreground hover:text-foreground"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold">{item.qty}</span>
                          <button
                            onClick={() => setQty(key, item.qty + 1)}
                            className="p-1.5 text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{inr(product.price * item.qty)}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-border bg-secondary/20 p-5 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Total MRP</span>
                <span className="line-through">{inr(mrp)}</span>
              </div>
              <div className="flex justify-between text-success">
                <span>Discount</span>
                <span>-{inr(discount)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : inr(shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-border/70 pt-2 text-base font-bold text-foreground">
                <span>Total</span>
                <span>{inr(total)}</span>
              </div>
            </div>
            
            <Link
              to="/checkout"
              onClick={onClose}
              className="flex w-full items-center justify-center rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-95"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}