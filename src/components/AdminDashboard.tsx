import { useEffect, useState } from "react";
import { Plus, Trash2, ShieldCheck, Package, ShoppingBag, Clock, CheckCircle2 } from "lucide-react";
import { endpoints } from "@/lib/endpoints";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"orders" | "inventory">("orders");

  // --- ORDER MANAGEMENT STATE ---
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // --- INVENTORY / PRODUCT CREATION STATE ---
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [fabric, setFabric] = useState("");
  const [work, setWork] = useState("");
  const [detailsText, setDetailsText] = useState("");
  const [variants, setVariants] = useState([
    { size: "S", colourName: "Red", colourHex: "#FF0000", stock: 10, sku: "" },
  ]);
  const [images, setImages] = useState<FileList | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [productMessage, setProductMessage] = useState("");

  // Fetch orders on load
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await endpoints.getAllOrders();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleStatusChange = async (orderId: string, field: "orderStatus" | "paymentStatus", value: string) => {
    try {
      const res = await endpoints.updateOrderStatus(orderId, { [field]: value });
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, [field]: value } : o))
        );
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // --- VARIANT HELPERS ---
  const addVariant = () => {
    setVariants([...variants, { size: "M", colourName: "", colourHex: "#000000", stock: 10, sku: "" }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  // --- PRODUCT SUBMIT ---
  async function handleProductSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoadingProduct(true);
    setProductMessage("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("mrp", mrp);
      formData.append("fabric", fabric);
      formData.append("work", work);
      formData.append("variants", JSON.stringify(variants));

      const detailsArray = detailsText.split("\n").filter(Boolean);
      formData.append("details", JSON.stringify(detailsArray));

      if (images) {
        for (let i = 0; i < images.length; i++) {
          formData.append("images", images[i]);
        }
      }

      const API_URL = import.meta.env.VITE_API_URL || "https://dwell-trends-backend.vercel.app/api/v1";
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create product");

      setProductMessage("Product added successfully to MongoDB & Cloudinary!");
      setName("");
      setCategory("");
      setDescription("");
      setPrice("");
      setMrp("");
      setFabric("");
      setWork("");
      setDetailsText("");
      setImages(null);
      setVariants([{ size: "S", colourName: "Red", colourHex: "#FF0000", stock: 10, sku: "" }]);
    } catch (err: any) {
      setProductMessage(err.message);
    } finally {
      setLoadingProduct(false);
    }
  }

  return (
    <div className="container-page py-10 max-w-6xl mx-auto space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <div>
            <h1 className="font-display text-2xl font-bold">Admin Management</h1>
            <p className="text-xs text-muted-foreground">Manage live orders and product inventory</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-secondary/50 p-1 rounded-xl border border-border">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "orders" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShoppingBag className="h-4 w-4" /> Orders ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("inventory")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "inventory" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Package className="h-4 w-4" /> Add Product
          </button>
        </div>
      </div>

      {/* --- TAB 1: ORDER MANAGEMENT --- */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Recent Customer Orders</h2>
            <button
              type="button"
              onClick={fetchOrders}
              className="text-xs text-primary font-semibold hover:underline"
            >
              Refresh Orders
            </button>
          </div>

          {loadingOrders ? (
            <div className="p-12 text-center text-xs text-muted-foreground">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground bg-card rounded-2xl border border-border">
              No orders found.
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-secondary/40 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Order ID & Date</th>
                    <th className="px-4 py-3 font-semibold">Customer Details</th>
                    <th className="px-4 py-3 font-semibold">Items</th>
                    <th className="px-4 py-3 font-semibold">Total Amount</th>
                    <th className="px-4 py-3 font-semibold">Payment Status</th>
                    <th className="px-4 py-3 font-semibold">Fulfillment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-secondary/10 transition-colors">
                      <td className="px-4 py-4">
                        <span className="font-bold block text-primary">#{order._id.slice(-6).toUpperCase()}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="block font-medium">{order.shippingAddress?.fullName || "Guest"}</span>
                        <span className="text-muted-foreground text-[10px]">
                          {order.shippingAddress?.phone} · {order.shippingAddress?.city}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-[11px] text-muted-foreground">
                        {order.items?.length || 0} item(s)
                      </td>
                      <td className="px-4 py-4 font-bold text-foreground">₹{order.finalTotal}</td>
                      <td className="px-4 py-4">
                        <select
                          value={order.paymentStatus}
                          onChange={(e) => handleStatusChange(order._id, "paymentStatus", e.target.value)}
                          className={`text-[11px] font-bold p-1 rounded-lg border outline-none cursor-pointer ${
                            order.paymentStatus === "Paid"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Failed">Failed</option>
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, "orderStatus", e.target.value)}
                          className="text-[11px] font-semibold p-1.5 rounded-lg border border-border bg-background outline-none focus:border-primary cursor-pointer"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 2: INVENTORY PRODUCT CREATION --- */}
      {activeTab === "inventory" && (
        <div className="max-w-4xl mx-auto space-y-4">
          {productMessage && (
            <div
              className={`p-4 rounded-xl text-xs font-medium ${
                productMessage.includes("success")
                  ? "bg-green-500/10 text-green-600 border border-green-500/20"
                  : "bg-destructive/10 text-destructive border border-destructive/20"
              }`}
            >
              {productMessage}
            </div>
          )}

          <form onSubmit={handleProductSubmit} className="space-y-6 bg-card border border-border p-8 rounded-2xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium mb-1 block">Product Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-secondary/30 px-3 text-xs outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Category</label>
                <input
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. kurtis, lehengas"
                  className="h-10 w-full rounded-lg border border-border bg-secondary/30 px-3 text-xs outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium mb-1 block">Selling Price (₹)</label>
                <input
                  required
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-secondary/30 px-3 text-xs outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">MRP (₹)</label>
                <input
                  required
                  type="number"
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-secondary/30 px-3 text-xs outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Upload Images (Max 5)</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setImages(e.target.files)}
                  className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block">Description</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary/30 p-3 text-xs outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium mb-1 block">Fabric</label>
                <input
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  placeholder="e.g. Pure Silk"
                  className="h-10 w-full rounded-lg border border-border bg-secondary/30 px-3 text-xs outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Work Type</label>
                <input
                  value={work}
                  onChange={(e) => setWork(e.target.value)}
                  placeholder="e.g. Zari Embroidery"
                  className="h-10 w-full rounded-lg border border-border bg-secondary/30 px-3 text-xs outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block">Bullet Details (One per line)</label>
              <textarea
                rows={2}
                value={detailsText}
                onChange={(e) => setDetailsText(e.target.value)}
                placeholder="Dry clean only&#10;Made in India"
                className="w-full rounded-lg border border-border bg-secondary/30 p-3 text-xs outline-none focus:border-primary"
              />
            </div>

            {/* Variant Stock Manager */}
            <div className="border-t border-border pt-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider">Size & Color Variants (Inventory)</h3>
                <button
                  type="button"
                  onClick={addVariant}
                  className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Variant
                </button>
              </div>

              <div className="space-y-3">
                {variants.map((v, index) => (
                  <div key={index} className="flex items-center gap-2 bg-secondary/20 p-3 rounded-lg border border-border">
                    <input
                      placeholder="Size (e.g. S, M, L)"
                      value={v.size}
                      onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                      className="h-9 w-24 rounded border border-border bg-card px-2 text-xs"
                    />
                    <input
                      placeholder="Color Name"
                      value={v.colourName}
                      onChange={(e) => handleVariantChange(index, "colourName", e.target.value)}
                      className="h-9 w-28 rounded border border-border bg-card px-2 text-xs"
                    />
                    <input
                      type="color"
                      value={v.colourHex}
                      onChange={(e) => handleVariantChange(index, "colourHex", e.target.value)}
                      className="h-9 w-12 rounded border border-border bg-card p-1 cursor-pointer"
                    />
                    <input
                      placeholder="Stock Qty"
                      type="number"
                      value={v.stock}
                      onChange={(e) => handleVariantChange(index, "stock", Number(e.target.value))}
                      className="h-9 w-24 rounded border border-border bg-card px-2 text-xs"
                    />
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="text-destructive hover:opacity-80 p-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingProduct}
              className="w-full py-3.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold uppercase tracking-wider hover:opacity-95 disabled:opacity-50 transition-all shadow-md"
            >
              {loadingProduct ? "Uploading to Cloudinary & Saving..." : "Publish Product"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}