import { useState, useEffect } from "react";
import { endpoints } from "@/lib/endpoints";
import { useShop } from "@/lib/store";
import { Link, useNavigate } from "@tanstack/react-router";
import { 
  Coins, 
  Package, 
  User as UserIcon, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Truck, 
  RefreshCw,
  ArrowRight
} from "lucide-react";

export function ProfilePage() {
  const { user, setUser } = useShop();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"wallet" | "orders" | "settings">("wallet");
  const [profileData, setProfileData] = useState<any>(user || null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Address edit state
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  const loadUserData = async () => {
    setLoading(true);
    try {
      const [profileRes, ordersRes] = await Promise.all([
        endpoints.getProfile(),
        endpoints.getMyOrders(),
      ]);

      if (profileRes?.success && profileRes.user) {
        setProfileData(profileRes.user);
        if (setUser) setUser(profileRes.user);
        setEditForm({
          name: profileRes.user.name || "",
          phone: profileRes.user.phone || "",
        });
      }

      if (ordersRes?.success && ordersRes.orders) {
        setOrders(ordersRes.orders);
      }
    } catch (err) {
      console.error("Failed to load profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate({ to: "/auth" });
      return;
    }
    loadUserData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await endpoints.updateProfile(editForm);
      if (res.success) {
        alert("Profile updated successfully!");
        loadUserData();
      }
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const walletTokens = Number(profileData?.walletTokens || 0);

  return (
    <div className="container-page py-10 space-y-8 text-foreground min-h-[80vh]">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-secondary text-rose-deep flex items-center justify-center font-display text-xl font-black border border-rose-deep/30 glam-glow shadow-xs">
            {profileData?.name?.[0]?.toUpperCase() || <UserIcon className="h-6 w-6" />}
          </div>
          <div>
            <h1 className="font-display text-2xl font-black text-foreground flex items-center gap-2">
              <span>{profileData?.name || "Account Overview"}</span>
              <span className="text-rose-deep text-sm">✦</span>
            </h1>
            <p className="text-xs text-muted-foreground font-medium">{profileData?.email}</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("wallet")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === "wallet"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-card text-muted-foreground hover:text-rose-deep hover:bg-secondary/70 border border-border"
            }`}
          >
            <Coins className="h-4 w-4 text-rose-deep" /> Dwell Wallet
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === "orders"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-card text-muted-foreground hover:text-rose-deep hover:bg-secondary/70 border border-border"
            }`}
          >
            <Package className="h-4 w-4" /> My Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === "settings"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-card text-muted-foreground hover:text-rose-deep hover:bg-secondary/70 border border-border"
            }`}
          >
            <UserIcon className="h-4 w-4" /> Settings
          </button>
        </div>
      </div>

      {/* --- TAB 1: WALLET & TOKEN ECONOMY --- */}
      {activeTab === "wallet" && (
        <div className="space-y-6">
          {/* Main Balance Banner */}
          <div className="rounded-3xl bg-secondary border border-rose-deep/30 p-8 shadow-card relative overflow-hidden">
            {/* Subtle Rose Glow */}
            <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-rose-deep/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-rose-soft/25 blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 bg-card/80 border border-rose-deep/25 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-rose-deep shadow-xs">
                  <Sparkles className="h-3.5 w-3.5 fill-rose-deep text-rose-deep animate-pulse" /> Dwell Rewards Balance
                </span>
                <p className="text-xs text-muted-foreground font-medium pt-1">Spendable Token Credit</p>
                <div className="flex items-baseline gap-2.5">
                  <span className="font-display text-4xl sm:text-5xl font-black text-foreground">{walletTokens}</span>
                  <span className="text-base font-black text-rose-deep uppercase tracking-wider">Tokens</span>
                  <span className="text-xs bg-card border border-border px-2.5 py-1 rounded-lg font-bold text-foreground ml-2 shadow-xs">
                    = ₹{walletTokens} off next order
                  </span>
                </div>
              </div>

              <div className="space-y-2 bg-card/90 p-4.5 rounded-2xl border border-border text-xs max-w-sm shadow-xs backdrop-blur-sm">
                <p className="font-black uppercase tracking-wider flex items-center gap-1.5 text-rose-deep text-[11px]">
                  <Coins className="h-4 w-4" /> Rewards Program:
                </p>
                <ul className="space-y-1.5 text-muted-foreground text-[11px] font-medium leading-relaxed">
                  <li>• <b>Earn:</b> 1 Token for every ₹100 spent (credited on UTR approval).</li>
                  <li>• <b>Redeem:</b> 1 Token = ₹1 instant discount during checkout.</li>
                  <li>• <b>Stackable:</b> Combine freely with active flash deals & free delivery.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Token Earning History */}
          <div className="space-y-3">
            <h3 className="font-display text-xs font-black uppercase tracking-widest text-rose-deep flex items-center gap-1.5">
              <span>✦</span> Token Activity Ledger
            </h3>
            <div className="border border-border rounded-2xl bg-card divide-y divide-border overflow-hidden shadow-xs">
              {orders.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground font-medium">
                  No purchase activity recorded yet. Complete an order to begin earning tokens!
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order._id} className="p-4 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <p className="font-bold text-foreground">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })} · Status: <span className="font-bold text-foreground">{order.paymentStatus}</span>
                      </p>
                    </div>

                    <div className="text-right space-y-0.5">
                      {order.tokensEarned > 0 && (
                        <span className="block font-black text-rose-deep text-[11px]">
                          +{order.tokensEarned} tokens earned
                        </span>
                      )}
                      {order.tokensUsed > 0 && (
                        <span className="block font-black text-muted-foreground text-[11px]">
                          -{order.tokensUsed} tokens redeemed
                        </span>
                      )}
                      {order.tokensEarned === 0 && order.tokensUsed === 0 && (
                        <span className="text-muted-foreground italic text-[11px]">0 tokens</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: COMPLETE ORDER HISTORY --- */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xs font-black uppercase tracking-widest text-rose-deep flex items-center gap-1.5">
              <span>✦</span> Past Orders ({orders.length})
            </h2>
            <button
              onClick={loadUserData}
              className="flex items-center gap-1.5 text-xs text-rose-deep font-black uppercase tracking-wider hover:underline"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border bg-card/60 backdrop-blur-md rounded-3xl space-y-4 max-w-md mx-auto shadow-xs">
              <Package className="h-8 w-8 mx-auto text-rose-deep" />
              <p className="font-display text-base font-black text-foreground">No orders placed yet</p>
              <p className="text-xs text-muted-foreground leading-relaxed px-4">
                Discover statement pieces and exclusive drops crafted for your wardrobe.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-card"
              >
                <span>Browse Drops</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="border border-border bg-card rounded-2xl p-5 space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                    <div>
                      <span className="font-mono font-bold text-xs text-foreground">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                      <span className="text-[11px] text-muted-foreground ml-3">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          order.paymentStatus === "Paid"
                            ? "bg-secondary text-rose-deep border-rose-deep/20"
                            : "bg-secondary text-amber-700 border-amber-500/20"
                        }`}
                      >
                        Payment: {order.paymentStatus}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-background border border-border text-foreground text-[10px] font-bold">
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-border">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-3.5 py-2.5 first:pt-0">
                        <img
                          src={item.image}
                          alt=""
                          className="h-14 w-12 rounded-xl object-cover bg-background border border-border shrink-0"
                        />
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <p className="text-xs font-bold truncate text-foreground">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            Size: <span className="font-bold text-rose-deep">{item.selectedSize}</span> · Colour: <span className="font-bold text-rose-deep">{item.selectedColour}</span> · Qty: {item.qty}
                          </p>
                          <p className="text-xs font-black text-primary mt-1">₹{item.price * item.qty}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer Breakdown */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border text-xs">
                    <div className="text-muted-foreground text-[11px]">
                      UTR Ref: <span className="font-mono font-bold text-foreground">{order.paymentUtr || "Pending verification"}</span>
                    </div>
                    <div className="flex items-center gap-4 font-bold">
                      {order.tokensUsed > 0 && (
                        <span className="text-rose-deep text-[11px] font-black">Saved ₹{order.tokensUsed} via Tokens</span>
                      )}
                      <span>Total: <span className="text-primary font-display text-sm font-black">₹{order.finalTotal}</span></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- TAB 3: PROFILE SETTINGS --- */}
      {activeTab === "settings" && (
        <form onSubmit={handleUpdateProfile} className="max-w-xl bg-card border border-border p-6 sm:p-7 rounded-3xl space-y-4.5 shadow-card backdrop-blur-md">
          <h2 className="font-display text-sm font-black uppercase tracking-widest text-rose-deep flex items-center gap-1.5 mb-2">
            <span>✦</span> Update Account Details
          </h2>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-rose-deep block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full p-3 bg-background border border-border rounded-xl text-xs text-foreground outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/15 transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-rose-deep block mb-1">Email Address</label>
            <input
              type="email"
              disabled
              value={profileData?.email || ""}
              className="w-full p-3 bg-secondary border border-border rounded-xl text-xs text-muted-foreground cursor-not-allowed font-medium"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-rose-deep block mb-1">Contact Phone</label>
            <input
              type="tel"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              placeholder="e.g. 9876543210"
              className="w-full p-3 bg-background border border-border rounded-xl text-xs text-foreground outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/15 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className="w-full py-3.5 bg-primary text-primary-foreground rounded-full text-xs font-black uppercase tracking-widest hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all shadow-card mt-2"
          >
            {updating ? "Saving Changes..." : "Save Profile Details"}
          </button>
        </form>
      )}
    </div>
  );
}