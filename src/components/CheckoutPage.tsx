import { useState, useEffect } from "react";
import { useShop } from "@/lib/store";
import { useNavigate } from "@tanstack/react-router";
import { endpoints } from "@/lib/endpoints";
import { UpiPaymentModal } from "./UpiPaymentModal";
import { Check, ShieldCheck, Coins, Sparkles, RefreshCw } from "lucide-react";

export function CheckoutPage() {
  const { cart, clearCart, user } = useShop();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Live Wallet State directly from DB
  const [walletTokens, setWalletTokens] = useState<number>(() => {
    return Number(user?.walletTokens || 0);
  });
  const [fetchingWallet, setFetchingWallet] = useState(false);
  const [useTokens, setUseTokens] = useState(false);

  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
  });

  // 1. Sync live wallet balance using endpoints.getProfile()
  useEffect(() => {
    async function syncLiveWallet() {
      const token = localStorage.getItem("token");
      if (!token) return;

      setFetchingWallet(true);
      try {
        const data = await endpoints.getProfile();

        if (data.success && data.user) {
          const liveTokens = Number(data.user.walletTokens || 0);
          setWalletTokens(liveTokens);

          // Update cached localStorage session
          const cachedUser = JSON.parse(localStorage.getItem("user") || "{}");
          localStorage.setItem(
            "user",
            JSON.stringify({ ...cachedUser, walletTokens: liveTokens })
          );
        }
      } catch (err) {
        console.error("Wallet sync failed:", err);
      } finally {
        setFetchingWallet(false);
      }
    }

    syncLiveWallet();
  }, []);

  // Sync user details to address form
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  // Pricing calculations
  const totalMrp = cart.reduce(
    (acc, item) =>
      acc + (item.productDetails?.mrp || item.mrp || item.productDetails?.price || item.price || 0) * item.qty,
    0
  );

  const subtotal = cart.reduce(
    (acc, item) =>
      acc + (item.productDetails?.price || item.price || 0) * item.qty,
    0
  );

  const discount = totalMrp > subtotal ? totalMrp - subtotal : 0;
  const shippingFee = subtotal > 0 && subtotal < 999 ? 79 : 0;
  const baseOrderTotal = subtotal + shippingFee;

  // Active Tokens Calculation (1 Token = ₹1)
  const tokensToDeduct = useTokens ? Math.min(walletTokens, baseOrderTotal) : 0;
  const finalPayableTotal = Math.max(0, baseOrderTotal - tokensToDeduct);

  // Projected Earned Tokens (1 Token per ₹100 spent on final amount)
  const estimatedTokensToEarn = Math.floor(finalPayableTotal / 100);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.street || !form.pinCode) return;
    setActiveStep(2);
  };

  const handleInitiateUpiPayment = async () => {
    if (cart.length === 0) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const orderPayload = {
      items: cart.map((item) => ({
        product: item.productId || item.productDetails?._id || item.id,
        name: item.productDetails?.name || item.name || "Product",
        selectedSize: item.size || item.selectedSize || "Free Size",
        selectedColour: item.colour || item.selectedColour || "Standard",
        qty: item.qty,
        price: item.productDetails?.price || item.price || 0,
        image: item.productDetails?.images?.[0]?.url || item.image || "",
      })),
      guestEmail: form.email || undefined,
      totalMrp,
      discount,
      shippingFee,
      finalTotal: baseOrderTotal,
      tokensToUse: tokensToDeduct,
      shippingAddress: form,
      paymentMethod: "upi",
      paymentStatus: "Pending",
    };

    try {
      const response = await endpoints.createOrder(orderPayload);
      if (response.success && response.order?._id) {
        setCreatedOrderId(response.order._id);
        setShowUpiModal(true);
      } else {
        setErrorMessage(response.message || "Failed to initialize order.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to process checkout.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentCompletion = async (utrNumber: string) => {
    if (createdOrderId) {
      try {
        await endpoints.submitOrderUtr(createdOrderId, utrNumber);
      } catch (e) {
        console.error("UTR submission error:", e);
      }
      clearCart();
      setShowUpiModal(false);
      navigate({ to: `/orders/track/${createdOrderId}` });
    }
  };

  return (
    <div className="container-page py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {showUpiModal && createdOrderId && (
        <UpiPaymentModal
          amount={finalPayableTotal}
          orderId={createdOrderId}
          onSuccess={handlePaymentCompletion}
          onCancel={() => setShowUpiModal(false)}
        />
      )}

      {/* Accordion Steps */}
      <div className="lg:col-span-8 space-y-4">
        {errorMessage && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {/* STEP 1: DELIVERY ADDRESS */}
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <div
            onClick={() => setActiveStep(1)}
            className="p-4 bg-secondary/30 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span
                className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  activeStep > 1 ? "bg-green-600 text-white" : "bg-primary text-primary-foreground"
                }`}
              >
                {activeStep > 1 ? <Check className="h-3.5 w-3.5" /> : "1"}
              </span>
              <span className="font-display font-bold text-sm">Delivery Address</span>
            </div>
            {activeStep > 1 && <span className="text-xs text-primary font-semibold">Change</span>}
          </div>

          {activeStep === 1 ? (
            <form onSubmit={handleAddressSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="p-3 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary"
                />
                <input
                  required
                  type="tel"
                  placeholder="10-digit Mobile Number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="p-3 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary"
                />
                <input
                  type="email"
                  placeholder="Email ID (for invoice)"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="p-3 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary"
                />
                <input
                  required
                  placeholder="PIN Code"
                  value={form.pinCode}
                  onChange={(e) => setForm({ ...form, pinCode: e.target.value })}
                  className="p-3 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary"
                />
                <input
                  required
                  placeholder="City / District"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="p-3 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary"
                />
                <input
                  required
                  placeholder="State"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="p-3 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary"
                />
              </div>
              <input
                required
                placeholder="House No., Building, Street Area"
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                className="w-full p-3 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-xl text-xs font-semibold uppercase tracking-wider hover:opacity-95"
              >
                Deliver Here
              </button>
            </form>
          ) : (
            <div className="p-4 text-xs text-muted-foreground">
              <span className="font-bold text-foreground">{form.fullName}</span>, {form.street},{" "}
              {form.city} - {form.pinCode} (Phone: {form.phone})
            </div>
          )}
        </div>

        {/* STEP 2: ORDER SUMMARY */}
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <div
            onClick={() => form.fullName && setActiveStep(2)}
            className="p-4 bg-secondary/30 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span
                className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  activeStep > 2 ? "bg-green-600 text-white" : "bg-primary text-primary-foreground"
                }`}
              >
                {activeStep > 2 ? <Check className="h-3.5 w-3.5" /> : "2"}
              </span>
              <span className="font-display font-bold text-sm">
                Order Summary ({cart.reduce((n, c) => n + c.qty, 0)} items)
              </span>
            </div>
          </div>

          {activeStep === 2 && (
            <div className="p-5 space-y-4">
              <div className="divide-y divide-border max-h-80 overflow-y-auto">
                {cart.map((item, idx) => {
                  const name = item.productDetails?.name || item.name || "Product";
                  const price = item.productDetails?.price || item.price || 0;
                  const image = item.productDetails?.images?.[0]?.url || item.image;

                  return (
                    <div key={idx} className="flex gap-4 py-3 first:pt-0">
                      <img
                        src={image}
                        alt={name}
                        className="w-14 h-18 object-cover rounded-lg bg-secondary border border-border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{name}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Size: {item.size || item.selectedSize} · Colour: {item.colour || item.selectedColour} · Qty: {item.qty}
                        </p>
                        <p className="text-xs font-bold text-primary mt-2">
                          ₹{price * item.qty}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-xl text-xs font-semibold uppercase tracking-wider hover:opacity-95"
              >
                Continue to Payment
              </button>
            </div>
          )}
        </div>

        {/* STEP 3: PAYMENT OPTION */}
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <div className="p-4 bg-secondary/30 flex items-center gap-3">
            <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              3
            </span>
            <span className="font-display font-bold text-sm">Payment Options</span>
          </div>

          {activeStep === 3 && (
            <div className="p-5 space-y-4">
              <div className="p-4 border border-primary bg-primary/5 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <p className="text-xs font-bold">Instant UPI Payment</p>
                    <p className="text-[10px] text-muted-foreground">
                      Google Pay, PhonePe, Paytm & Other UPI Apps
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary">Fast & Verified</span>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={handleInitiateUpiPayment}
                className="w-full py-4 bg-primary text-primary-foreground rounded-full text-xs font-semibold uppercase tracking-wider hover:opacity-95 transition-all shadow-md disabled:opacity-50"
              >
                {loading ? "Preparing Payment..." : `Pay ₹${finalPayableTotal} via UPI`}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Price Details & Wallet Card */}
      <div className="lg:col-span-4 space-y-4 h-fit">
        {/* Token Wallet Box (Synced with Live DB) */}
        <div className="bg-card border border-amber-500/30 rounded-2xl p-4 shadow-sm bg-gradient-to-br from-amber-500/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Coins className="h-5 w-5 text-amber-500 fill-amber-500" />
              <div>
                <h4 className="font-display text-xs font-bold flex items-center gap-1.5">
                  Dwell Token Wallet
                  {fetchingWallet && <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground" />}
                </h4>
                <p className="text-[10px] text-muted-foreground">
                  Available: <b className="text-foreground">{walletTokens} tokens</b> (₹{walletTokens})
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                disabled={walletTokens <= 0}
                checked={useTokens && walletTokens > 0}
                onChange={(e) => setUseTokens(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500 peer-disabled:opacity-40"></div>
            </label>
          </div>

          {walletTokens <= 0 ? (
            <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t border-border">
              Earn tokens on this purchase to unlock discounts on your next order!
            </p>
          ) : useTokens ? (
            <p className="text-[11px] text-green-700 font-semibold mt-2 pt-2 border-t border-amber-500/20">
              Applied ₹{tokensToDeduct} discount from your wallet!
            </p>
          ) : (
            <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t border-border">
              Toggle switch above to use your {walletTokens} tokens for ₹{Math.min(walletTokens, baseOrderTotal)} off.
            </p>
          )}
        </div>

        {/* Price Breakdown Sidebar */}
        <div className="bg-card border border-border p-6 rounded-2xl space-y-4 shadow-sm">
          <h3 className="font-display font-bold text-muted-foreground uppercase tracking-wider text-xs">
            Price Details
          </h3>

          <div className="border-t border-border pt-4 space-y-3 text-xs">
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

            {useTokens && tokensToDeduct > 0 && (
              <div className="flex justify-between text-amber-700 font-semibold">
                <span className="flex items-center gap-1">
                  <Coins className="h-3.5 w-3.5" /> Wallet Tokens Applied
                </span>
                <span>-₹{tokensToDeduct}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Charges</span>
              <span>{shippingFee === 0 ? <span className="text-green-700 font-semibold">FREE</span> : `₹${shippingFee}`}</span>
            </div>

            <div className="flex justify-between font-bold text-sm pt-3 border-t border-border text-foreground">
              <span>Total Payable</span>
              <span className="text-primary text-base">₹{finalPayableTotal}</span>
            </div>
          </div>

          {/* Reward Projection */}
          {estimatedTokensToEarn > 0 && (
            <div className="rounded-xl bg-secondary/40 p-2.5 flex items-center gap-2 text-[11px] text-primary border border-border">
              <Sparkles className="h-4 w-4 shrink-0 text-amber-500" />
              <span>
                You will earn <b>+{estimatedTokensToEarn} Dwell Tokens</b> after payment approval.
              </span>
            </div>
          )}

          <div className="pt-2 text-[11px] text-muted-foreground flex items-center gap-1.5 font-medium">
            <ShieldCheck className="h-4 w-4 text-green-600 shrink-0" />
            <span>Safe and Secure Payments. 100% Authentic Products.</span>
          </div>
        </div>
      </div>
    </div>
  );
}