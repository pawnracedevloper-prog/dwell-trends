import { useShop } from "@/lib/store";
import { Link } from "@tanstack/react-router";
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, Sparkles, Minus, Plus } from "lucide-react";

export function CartPage() {
  const { cart, setQty, removeFromCart } = useShop();

  const totalMrp = cart.reduce(
    (acc, item) =>
      acc + (item.productDetails?.mrp || item.mrp || item.productDetails?.price || item.price || 0) * item.qty,
    0
  );
  const subtotal = cart.reduce(
    (acc, item) => acc + (item.productDetails?.price || item.price || 0) * item.qty,
    0
  );
  const discount = totalMrp > subtotal ? totalMrp - subtotal : 0;
  const shipping = subtotal > 0 && subtotal < 999 ? 79 : 0;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="container-page py-28 text-center space-y-4 text-foreground">
        <div className="h-20 w-20 bg-secondary rounded-full flex items-center justify-center mx-auto text-rose-deep border border-rose-deep/20 glam-glow">
          <ShoppingBag className="h-9 w-9 stroke-[1.5]" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black glam-gradient-text">
          Your cart is empty
        </h1>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto font-medium">
          Explore Dwell Trends to discover modern collections and exclusive statement drops.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-full text-xs font-black uppercase tracking-widest mt-2 hover:opacity-90 active:scale-95 transition-all shadow-card"
        >
          <span>Explore Collection</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 text-foreground min-h-[75vh]">
      {/* Items List */}
      <div className="lg:col-span-8 space-y-4">
        <div className="flex items-baseline justify-between mb-4 border-b border-border/70 pb-4">
          <h1 className="font-display text-2xl font-black tracking-tight flex items-center gap-2">
            <span>Shopping Bag</span>
            <span className="text-xs font-bold text-muted-foreground">
              ({cart.reduce((a, c) => a + c.qty, 0)} items)
            </span>
          </h1>
          {shipping === 0 && (
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-deep bg-secondary px-3 py-1 rounded-full border border-rose-deep/25 flex items-center gap-1.5 shadow-xs">
              <Truck className="h-3 w-3" /> Free Delivery Applied
            </span>
          )}
        </div>

        <div className="divide-y divide-border/70 border-t border-b border-border/70">
          {cart.map((item, idx) => {
            const itemKey = `${item.id || item.productId || item.productDetails?._id}__${item.size || item.selectedSize}__${item.colour || item.selectedColour}`;
            const itemPrice = item.productDetails?.price || item.price || 0;
            const itemMrp = item.productDetails?.mrp || item.mrp || 0;

            return (
              <div key={idx} className="py-4.5 flex gap-4 items-center">
                <div className="w-20 h-24 bg-background rounded-2xl overflow-hidden shrink-0 border border-border/80 shadow-xs">
                  <img
                    src={item.productDetails?.images?.[0]?.url || item.image}
                    alt={item.productDetails?.name || "Product"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-display text-sm font-bold truncate text-foreground hover:text-rose-deep transition-colors">
                    {item.productDetails?.name || item.name || "Product"}
                  </h3>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    Size: <span className="font-bold text-rose-deep">{item.size || item.selectedSize}</span> · Colour:{" "}
                    <span className="font-bold text-rose-deep">{item.colour || item.selectedColour}</span>
                  </p>
                  
                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="text-xs font-black text-primary">₹{itemPrice}</span>
                    {itemMrp > itemPrice && (
                      <span className="text-[11px] text-muted-foreground line-through font-semibold">₹{itemMrp}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 border border-border/80 rounded-xl px-2 py-1 bg-background shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQty(itemKey, item.qty - 1)}
                    className="p-1 text-muted-foreground hover:text-rose-deep hover:bg-secondary rounded-lg transition-colors"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-xs w-6 text-center font-black text-foreground">{item.qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(itemKey, item.qty + 1)}
                    className="p-1 text-muted-foreground hover:text-rose-deep hover:bg-secondary rounded-lg transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(itemKey)}
                  aria-label="Remove item"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-2 rounded-xl transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Summary Card */}
      <div className="lg:col-span-4 bg-card border border-border/80 p-6 rounded-3xl h-fit space-y-4 shadow-card relative overflow-hidden backdrop-blur-md">
        {/* Soft Pink Ambient Glow */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-rose-deep/10 blur-3xl" />

        <h3 className="font-display text-xs font-black uppercase tracking-widest text-rose-deep flex items-center gap-1.5">
          <span>✦</span> Order Price Details
        </h3>
        
        <div className="space-y-3 text-xs border-b border-border/70 pb-4">
          <div className="flex justify-between text-muted-foreground">
            <span>Total MRP</span>
            <span className="font-semibold text-foreground">₹{totalMrp}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-rose-deep font-bold">
              <span>Discount on MRP</span>
              <span>-₹{discount}</span>
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
                `₹${shipping}`
              )}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-baseline font-black text-sm pt-1">
          <span className="uppercase tracking-wider">Total Amount</span>
          <span className="text-primary text-lg font-black">₹{total}</span>
        </div>

        <Link
          to="/checkout"
          className="w-full py-3.5 bg-primary text-primary-foreground rounded-full text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-card"
        >
          <Sparkles className="h-4 w-4 fill-rose-soft text-rose-soft animate-pulse" />
          <span>Proceed to Checkout</span>
          <ArrowRight className="h-4 w-4" />
        </Link>

        <div className="pt-2 text-[11px] text-muted-foreground flex items-center gap-1.5 justify-center font-medium">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Safe & Verified Encrypted Checkout</span>
        </div>
      </div>
    </div>
  );
}