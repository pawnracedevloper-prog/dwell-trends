import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, CreditCard, ShieldCheck, Truck, Wallet, ShoppingBag } from "lucide-react";
import { useShop, cartTotals } from "@/lib/store";
import { inr, PRODUCTS } from "@/lib/products";

export function CheckoutPage() {
  const { cart, placeOrder } = useShop();
  const { total, shipping, discount, mrp } = cartTotals(cart);
  
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cod">("upi");
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const order = placeOrder(total);
    setPlacedOrder(order);
  }

  // Success State
  if (placedOrder) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-success/10 text-success mb-6">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl">Order Confirmed!</h1>
        <p className="mt-3 text-muted-foreground max-w-md">
          Thank you for shopping with Saanvi Fashion. Your order <strong>#{placedOrder.id}</strong> has been placed successfully.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            to="/profile"
            className="rounded-full border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
          >
            View Order
          </Link>
          <Link
            to="/products"
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Empty Cart State
  if (cart.length === 0) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center py-12 text-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
        <p className="mt-4 text-lg font-medium">Your bag is empty.</p>
        <Link
          to="/products"
          className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-8 sm:py-12">
      <h1 className="font-display text-3xl sm:text-4xl mb-8">Secure Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Left: Forms */}
        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground mb-5">
              1. Shipping Details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <input required placeholder="First Name" className="checkout-input" />
              <input required placeholder="Last Name" className="checkout-input" />
              <input required type="tel" placeholder="Phone Number" className="checkout-input sm:col-span-2" />
              <input required placeholder="Street Address / House No." className="checkout-input sm:col-span-2" />
              <input required placeholder="City" className="checkout-input" />
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="State" className="checkout-input" />
                <input required placeholder="PIN Code" className="checkout-input" />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground mb-5">
              2. Payment Method
            </h2>
            <div className="space-y-3">
              {[
                { id: "upi", label: "UPI (GPay, PhonePe, Paytm)", icon: Wallet },
                { id: "card", label: "Credit / Debit Card", icon: CreditCard },
                { id: "cod", label: "Cash on Delivery", icon: Truck },
              ].map((m) => (
                <label
                  key={m.id}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 text-sm font-medium transition-all ${
                    paymentMethod === m.id
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-foreground hover:bg-accent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === m.id}
                      onChange={() => setPaymentMethod(m.id as any)}
                      className="h-4 w-4 accent-primary"
                    />
                    <span>{m.label}</span>
                  </div>
                  <m.icon className="h-5 w-5 opacity-50" />
                </label>
              ))}
            </div>
          </section>
        </form>

        {/* Right: Order Summary */}
        <aside>
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4">Order Summary</h3>
            
            <ul className="divide-y divide-border/60 max-h-[40vh] overflow-y-auto hide-scrollbar">
              {cart.map((item) => {
                const product = PRODUCTS.find((p) => p.id === item.id);
                if (!product) return null;
                return (
                  <li key={`${item.id}-${item.size}-${item.colour}`} className="flex gap-4 py-4 text-sm">
                    <img src={product.images[0]} alt="" className="h-16 w-12 rounded object-cover bg-muted" />
                    <div className="flex-1 min-w-0">
                      <p className="line-clamp-1 font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.size} • {item.colour} • Qty: {item.qty}
                      </p>
                      <p className="font-semibold mt-1">{inr(product.price * item.qty)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 space-y-2.5 border-t border-border/70 pt-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Total MRP</span>
                <span>{inr(mrp)}</span>
              </div>
              <div className="flex justify-between text-success">
                <span>Discount</span>
                <span>-{inr(discount)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span>{shipping === 0 ? "FREE" : inr(shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-border/70 pt-3 text-lg font-bold text-foreground">
                <span>Payable Amount</span>
                <span>{inr(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              className="mt-6 w-full rounded-full bg-primary py-4 text-sm font-semibold text-primary-foreground shadow-md transition-opacity hover:opacity-95"
            >
              Place Order • {inr(total)}
            </button>
            
            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-success" />
              <span>100% Secure Checkout</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}