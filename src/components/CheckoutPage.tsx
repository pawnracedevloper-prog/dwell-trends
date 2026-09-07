import { useState } from "react";
import { useShop } from "@/lib/store";
import { useNavigate } from "@tanstack/react-router";
import { endpoints } from "@/lib/endpoints";
import { UpiPaymentModal } from "./UpiPaymentModal";
import { Check, ShieldCheck } from "lucide-react";

export function CheckoutPage() {
  const { cart, clearCart } = useShop();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
  });

  const totalMrp = cart.reduce((acc, item) => acc + (item.productDetails?.mrp || item.productDetails?.price || 0) * item.qty, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.productDetails?.price || 0) * item.qty, 0);
  const discount = totalMrp > subtotal ? totalMrp - subtotal : 0;
  const shippingFee = subtotal > 0 && subtotal < 999 ? 79 : 0;
  const finalTotal = subtotal + shippingFee;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.street || !form.pinCode) return;
    setActiveStep(2);
  };

  const executeOrderCreation = async (upiRef: string) => {
    setLoading(true);
    setErrorMessage("");

    const orderPayload = {
      items: cart.map((item) => ({
        product: item.productId || item.productDetails?._id,
        name: item.productDetails?.name || "Product",
        selectedSize: item.size || item.selectedSize,
        selectedColour: item.colour || item.selectedColour,
        qty: item.qty,
        price: item.productDetails?.price || 0,
        image: item.productDetails?.images?.[0]?.url || item.image || "",
      })),
      guestEmail: form.email || undefined,
      totalMrp,
      discount,
      shippingFee,
      finalTotal,
      shippingAddress: form,
      paymentMethod: "upi",
      paymentStatus: "Paid", // Automatically marked paid for the dummy mock
    };

    try {
      const response = await endpoints.createOrder(orderPayload);
      if (response.success) {
        clearCart();
        navigate({ to: `/orders/track/${response.order._id}` });
      } else {
        setErrorMessage(response.message || "Failed to finalize order.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Transaction error.");
    } finally {
      setLoading(false);
      setShowUpiModal(false);
    }
  };

  return (
    <div className="container-page py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {showUpiModal && (
        <UpiPaymentModal
          amount={finalTotal}
          onSuccess={(refId) => executeOrderCreation(refId)}
          onCancel={() => setShowUpiModal(false)}
        />
      )}

      {/* Accordion Steps (Left Side) */}
      <div className="lg:col-span-8 space-y-4">
        {errorMessage && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {/* STEP 1: DELIVERY ADDRESS */}
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <div onClick={() => setActiveStep(1)} className="p-4 bg-secondary/30 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${activeStep > 1 ? "bg-green-600 text-white" : "bg-primary text-primary-foreground"}`}>
                {activeStep > 1 ? <Check className="h-3.5 w-3.5" /> : "1"}
              </span>
              <span className="font-display font-bold text-sm">Delivery Address</span>
            </div>
            {activeStep > 1 && <span className="text-xs text-primary font-semibold">Change</span>}
          </div>

          {activeStep === 1 ? (
            <form onSubmit={handleAddressSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input required placeholder="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="p-3 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary" />
                <input required type="tel" placeholder="10-digit Mobile Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="p-3 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary" />
                <input type="email" placeholder="Email ID (for invoice)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="p-3 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary" />
                <input required placeholder="PIN Code" value={form.pinCode} onChange={(e) => setForm({ ...form, pinCode: e.target.value })} className="p-3 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary" />
                <input required placeholder="City / District" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="p-3 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary" />
                <input required placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="p-3 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary" />
              </div>
              <input required placeholder="House No., Building, Street Area" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className="w-full p-3 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary" />
              <button type="submit" className="px-8 py-3 bg-primary text-primary-foreground rounded-xl text-xs font-semibold uppercase tracking-wider">
                Deliver Here
              </button>
            </form>
          ) : (
            <div className="p-4 text-xs text-muted-foreground">
              <span className="font-bold text-foreground">{form.fullName}</span>, {form.street}, {form.city} - {form.pinCode} (Phone: {form.phone})
            </div>
          )}
        </div>

        {/* STEP 2: ORDER SUMMARY */}
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <div onClick={() => form.fullName && setActiveStep(2)} className="p-4 bg-secondary/30 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${activeStep > 2 ? "bg-green-600 text-white" : "bg-primary text-primary-foreground"}`}>
                {activeStep > 2 ? <Check className="h-3.5 w-3.5" /> : "2"}
              </span>
              <span className="font-display font-bold text-sm">Order Summary ({cart.length} items)</span>
            </div>
          </div>

          {activeStep === 2 && (
            <div className="p-5 space-y-4">
              <div className="divide-y divide-border max-h-80 overflow-y-auto">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-4 py-3 first:pt-0">
                    <img src={item.productDetails?.images?.[0]?.url || item.image} alt="" className="w-14 h-18 object-cover rounded-lg bg-secondary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{item.productDetails?.name}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Size: {item.size || item.selectedSize} · Colour: {item.colour || item.selectedColour} · Qty: {item.qty}</p>
                      <p className="text-xs font-bold text-primary mt-2">₹{(item.productDetails?.price || 0) * item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setActiveStep(3)} className="px-8 py-3 bg-primary text-primary-foreground rounded-xl text-xs font-semibold uppercase tracking-wider">
                Continue to Payment
              </button>
            </div>
          )}
        </div>

        {/* STEP 3: PAYMENT OPTION */}
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <div className="p-4 bg-secondary/30 flex items-center gap-3">
            <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</span>
            <span className="font-display font-bold text-sm">Payment Options</span>
          </div>

          {activeStep === 3 && (
            <div className="p-5 space-y-4">
              <div className="p-4 border border-primary bg-primary/5 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <p className="text-xs font-bold">Instant UPI Payment</p>
                    <p className="text-[10px] text-muted-foreground">Google Pay, PhonePe, Paytm & Other UPI IDs</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary">Fast & Verified</span>
              </div>
              <button type="button" disabled={loading} onClick={() => setShowUpiModal(true)} className="w-full py-4 bg-primary text-primary-foreground rounded-full text-xs font-semibold uppercase tracking-wider hover:opacity-95 transition-all shadow-md">
                Pay ₹{finalTotal} via UPI
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Price Details Sidebar */}
      <div className="lg:col-span-4 bg-card border border-border p-6 rounded-2xl h-fit space-y-4">
        <h3 className="font-display text-base font-bold text-muted-foreground uppercase tracking-wider text-xs">Price Details</h3>
        <div className="border-t border-border pt-4 space-y-3 text-xs">
          <div className="flex justify-between"><span className="text-muted-foreground">Price ({cart.length} items)</span><span>₹{totalMrp}</span></div>
          {discount > 0 && <div className="flex justify-between text-green-600 font-medium"><span>Discount</span><span>-₹{discount}</span></div>}
          <div className="flex justify-between"><span className="text-muted-foreground">Delivery Charges</span><span>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span></div>
          <div className="flex justify-between font-bold text-sm pt-3 border-t border-border"><span>Total Payable</span><span className="text-primary">₹{finalTotal}</span></div>
        </div>
        <div className="pt-2 text-[11px] text-green-700 flex items-center gap-1.5 font-medium">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>Safe and Secure Payments. 100% Authentic Products.</span>
        </div>
      </div>
    </div>
  );
}