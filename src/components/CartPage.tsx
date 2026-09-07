import { useShop } from "@/lib/store";
import { Link } from "@tanstack/react-router";
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from "lucide-react";

export function CartPage() {
  const { cart, setQty, removeFromCart } = useShop();

  const totalMrp = cart.reduce(
    (acc, item) =>
      acc + (item.productDetails?.mrp || item.productDetails?.price || 0) * item.qty,
    0
  );
  const subtotal = cart.reduce(
    (acc, item) => acc + (item.productDetails?.price || 0) * item.qty,
    0
  );
  const discount = totalMrp > subtotal ? totalMrp - subtotal : 0;
  const shipping = subtotal > 0 && subtotal < 999 ? 79 : 0;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="container-page py-28 text-center space-y-4">
        <div className="h-20 w-20 bg-secondary/50 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
          <ShoppingBag className="h-10 w-10 stroke-1" />
        </div>
        <h1 className="font-display text-2xl font-bold">Your cart is empty</h1>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Explore Dwell Trends to discover modern collections and timeless wardrobe essentials.
        </p>
        <Link
          to="/products"
          className="inline-block px-7 py-3 bg-primary text-primary-foreground rounded-full text-xs font-semibold uppercase tracking-wider mt-2 hover:opacity-95 transition-opacity"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Items List */}
      <div className="lg:col-span-8 space-y-4">
        <div className="flex items-baseline justify-between mb-4">
          <h1 className="font-display text-2xl font-bold">
            Shopping Cart ({cart.reduce((a, c) => a + c.qty, 0)})
          </h1>
          {shipping === 0 && (
            <span className="text-[11px] font-semibold text-green-700 bg-green-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Truck className="h-3 w-3" /> Free Delivery Applied
            </span>
          )}
        </div>

        <div className="divide-y divide-border border-t border-b border-border">
          {cart.map((item, idx) => {
            const itemKey = `${item.id || item.productId || item.productDetails?._id}__${item.size || item.selectedSize}__${item.colour || item.selectedColour}`;
            const itemPrice = item.productDetails?.price || item.price || 0;
            const itemMrp = item.productDetails?.mrp || item.mrp || 0;

            return (
              <div key={idx} className="py-4 flex gap-4 items-center">
                <div className="w-20 h-24 bg-secondary/20 rounded-xl overflow-hidden shrink-0 border border-border">
                  <img
                    src={item.productDetails?.images?.[0]?.url || item.image}
                    alt={item.productDetails?.name || "Product"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-sm font-semibold truncate text-foreground">
                    {item.productDetails?.name || item.name || "Product"}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Size: <span className="font-medium text-foreground">{item.size || item.selectedSize}</span> · Colour:{" "}
                    <span className="font-medium text-foreground">{item.colour || item.selectedColour}</span>
                  </p>
                  
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-xs font-bold text-primary">₹{itemPrice}</span>
                    {itemMrp > itemPrice && (
                      <span className="text-[11px] text-muted-foreground line-through">₹{itemMrp}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 border border-border rounded-xl px-2.5 py-1 bg-background">
                  <button
                    type="button"
                    onClick={() => setQty(itemKey, item.qty - 1)}
                    className="text-xs px-1 font-bold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    -
                  </button>
                  <span className="text-xs w-4 text-center font-semibold">{item.qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(itemKey, item.qty + 1)}
                    className="text-xs px-1 font-bold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(itemKey)}
                  aria-label="Remove item"
                  className="text-muted-foreground hover:text-destructive p-2 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Summary Card */}
      <div className="lg:col-span-4 bg-card border border-border p-6 rounded-2xl h-fit space-y-4 shadow-sm">
        <h3 className="font-display text-base font-bold uppercase tracking-wider text-xs text-muted-foreground">
          Price Details
        </h3>
        
        <div className="space-y-3 text-xs border-b border-border pb-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total MRP</span>
            <span>₹{totalMrp}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-green-700 font-medium">
              <span>Discount on MRP</span>
              <span>-₹{discount}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Charges</span>
            <span>{shipping === 0 ? <span className="text-green-700 font-semibold">FREE</span> : `₹${shipping}`}</span>
          </div>
        </div>

        <div className="flex justify-between font-bold text-sm">
          <span>Total Amount</span>
          <span className="text-primary text-base">₹{total}</span>
        </div>

        <Link
          to="/checkout"
          className="w-full py-3.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-md"
        >
          Proceed to Checkout <ArrowRight className="h-4 w-4" />
        </Link>

        <div className="pt-2 text-[11px] text-muted-foreground flex items-center gap-1.5 justify-center">
          <ShieldCheck className="h-4 w-4 text-green-600 shrink-0" />
          <span>Safe and Secure Checkout</span>
        </div>
      </div>
    </div>
  );
}