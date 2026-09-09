import { useState, useEffect } from "react";
import { useShop } from "@/lib/store";
import { useNavigate } from "@tanstack/react-router";
import { endpoints } from "@/lib/endpoints";
import { UpiPaymentModal } from "./UpiPaymentModal";
import { Check, ShieldCheck, Coins, Sparkles, RefreshCw, Zap, ArrowRight, MapPin, Truck } from "lucide-react";

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
    <div className="container-page py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 text-foreground min-h-screen">
      {showUpiModal && createdOrderId && (
        <UpiPaymentModal
          amount={finalPayableTotal}
          orderId={createdOrderId}
          onSuccess={handlePaymentCompletion}
          onCancel={() => setShowUpiModal(false)}
        />
      )}

      {/* Accordion Steps */}
      <div className="lg:col-span-8 space-y-5">
        {errorMessage && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-xs font-bold shadow-xs">
            {errorMessage}
          </div>
        )}

        {/* STEP 1: DELIVERY ADDRESS */}
        <div className="border border-border/80 rounded-3xl bg-card overflow-hidden shadow-card backdrop-blur-md">
          <div
            onClick={() => setActiveStep(1)}
            className="p-5 bg-secondary/60 border-b border-border/70 flex items-center justify-between cursor-pointer transition-colors hover:bg-secondary/80"
          >
            <div className="flex items-center gap-3">
              <span
                className={`h-7 w-7 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                  activeStep > 1 
                    ? "bg-secondary text-rose-deep border border-rose-deep/30" 
                    : "bg-primary text-primary-foreground shadow-xs"
                }`}
              >
                {activeStep > 1 ? <Check className="h-4 w-4" /> : "1"}
              </span>
              <span className="font-display font-black text-sm uppercase tracking-wider text-foreground">
                Delivery Address
              </span>
            </div>
            {activeStep > 1 && (
              <span className="text-xs text-rose-deep font-black uppercase tracking-wider hover:opacity-80 transition-opacity">
                Edit Details
              </span>
            )}
          </div>

          {activeStep === 1 ? (
            <form onSubmit={handleAddressSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-rose-deep block mb-1">Full Name</label>
                  <input
                    required
                    placeholder="Recipient's Name"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full p-3 bg-background border border-border rounded-xl text-xs text-foreground outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/15 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-rose-deep block mb-1">Mobile Number</label>
                  <input
                    required
                    type="tel"
                    placeholder="10-digit Mobile Number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full p-3 bg-background border border-border rounded-xl text-xs text-foreground outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/15 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-rose-deep block mb-1">Email ID</label>
                  <input
                    type="email"
                    placeholder="name@domain.com (for order tracking)"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full p-3 bg-background border border-border rounded-xl text-xs text-foreground outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/15 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-rose-deep block mb-1">PIN Code</label>
                  <input
                    required
                    placeholder="6-digit PIN Code"
                    value={form.pinCode}
                    onChange={(e) => setForm({ ...form, pinCode: e.target.value })}
                    className="w-full p-3 bg-background border border-border rounded-xl text-xs text-foreground outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/15 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-rose-deep block mb-1">City / District</label>
                  <input
                    required
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full p-3 bg-background border border-border rounded-xl text-xs text-foreground outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/15 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-rose-deep block mb-1">State</label>
                  <input
                    required
                    placeholder="State"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full p-3 bg-background border border-border rounded-xl text-xs text-foreground outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/15 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-rose-deep block mb-1">Street Address</label>
                <input
                  required
                  placeholder="House No., Building, Street Area, Landmark"
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                  className="w-full p-3 bg-background border border-border rounded-xl text-xs text-foreground outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/15 transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3.5 bg-primary text-primary-foreground rounded-full text-xs font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-card flex items-center gap-2"
              >
                Deliver to this Address <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <div className="p-5 text-xs text-muted-foreground flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-rose-deep shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-foreground">{form.fullName}</span> — {form.street},{" "}
                {form.city} - {form.pinCode}, {form.state} (Phone: <span className="text-rose-deep font-bold">{form.phone}</span>)
              </div>
            </div>
          )}
        </div>

        {/* STEP 2: ORDER SUMMARY */}
        <div className="border border-border/80 rounded-3xl bg-card overflow-hidden shadow-card backdrop-blur-md">
          <div
            onClick={() => form.fullName && setActiveStep(2)}
            className="p-5 bg-secondary/60 border-b border-border/70 flex items-center justify-between cursor-pointer transition-colors hover:bg-secondary/80"
          >
            <div className="flex items-center gap-3">
              <span
                className={`h-7 w-7 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                  activeStep > 2 
                    ? "bg-secondary text-rose-deep border border-rose-deep/30" 
                    : "bg-primary text-primary-foreground shadow-xs"
                }`}
              >
                {activeStep > 2 ? <Check className="h-4 w-4" /> : "2"}
              </span>
              <span className="font-display font-black text-sm uppercase tracking-wider text-foreground">
                Order Review ({cart.reduce((n, c) => n + c.qty, 0)} Items)
              </span>
            </div>
          </div>

          {activeStep === 2 && (
            <div className="p-6 space-y-5">
              <div className="divide-y divide-border/60 max-h-80 overflow-y-auto pr-1">
                {cart.map((item, idx) => {
                  const name = item.productDetails?.name || item.name || "Product";
                  const price = item.productDetails?.price || item.price || 0;
                  const image = item.productDetails?.images?.[0]?.url || item.image;

                  return (
                    <div key={idx} className="flex gap-4 py-3.5 first:pt-0">
                      <img
                        src={image}
                        alt={name}
                        className="w-14 h-18 object-cover rounded-xl bg-background border border-border/80 shrink-0 shadow-xs"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate text-foreground">{name}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Size: <span className="text-rose-deep font-bold">{item.size || item.selectedSize}</span> · Colour: <span className="text-rose-deep font-bold">{item.colour || item.selectedColour}</span> · Qty: {item.qty}
                        </p>
                        <p className="text-xs font-black text-primary mt-2">
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
                className="px-8 py-3.5 bg-primary text-primary-foreground rounded-full text-xs font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-card flex items-center gap-2"
              >
                Continue to Payment <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* STEP 3: PAYMENT OPTION */}
        <div className="border border-border/80 rounded-3xl bg-card overflow-hidden shadow-card backdrop-blur-md">
          <div className="p-5 bg-secondary/60 flex items-center gap-3">
            <span className="h-7 w-7 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-xs font-black shadow-xs">
              3
            </span>
            <span className="font-display font-black text-sm uppercase tracking-wider text-foreground">
              Payment Gateway
            </span>
          </div>

          {activeStep === 3 && (
            <div className="p-6 space-y-5">
              <div className="p-4.5 border border-rose-deep/30 bg-secondary/80 rounded-2xl flex items-center justify-between glam-glow">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-secondary text-rose-deep border border-rose-deep/30">
                    <Zap className="h-5 w-5 fill-rose-deep text-rose-deep" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-foreground">Instant UPI Payment</p>
                    <p className="text-[11px] text-muted-foreground">
                      Scan QR with Google Pay, PhonePe, Paytm or Any UPI App
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-deep bg-background px-2.5 py-1 rounded-full border border-rose-deep/20">
                  Fast & Verified
                </span>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={handleInitiateUpiPayment}
                className="w-full py-4 bg-primary text-primary-foreground rounded-full text-xs font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-card disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Preparing Payment...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 fill-rose-soft text-rose-soft animate-pulse" /> Pay ₹{finalPayableTotal} via UPI QR
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Price Details & Wallet Card */}
      <div className="lg:col-span-4 space-y-5 h-fit">
        {/* Token Wallet Box */}
        <div className="bg-card border border-rose-deep/30 rounded-3xl p-5 shadow-card backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-secondary text-rose-deep border border-rose-deep/20 glam-glow">
                <Coins className="h-5 w-5 fill-rose-deep text-rose-deep" />
              </div>
              <div>
                <h4 className="font-display text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-foreground">
                  Dwell Token Wallet
                  {fetchingWallet && <RefreshCw className="h-3 w-3 animate-spin text-rose-deep" />}
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Available: <b className="text-rose-deep font-bold">{walletTokens} tokens</b> (₹{walletTokens})
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
              <div className="w-10 h-5.5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-rose-deep peer-disabled:opacity-40 border border-border"></div>
            </label>
          </div>

          {walletTokens <= 0 ? (
            <p className="text-[11px] text-muted-foreground mt-3 pt-3 border-t border-border/60">
              Earn tokens automatically on this order to unlock savings on your next drop!
            </p>
          ) : useTokens ? (
            <p className="text-[11px] text-rose-deep font-bold mt-3 pt-3 border-t border-rose-deep/20 flex items-center gap-1.5">
              <span>✦</span> Applied ₹{tokensToDeduct} discount from your wallet!
            </p>
          ) : (
            <p className="text-[11px] text-muted-foreground mt-3 pt-3 border-t border-border/60">
              Toggle switch above to use your {walletTokens} tokens for ₹{Math.min(walletTokens, baseOrderTotal)} off.
            </p>
          )}
        </div>

        {/* Price Breakdown Sidebar */}
        <div className="bg-card border border-border/80 p-6 rounded-3xl space-y-4 shadow-card backdrop-blur-md">
          <h3 className="font-display font-black uppercase tracking-widest text-xs text-rose-deep flex items-center gap-1.5">
            <span>✦</span> Order Price Summary
          </h3>

          <div className="border-t border-border/60 pt-4 space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total MRP</span>
              <span className="font-semibold text-foreground">₹{totalMrp}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-rose-deep font-bold">
                <span>Discount on MRP</span>
                <span>-₹{discount}</span>
              </div>
            )}

            {useTokens && tokensToDeduct > 0 && (
              <div className="flex justify-between text-rose-deep font-bold">
                <span className="flex items-center gap-1">
                  <Coins className="h-3.5 w-3.5" /> Tokens Redeemed
                </span>
                <span>-₹{tokensToDeduct}</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Express Delivery</span>
              <span>
                {shippingFee === 0 ? (
                  <span className="text-rose-deep font-bold bg-secondary px-2 py-0.5 rounded-md text-[10px] border border-rose-deep/20">
                    FREE
                  </span>
                ) : (
                  `₹${shippingFee}`
                )}
              </span>
            </div>

            <div className="flex justify-between items-baseline font-black text-sm pt-4 border-t border-border/80 text-foreground">
              <span className="uppercase tracking-wider">Final Payable</span>
              <span className="text-primary text-xl font-black">₹{finalPayableTotal}</span>
            </div>
          </div>

          {/* Reward Projection */}
          {estimatedTokensToEarn > 0 && (
            <div className="rounded-2xl bg-secondary p-3 flex items-center gap-2.5 text-[11px] text-rose-deep border border-rose-deep/30 glam-glow">
              <Sparkles className="h-4 w-4 shrink-0 text-rose-deep animate-pulse" />
              <span>
                You will earn <b className="text-foreground">+{estimatedTokensToEarn} Dwell Tokens</b> upon payment approval.
              </span>
            </div>
          )}

          <div className="pt-2 text-[11px] text-muted-foreground flex items-center gap-2 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Encrypted UPI Gateway. 100% Authentic Handcrafted silhouettes.</span>
          </div>
        </div>
      </div>
    </div>
  );
}