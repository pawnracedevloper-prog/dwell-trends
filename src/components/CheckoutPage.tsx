import { useState } from "react";
import { useShop } from "@/lib/store";
import { useNavigate } from "@tanstack/react-router";
import { CreditCard, Truck, CheckCircle2 } from "lucide-react";

export function CheckoutPage() {
  const { cart, clearCart, placeOrder } = useShop();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("card");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvc: "" });
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState<any>(null);

  // Calculate cart totals
  const subtotal = cart.reduce((acc, item) => acc + (item.productDetails?.price || 0) * item.qty, 0);
  const shipping = subtotal > 0 && subtotal < 999 ? 79 : 0;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    try {
      // Simulate or execute live order placement
      const orderData = {
        shippingAddress: form,
        paymentMethod,
        paymentStatus: paymentMethod === "card" ? "Paid" : "Pending",
        items: cart,
        total,
      };

      const newOrder = await placeOrder(total, orderData);
      setSuccessOrder(newOrder);
      clearCart();
    } catch (err) {
      console.error("Order placement failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (successOrder) {
    return (
      <div className="container-page py-20 text-center space-y-6 max-w-md mx-auto">
        <CheckCircle2 className="h-16 w-16 text-primary mx-auto" />
        <h1 className="font-display text-2xl font-bold">Order Confirmed!</h1>
        <p className="text-xs text-muted-foreground">
          Thank you for shopping with us. Your order ID is <span className="font-semibold text-foreground">{successOrder.id}</span>.
        </p>
        <button
          onClick={() => navigate({ to: "/" })}
          className="w-full py-3.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold uppercase tracking-wider"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container-page py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
        <div>
          <h2 className="font-display text-xl font-bold mb-4">Shipping Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="p-3 bg-card border border-border rounded-xl text-xs focus:outline-none focus:border-primary"
            />
            <input
              type="email"
              placeholder="Email Address"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="p-3 bg-card border border-border rounded-xl text-xs focus:outline-none focus:border-primary"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="p-3 bg-card border border-border rounded-xl text-xs focus:outline-none focus:border-primary"
            />
            <input
              type="text"
              placeholder="Pincode"
              required
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              className="p-3 bg-card border border-border rounded-xl text-xs focus:outline-none focus:border-primary"
            />
          </div>
          <input
            type="text"
            placeholder="Street Address, Apartment, Suite"
            required
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full mt-4 p-3 bg-card border border-border rounded-xl text-xs focus:outline-none focus:border-primary"
          />
        </div>

        {/* Payment Method Selector */}
        <div>
          <h2 className="font-display text-xl font-bold mb-4">Payment Method</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                paymentMethod === "card" ? "border-primary bg-primary/5 font-semibold" : "border-border"
              }`}
            >
              <CreditCard className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs font-bold">Credit / Debit Card</p>
                <p className="text-[10px] text-muted-foreground">Secure online payment</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("cod")}
              className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                paymentMethod === "cod" ? "border-primary bg-primary/5 font-semibold" : "border-border"
              }`}
            >
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs font-bold">Cash on Delivery</p>
                <p className="text-[10px] text-muted-foreground">Pay when delivered</p>
              </div>
            </button>
          </div>

          {paymentMethod === "card" && (
            <div className="p-5 bg-secondary/20 border border-border rounded-xl space-y-4">
              <input
                type="text"
                placeholder="Card Number (XXXX XXXX XXXX XXXX)"
                maxLength={19}
                required={paymentMethod === "card"}
                value={cardDetails.number}
                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                className="w-full p-3 bg-card border border-border rounded-xl text-xs focus:outline-none focus:border-primary"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="MM / YY"
                  maxLength={5}
                  required={paymentMethod === "card"}
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                  className="p-3 bg-card border border-border rounded-xl text-xs focus:outline-none focus:border-primary"
                />
                <input
                  type="password"
                  placeholder="CVV"
                  maxLength={4}
                  required={paymentMethod === "card"}
                  value={cardDetails.cvc}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                  className="p-3 bg-card border border-border rounded-xl text-xs focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || cart.length === 0}
          className="w-full py-4 bg-primary text-primary-foreground rounded-full text-xs font-semibold uppercase tracking-wider hover:opacity-95 transition-all disabled:opacity-50"
        >
          {loading ? "Processing Order..." : `Pay ₹${total}`}
        </button>
      </form>

      {/* Order Summary Sidebar */}
      <div className="lg:col-span-5 bg-card border border-border p-6 rounded-2xl h-fit space-y-4">
        <h3 className="font-display text-lg font-bold">Order Summary</h3>
        <div className="divide-y divide-border max-h-72 overflow-y-auto space-y-3 pr-1">
          {cart.map((item, idx) => (
            <div key={idx} className="flex gap-3 pt-3 first:pt-0">
              <div className="w-12 h-16 bg-secondary/20 rounded-lg overflow-hidden shrink-0">
                <img src={item.productDetails?.images?.[0]?.url} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{item.productDetails?.name}</p>
                <p className="text-[11px] text-muted-foreground">{item.size} / {item.colour} · Qty: {item.qty}</p>
                <p className="text-xs font-bold text-primary mt-1">₹{(item.productDetails?.price || 0) * item.qty}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-4 space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
          <div className="flex justify-between font-bold text-sm pt-2 border-t border-border"><span>Total</span><span className="text-primary">₹{total}</span></div>
        </div>
      </div>
    </div>
  );
}