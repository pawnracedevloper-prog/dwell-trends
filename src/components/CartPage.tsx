import { useShop } from "@/lib/store";
import { Link } from "@tanstack/react-router";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export function CartPage() {
  const { cart, setQty, removeFromCart } = useShop();

  const subtotal = cart.reduce((acc, item) => acc + (item.productDetails?.price || 0) * item.qty, 0);
  const shipping = subtotal > 0 && subtotal < 999 ? 79 : 0;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="container-page py-28 text-center space-y-4">
        <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto stroke-1" />
        <h1 className="font-display text-2xl font-bold">Your cart is empty</h1>
        <p className="text-xs text-muted-foreground">Explore our collection and add your favorite ethnic pieces.</p>
        <Link to="/products" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-full text-xs font-semibold uppercase tracking-wider mt-2">
          Shop Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-8 space-y-4">
        <h1 className="font-display text-2xl font-bold mb-6">Shopping Cart ({cart.reduce((a, c) => a + c.qty, 0)})</h1>
        <div className="divide-y divide-border border-t border-b border-border">
          {cart.map((item, idx) => (
            <div key={idx} className="py-4 flex gap-4 items-center">
              <div className="w-16 h-20 bg-secondary/20 rounded-lg overflow-hidden shrink-0">
                <img src={item.productDetails?.images?.[0]?.url} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-sm font-semibold truncate">{item.productDetails?.name || "Product"}</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">Size: {item.size} · Colour: {item.colour}</p>
                <p className="text-xs font-bold text-primary mt-1">₹{item.productDetails?.price || 0}</p>
              </div>
              <div className="flex items-center gap-2 border border-border rounded-lg px-2 py-1">
                <button onClick={() => setQty(`${item.id}__${item.size}__${item.colour}`, item.qty - 1)} className="text-xs px-1 font-bold">-</button>
                <span className="text-xs w-4 text-center">{item.qty}</span>
                <button onClick={() => setQty(`${item.id}__${item.size}__${item.colour}`, item.qty + 1)} className="text-xs px-1 font-bold">+</button>
              </div>
              <button onClick={() => removeFromCart(`${item.id}__${item.size}__${item.colour}`)} className="text-muted-foreground hover:text-destructive p-2">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-4 bg-card border border-border p-6 rounded-2xl h-fit space-y-4">
        <h3 className="font-display text-lg font-bold">Price Details</h3>
        <div className="space-y-2 text-xs border-b border-border pb-4">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
        </div>
        <div className="flex justify-between font-bold text-sm"><span>Total</span><span className="text-primary">₹{total}</span></div>
        <Link to="/checkout" className="w-full py-3.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95">
          Proceed to Checkout <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}