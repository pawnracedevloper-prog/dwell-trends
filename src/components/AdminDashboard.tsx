import { useState, useEffect } from "react";
import { endpoints } from "@/lib/endpoints";
import { 
  Package, 
  Tag, 
  ShieldCheck, 
  Plus, 
  RefreshCw, 
  Check, 
  Flame, 
  Sparkles, 
  Trash2,
  MapPin,
  Phone,
  Mail,
  Eye,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "deals">("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // --- Product Form State ---
  const [productForm, setProductForm] = useState({
    name: "",
    brand: "Dwell Trends",
    mainCategory: "Women",
    subCategory: "Kurta Sets",
    description: "",
    price: "",
    mrp: "",
    fabric: "",
    work: "",
    dealType: "None",
    dealPrice: "",
  });
  const [productImages, setProductImages] = useState<FileList | null>(null);

  // --- Bulk Deal State ---
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [bulkDealType, setBulkDealType] = useState<"None" | "Hot" | "Wow">("Hot");
  const [bulkDealPrice, setBulkDealPrice] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes] = await Promise.all([
        endpoints.getAllOrders?.() || endpoints.getMyOrders(),
        endpoints.getProducts({}),
      ]);

      if (ordersRes?.orders) setOrders(ordersRes.orders);
      if (productsRes?.products) setProducts(productsRes.products);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Order Status Updater ---
  const handleUpdateOrderStatus = async (orderId: string, orderStatus: string, paymentStatus?: string) => {
    try {
      const res = await endpoints.updateOrderStatus(orderId, {
        orderStatus,
        ...(paymentStatus ? { paymentStatus } : {}),
      });
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId
              ? { ...o, orderStatus, ...(paymentStatus ? { paymentStatus } : {}) }
              : o
          )
        );
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  // --- Create Product Handler ---
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productImages || productImages.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    const formData = new FormData();
    Object.entries(productForm).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    Array.from(productImages).forEach((file) => {
      formData.append("images", file);
    });

    // Default basic variant
    formData.append(
      "variants",
      JSON.stringify([{ size: "Free Size", colourName: "Standard", colourHex: "#000000", stock: 50 }])
    );

    try {
      setLoading(true);
      const res = await endpoints.createProduct(formData);
      if (res.success) {
        alert("Product created successfully!");
        setProductForm({
          name: "",
          brand: "Dwell Trends",
          mainCategory: "Women",
          subCategory: "Kurta Sets",
          description: "",
          price: "",
          mrp: "",
          fabric: "",
          work: "",
          dealType: "None",
          dealPrice: "",
        });
        setProductImages(null);
        loadData();
      }
    } catch (err) {
      alert("Error creating product");
    } finally {
      setLoading(false);
    }
  };

  // --- Bulk Deal Updater ---
  const handleApplyDeals = async () => {
    if (selectedProductIds.length === 0) {
      alert("Select at least one product.");
      return;
    }

    try {
      setLoading(true);
      const res = await endpoints.updateDealStatus({
        productIds: selectedProductIds,
        dealType: bulkDealType,
        dealPrice: bulkDealType === "None" ? null : Number(bulkDealPrice),
      });

      if (res.success) {
        alert("Deals updated successfully!");
        setSelectedProductIds([]);
        setBulkDealPrice("");
        loadData();
      }
    } catch (err) {
      alert("Failed to update deals");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-10 space-y-8">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold">Admin Operations</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage UTR verifications, catalog hierarchy, and flash promotional deals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === "orders" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
            }`}
          >
            <ShieldCheck className="h-4 w-4" /> Orders & UTRs
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === "products" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
            }`}
          >
            <Package className="h-4 w-4" /> Add Product
          </button>
          <button
            onClick={() => setActiveTab("deals")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === "deals" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
            }`}
          >
            <Flame className="h-4 w-4" /> Hot / Wow Deals
          </button>
        </div>
      </div>

      {/* --- TAB 1: ORDERS & UTR VERIFICATION --- */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Incoming Orders ({orders.length})
            </h2>
            <button
              onClick={loadData}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-semibold hover:bg-secondary"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>

          <div className="overflow-x-auto border border-border rounded-2xl bg-card">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Customer & Full Address</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Customer UTR Ref</th>
                  <th className="p-4">Tokens</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground text-xs">
                      {loading ? "Loading order records..." : "No orders found."}
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const addr = order.shippingAddress || {};
                    const isExpanded = expandedOrderId === order._id;

                    return (
                      <tr key={order._id} className="hover:bg-secondary/10 transition-colors align-top">
                        {/* 1. Order ID & Date */}
                        <td className="p-4 whitespace-nowrap space-y-1">
                          <span className="font-mono font-bold text-foreground">
                            #{order._id.slice(-6).toUpperCase()}
                          </span>
                          <span className="block text-[10px] text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString("en-IN")}
                          </span>
                          <button
                            onClick={() => toggleExpand(order._id)}
                            className="flex items-center gap-1 text-[10px] text-primary font-bold hover:underline pt-1"
                          >
                            <Eye className="h-3 w-3" /> {isExpanded ? "Hide Items" : `View Items (${order.items?.length || 0})`}
                          </button>
                        </td>

                        {/* 2. Customer Details & Full Address */}
                        <td className="p-4 min-w-[240px] space-y-1">
                          <p className="font-bold text-foreground text-xs">
                            {addr.fullName || order.user?.name || "Guest User"}
                          </p>

                          {/* Full House No., Street, City, State, PIN */}
                          <div className="flex items-start gap-1.5 text-[11px] text-foreground/85">
                            <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="leading-snug">{addr.street || "No street provided"}</p>
                              <p className="text-muted-foreground font-medium">
                                {addr.city ? `${addr.city}, ` : ""}{addr.state || ""} 
                                {addr.pinCode ? ` - ${addr.pinCode}` : ""}
                              </p>
                            </div>
                          </div>

                          {/* Contact Phone & Email */}
                          <div className="pt-1 flex flex-col gap-0.5 text-[10px] text-muted-foreground">
                            {(addr.phone || order.user?.phone) && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {addr.phone || order.user?.phone}
                              </span>
                            )}
                            {(addr.email || order.guestEmail || order.user?.email) && (
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {addr.email || order.guestEmail || order.user?.email}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 3. Amount */}
                        <td className="p-4 whitespace-nowrap">
                          <span className="font-bold text-foreground text-sm">₹{order.finalTotal}</span>
                          {order.tokensUsed > 0 && (
                            <p className="text-[10px] text-amber-700 font-semibold">
                              (Saved ₹{order.tokensUsed} tokens)
                            </p>
                          )}
                        </td>

                        {/* 4. Customer UTR */}
                        <td className="p-4">
                          {order.paymentUtr ? (
                            <span className="font-mono font-bold bg-secondary/80 px-2.5 py-1 rounded-md text-[11px] text-primary border border-border">
                              {order.paymentUtr}
                            </span>
                          ) : (
                            <span className="text-[11px] text-muted-foreground italic">Pending UTR</span>
                          )}
                        </td>

                        {/* 5. Tokens */}
                        <td className="p-4 whitespace-nowrap font-semibold text-primary">
                          +{order.tokensEarned || 0} tokens
                        </td>

                        {/* 6. Payment Status Dropdown */}
                        <td className="p-4 whitespace-nowrap">
                          <select
                            value={order.paymentStatus}
                            onChange={(e) => handleUpdateOrderStatus(order._id, order.orderStatus, e.target.value)}
                            className={`p-1.5 rounded-lg text-xs font-bold border outline-none ${
                              order.paymentStatus === "Paid"
                                ? "bg-green-500/10 text-green-700 border-green-500/30"
                                : "bg-amber-500/10 text-amber-700 border-amber-500/30"
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Failed">Failed</option>
                          </select>
                        </td>

                        {/* 7. Fulfillment Status Dropdown */}
                        <td className="p-4 whitespace-nowrap">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                            className="p-1.5 bg-secondary/50 border border-border rounded-lg text-xs font-semibold outline-none focus:border-primary"
                          >
                            <option value="Placed">Placed</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* 8. Action Buttons */}
                        <td className="p-4 text-right space-x-2 whitespace-nowrap">
                          {order.paymentStatus !== "Paid" && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order._id, "Confirmed", "Paid")}
                              className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-[11px] font-bold hover:bg-green-700 transition-colors"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => toggleExpand(order._id)}
                            className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground inline-flex items-center"
                            title="Expand Products"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Expandable Order Product Items Drawer */}
            {expandedOrderId && (
              <div className="border-t border-border bg-secondary/20 p-5 space-y-3">
                {(() => {
                  const current = orders.find((o) => o._id === expandedOrderId);
                  if (!current) return null;

                  return (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
                          Ordered Items for #{current._id.slice(-6).toUpperCase()}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          Shipping: {current.shippingFee === 0 ? "Free" : `₹${current.shippingFee}`}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {current.items?.map((item: any, i: number) => (
                          <div key={i} className="flex gap-3 p-3 bg-card border border-border rounded-xl">
                            <img
                              src={item.image}
                              alt=""
                              className="h-14 w-12 rounded-lg object-cover bg-secondary border border-border"
                            />
                            <div className="flex-1 min-w-0 text-xs">
                              <p className="font-bold truncate text-foreground">{item.name}</p>
                              <p className="text-[11px] text-muted-foreground">
                                Size: {item.selectedSize} · Colour: {item.selectedColour}
                              </p>
                              <p className="text-xs font-bold text-primary mt-1">
                                ₹{item.price} × {item.qty} = ₹{item.price * item.qty}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 2: PRODUCT CREATION --- */}
      {activeTab === "products" && (
        <form onSubmit={handleCreateProduct} className="max-w-2xl bg-card border border-border p-6 rounded-2xl space-y-4">
          <h2 className="font-display text-base font-bold">Add New Product to Catalog</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase text-muted-foreground">Product Title</label>
              <input
                type="text"
                required
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                placeholder="e.g. Embroidered Velvet Kurta Set"
                className="w-full mt-1 p-2.5 bg-secondary/30 border border-border rounded-xl text-xs outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase text-muted-foreground">Brand</label>
              <input
                type="text"
                value={productForm.brand}
                onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                placeholder="Dwell Trends"
                className="w-full mt-1 p-2.5 bg-secondary/30 border border-border rounded-xl text-xs outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase text-muted-foreground">Main Category (Myntra Tiers)</label>
              <select
                value={productForm.mainCategory}
                onChange={(e) => setProductForm({ ...productForm, mainCategory: e.target.value })}
                className="w-full mt-1 p-2.5 bg-secondary/30 border border-border rounded-xl text-xs outline-none focus:border-primary font-semibold"
              >
                <option value="Women">Women</option>
                <option value="Men">Men</option>
                <option value="Kids">Kids</option>
                <option value="Beauty">Beauty</option>
                <option value="Home">Home</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase text-muted-foreground">Sub-Category</label>
              <input
                type="text"
                required
                value={productForm.subCategory}
                onChange={(e) => setProductForm({ ...productForm, subCategory: e.target.value })}
                placeholder="e.g. Sarees, T-Shirts, Dresses"
                className="w-full mt-1 p-2.5 bg-secondary/30 border border-border rounded-xl text-xs outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase text-muted-foreground">Regular Selling Price (₹)</label>
              <input
                type="number"
                required
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                placeholder="499"
                className="w-full mt-1 p-2.5 bg-secondary/30 border border-border rounded-xl text-xs outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase text-muted-foreground">MRP (Crossed Out Price)</label>
              <input
                type="number"
                required
                value={productForm.mrp}
                onChange={(e) => setProductForm({ ...productForm, mrp: e.target.value })}
                placeholder="1999"
                className="w-full mt-1 p-2.5 bg-secondary/30 border border-border rounded-xl text-xs outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-muted-foreground">Description</label>
            <textarea
              rows={3}
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              placeholder="Provide product fabric details, fit, and style guidance..."
              className="w-full mt-1 p-2.5 bg-secondary/30 border border-border rounded-xl text-xs outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-muted-foreground">Product Images (Cloudinary)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setProductImages(e.target.files)}
              className="w-full mt-1 p-2 bg-secondary/30 border border-border rounded-xl text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-95 disabled:opacity-50"
          >
            {loading ? "Uploading to Catalog..." : "Create Product"}
          </button>
        </form>
      )}

      {/* --- TAB 3: DEAL & FLASH SALE ENGINE --- */}
      {activeTab === "deals" && (
        <div className="space-y-6">
          <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
            <h2 className="font-display text-base font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" /> Flipkart / Myntra Flash Deal Configurator
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase text-muted-foreground">Target Deal Type</label>
                <select
                  value={bulkDealType}
                  onChange={(e: any) => setBulkDealType(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-secondary/30 border border-border rounded-xl text-xs outline-none focus:border-primary font-semibold"
                >
                  <option value="Hot">🔥 Hot Deal (Card Tag)</option>
                  <option value="Wow">⚡ Wow Deal (Blue Banner & Discount)</option>
                  <option value="None">None (Remove Deal Status)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-muted-foreground">Override Deal Price (₹)</label>
                <input
                  type="number"
                  disabled={bulkDealType === "None"}
                  value={bulkDealPrice}
                  onChange={(e) => setBulkDealPrice(e.target.value)}
                  placeholder={bulkDealType === "None" ? "N/A" : "e.g. 299"}
                  className="w-full mt-1 p-2.5 bg-secondary/30 border border-border rounded-xl text-xs outline-none focus:border-primary disabled:opacity-50"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  disabled={loading || selectedProductIds.length === 0}
                  onClick={handleApplyDeals}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-95 disabled:opacity-50"
                >
                  Apply to {selectedProductIds.length} Products
                </button>
              </div>
            </div>
          </div>

          {/* Product Picker Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Select Products to Update Deals
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p) => {
                const isSelected = selectedProductIds.includes(p._id);
                return (
                  <div
                    key={p._id}
                    onClick={() => {
                      setSelectedProductIds((prev) =>
                        isSelected ? prev.filter((id) => id !== p._id) : [...prev, p._id]
                      );
                    }}
                    className={`cursor-pointer rounded-2xl border p-3 flex gap-3 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border bg-card hover:border-muted-foreground"
                    }`}
                  >
                    <img
                      src={p.images?.[0]?.url}
                      alt=""
                      className="h-16 w-14 rounded-lg object-cover bg-secondary"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground">{p.mainCategory} · {p.subCategory}</p>
                      <div className="flex items-baseline gap-1.5 mt-1">
                        <span className="text-xs font-bold text-primary">₹{p.price}</span>
                        {p.dealType !== "None" && (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                            {p.dealType} (₹{p.dealPrice})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}