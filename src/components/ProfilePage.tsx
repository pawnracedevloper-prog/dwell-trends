import { useState, useEffect } from "react";
import { endpoints } from "@/lib/endpoints";
import { useShop } from "@/lib/store";
import { Link, useNavigate } from "@tanstack/react-router";
import { 
  Coins, 
  Package, 
  User as UserIcon, 
  Sparkles, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle,
  RefreshCw
} from "lucide-react";

export function ProfilePage() {
  const { user, setUser, logout } = useShop();
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
      navigate({ to: "/login" });
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
    <div className="container-page py-10 space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display text-xl font-bold border border-primary/20">
            {profileData?.name?.[0]?.toUpperCase() || <UserIcon className="h-6 w-6" />}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {profileData?.name || "Account"}
            </h1>
            <p className="text-xs text-muted-foreground">{profileData?.email}</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("wallet")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === "wallet"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground hover:bg-secondary/70"
            }`}
          >
            <Coins className="h-4 w-4" /> Dwell Wallet
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === "orders"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground hover:bg-secondary/70"
            }`}
          >
            <Package className="h-4 w-4" /> My Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === "settings"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground hover:bg-secondary/70"
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
          <div className="rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-8 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-amber-100">
                  <Sparkles className="h-3.5 w-3.5" /> Dwell Rewards Economy
                </span>
                <p className="text-xs text-amber-100">Current Spendable Balance</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl sm:text-5xl font-extrabold">{walletTokens}</span>
                  <span className="text-lg font-bold text-amber-100">Tokens</span>
                  <span className="text-sm bg-white/20 px-2 py-0.5 rounded-md font-semibold ml-2">
                    = ₹{walletTokens} off
                  </span>
                </div>
              </div>

              <div className="space-y-2 bg-black/15 p-4 rounded-2xl border border-white/10 text-xs max-w-sm">
                <p className="font-bold flex items-center gap-1.5 text-amber-100">
                  <Coins className="h-4 w-4" /> Token Rules:
                </p>
                <ul className="space-y-1 text-amber-50 text-[11px]">
                  <li>• <b>Earn:</b> 1 Token for every ₹100 spent (credited on UTR approval).</li>
                  <li>• <b>Redeem:</b> 1 Token = ₹1 instant discount during checkout.</li>
                  <li>• <b>Stackable:</b> Combine freely with active flash deals & free delivery.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Token Earning History (Derived from Orders) */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Token Activity Breakdown
            </h3>
            <div className="border border-border rounded-2xl bg-card divide-y divide-border overflow-hidden">
              {orders.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No purchase activity recorded yet. Complete an order to begin earning tokens!
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order._id} className="p-4 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <p className="font-bold text-foreground">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })} · Status: <span className="font-semibold text-foreground">{order.paymentStatus}</span>
                      </p>
                    </div>

                    <div className="text-right space-y-0.5">
                      {order.tokensEarned > 0 && (
                        <span className="block font-bold text-green-700">
                          +{order.tokensEarned} tokens earned
                        </span>
                      )}
                      {order.tokensUsed > 0 && (
                        <span className="block font-bold text-amber-700">
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
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Past Orders ({orders.length})
            </h2>
            <button
              onClick={loadUserData}
              className="flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Orders
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-2xl space-y-3">
              <Package className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="font-display text-sm font-bold">No orders placed yet</p>
              <Link
                to="/products"
                className="inline-block px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="border border-border bg-card rounded-2xl p-5 space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                    <div>
                      <span className="font-mono font-bold text-xs">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                      <span className="text-[11px] text-muted-foreground ml-3">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.paymentStatus === "Paid"
                            ? "bg-green-500/10 text-green-700"
                            : "bg-amber-500/10 text-amber-700"
                        }`}
                      >
                        Payment: {order.paymentStatus}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary text-foreground text-[10px] font-bold">
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
                          className="h-14 w-12 rounded-lg object-cover bg-secondary border border-border"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {item.selectedSize} · {item.selectedColour} · Qty: {item.qty}
                          </p>
                          <p className="text-xs font-bold text-primary mt-1">₹{item.price * item.qty}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer Breakdown */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border text-xs">
                    <div className="text-muted-foreground text-[11px]">
                      UTR: <span className="font-mono font-semibold text-foreground">{order.paymentUtr || "Pending verification"}</span>
                    </div>
                    <div className="flex items-center gap-4 font-bold">
                      {order.tokensUsed > 0 && (
                        <span className="text-amber-700 text-[11px]">Saved ₹{order.tokensUsed} via Tokens</span>
                      )}
                      <span>Total: <span className="text-primary font-display text-sm">₹{order.finalTotal}</span></span>
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
        <form onSubmit={handleUpdateProfile} className="max-w-xl bg-card border border-border p-6 rounded-2xl space-y-4">
          <h2 className="font-display text-base font-bold">Update Account Details</h2>

          <div>
            <label className="text-[11px] font-bold uppercase text-muted-foreground">Full Name</label>
            <input
              type="text"
              required
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full mt-1 p-2.5 bg-secondary/30 border border-border rounded-xl text-xs outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-muted-foreground">Email (Cannot be changed)</label>
            <input
              type="email"
              disabled
              value={profileData?.email || ""}
              className="w-full mt-1 p-2.5 bg-secondary/60 border border-border rounded-xl text-xs text-muted-foreground cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-muted-foreground">Contact Phone</label>
            <input
              type="tel"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              placeholder="e.g. 9876543210"
              className="w-full mt-1 p-2.5 bg-secondary/30 border border-border rounded-xl text-xs outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-95 disabled:opacity-50"
          >
            {updating ? "Saving Changes..." : "Save Profile Details"}
          </button>
        </form>
      )}
    </div>
  );
}