import { useState, useEffect } from "react";
import { useShop } from "@/lib/store";
import { endpoints } from "@/lib/endpoints";
import { User, Package, MapPin, Phone, Mail, LogOut, CheckCircle2 } from "lucide-react";

export function ProfilePage() {
  const { user, signIn, signOut } = useShop();
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    async function fetchOrders() {
      setOrdersLoading(true);
      try {
        const data = await endpoints.getMyOrders();
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setOrdersLoading(false);
      }
    }
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const API_URL = import.meta.env.VITE_API_URL || "https://dwell-trends-backend.vercel.app/api/v1";
      const res = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      
      if (data.success || res.ok) {
        signIn({ name: form.name, email: form.email });
        setMessage("Profile updated successfully!");
      } else {
        setMessage(data.message || "Failed to update profile.");
      }
    } catch (err) {
      signIn({ name: form.name, email: form.email });
      setMessage("Profile updated successfully (local state)!");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (!user) {
    return (
      <div className="container-page py-28 text-center space-y-4">
        <User className="h-12 w-12 text-muted-foreground mx-auto stroke-1" />
        <h1 className="font-display text-2xl font-bold">Access Denied</h1>
        <p className="text-xs text-muted-foreground">Please sign in to view and manage your profile.</p>
      </div>
    );
  }

  return (
    <div className="container-page py-10 max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">{user.name}</h1>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-xs font-medium hover:bg-secondary/50 text-destructive transition-all"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border mb-8">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === "profile" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Personal Details & Address
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === "orders" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Order History ({orders.length})
        </button>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl text-xs font-medium text-primary flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" /> {message}
        </div>
      )}

      {activeTab === "profile" ? (
        <form onSubmit={handleUpdateProfile} className="space-y-6 bg-card border border-border p-6 rounded-2xl shadow-sm">
          <h2 className="font-display text-lg font-bold">Edit Account & Delivery Info</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> Full Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-3 bg-secondary/20 border border-border rounded-xl text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Email Address
              </label>
              <input
                type="email"
                disabled
                value={form.email}
                className="w-full p-3 bg-secondary/40 border border-border rounded-xl text-xs text-muted-foreground cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> Phone Number
              </label>
              <input
                type="tel"
                placeholder="10-digit mobile number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full p-3 bg-secondary/20 border border-border rounded-xl text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Pincode
              </label>
              <input
                type="text"
                placeholder="Postal Code"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className="w-full p-3 bg-secondary/20 border border-border rounded-xl text-xs focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Street Address</label>
            <input
              type="text"
              placeholder="House no., Building name, Street, Landmark"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full p-3 bg-secondary/20 border border-border rounded-xl text-xs focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">City</label>
            <input
              type="text"
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full p-3 bg-secondary/20 border border-border rounded-xl text-xs focus:outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-full text-xs font-semibold uppercase tracking-wider hover:opacity-95 transition-all disabled:opacity-50"
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          {ordersLoading ? (
            <div className="text-center py-20 text-xs text-muted-foreground">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-2xl">
              <Package className="h-10 w-10 text-muted-foreground mx-auto mb-2 stroke-1" />
              <p className="text-xs text-muted-foreground">No orders placed yet.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-border pb-4">
                  <div>
                    <span className="text-xs font-bold font-mono">Order #{order._id}</span>
                    <p className="text-[11px] text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] uppercase font-semibold rounded-full tracking-wider">
                      {order.orderStatus || "Processing"}
                    </span>
                    <span className="text-sm font-bold text-primary">₹{order.totalAmount}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {order.items.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground/80">{item.name} × {item.qty}</span>
                      <span className="font-semibold">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-[0.7rem] text-muted-foreground border-t border-border/40 flex justify-between">
                  <span>Shipping to: {order.shippingAddress?.street}, {order.shippingAddress?.city} - {order.shippingAddress?.pincode}</span>
                  <span className="uppercase text-primary font-medium">{order.paymentStatus || "Paid"}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}