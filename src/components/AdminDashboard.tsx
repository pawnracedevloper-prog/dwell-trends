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
  ChevronUp,
  Clock,
  Edit,
  Zap,
  Power
} from "lucide-react";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "deals" | "campaigns">("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
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

  // --- Grand Gala Campaign State (Create & Edit) ---
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);
  const [campaignForm, setCampaignForm] = useState({
    title: "Dwell Grand Gala",
    tagline: "Up to 70% Off on Handcrafted Silk & Festive Edit",
    badgeText: "GRAND BASH LIVE",
    themeColor: "#FF2A85",
    expiresAt: "",
    isActive: true,
  });
  const [campaignBanner, setCampaignBanner] = useState<File | null>(null);
  const [selectedCampaignProductIds, setSelectedCampaignProductIds] = useState<string[]>([]);
  const [campaignCustomPrices, setCampaignCustomPrices] = useState<{ [productId: string]: string }>({});

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes, campaignsRes] = await Promise.all([
        endpoints.getAllOrders?.() || endpoints.getMyOrders(),
        endpoints.getProducts({}),
        endpoints.getAllCampaigns?.() || Promise.resolve({ campaigns: [] }),
      ]);

      if (ordersRes?.orders) setOrders(ordersRes.orders);
      if (productsRes?.products) setProducts(productsRes.products);
      if (campaignsRes?.campaigns) setCampaigns(campaignsRes.campaigns);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Populate Campaign Form for Editing ---
  const handleEditCampaign = (campaign: any) => {
    setEditingCampaignId(campaign._id);
    setCampaignForm({
      title: campaign.title || "",
      tagline: campaign.tagline || "",
      badgeText: campaign.badgeText || "GRAND BASH LIVE",
      themeColor: campaign.themeColor || "#FF2A85",
      expiresAt: campaign.expiresAt ? new Date(campaign.expiresAt).toISOString().slice(0, 16) : "",
      isActive: campaign.isActive ?? true,
    });

    const selectedIds = (campaign.items || []).map((i: any) => i.product?._id || i.product);
    const customPrices: { [key: string]: string } = {};
    (campaign.items || []).forEach((i: any) => {
      const pId = i.product?._id || i.product;
      customPrices[pId] = String(i.eventPrice || "");
    });

    setSelectedCampaignProductIds(selectedIds);
    setCampaignCustomPrices(customPrices);
    setCampaignBanner(null);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- Reset Campaign Form ---
  const handleResetCampaignForm = () => {
    setEditingCampaignId(null);
    setCampaignForm({
      title: "Dwell Grand Gala",
      tagline: "Up to 70% Off on Handcrafted Silk & Festive Edit",
      badgeText: "GRAND BASH LIVE",
      themeColor: "#FF2A85",
      expiresAt: "",
      isActive: true,
    });
    setSelectedCampaignProductIds([]);
    setCampaignCustomPrices({});
    setCampaignBanner(null);
  };

  // --- Delete Campaign ---
  const handleDeleteCampaign = async (campaignId: string) => {
    if (!confirm("Are you sure you want to delete this campaign event? Product deal tags will also be reset.")) return;

    try {
      setLoading(true);
      await endpoints.deleteCampaign(campaignId);
      if (editingCampaignId === campaignId) handleResetCampaignForm();
      alert("Campaign deleted successfully");
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to delete campaign");
    } finally {
      setLoading(false);
    }
  };

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

  // --- Campaign Toggle Selection ---
  const handleToggleCampaignProduct = (product: any) => {
    const isSelected = selectedCampaignProductIds.includes(product._id);
    if (isSelected) {
      setSelectedCampaignProductIds((prev) => prev.filter((id) => id !== product._id));
      setCampaignCustomPrices((prev) => {
        const updated = { ...prev };
        delete updated[product._id];
        return updated;
      });
    } else {
      setSelectedCampaignProductIds((prev) => [...prev, product._id]);
      setCampaignCustomPrices((prev) => ({
        ...prev,
        [product._id]: String(product.dealPrice || product.price || ""),
      }));
    }
  };

  // --- Submit Campaign (Create or Update) ---
  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaignId && !campaignBanner) {
      alert("Please upload an event poster/banner");
      return;
    }

    if (selectedCampaignProductIds.length === 0) {
      alert("Select at least 1 product for this Gala Event");
      return;
    }

    const items = selectedCampaignProductIds.map((productId) => ({
      productId,
      eventPrice: Number(campaignCustomPrices[productId] || 0),
    }));

    const formData = new FormData();
    formData.append("title", campaignForm.title);
    formData.append("tagline", campaignForm.tagline);
    formData.append("badgeText", campaignForm.badgeText);
    formData.append("themeColor", campaignForm.themeColor);
    formData.append("isActive", String(campaignForm.isActive));
    if (campaignForm.expiresAt) formData.append("expiresAt", campaignForm.expiresAt);
    if (campaignBanner) formData.append("banner", campaignBanner);
    formData.append("itemsJson", JSON.stringify(items));

    try {
      setLoading(true);
      if (editingCampaignId) {
        await endpoints.updateCampaign(editingCampaignId, formData);
        alert("Campaign event updated successfully!");
      } else {
        await endpoints.createCampaign(formData);
        alert("🎉 Dwell Grand Gala created and published live!");
      }
      handleResetCampaignForm();
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to save campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-10 space-y-8 min-h-screen text-foreground">
      {/* Header & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight glam-gradient-text">
            Admin Operations
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Manage UTR verifications, catalog hierarchy, quick deals, and Grand Gala campaign events.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === "orders" 
                ? "bg-primary text-primary-foreground shadow-xs" 
                : "bg-card border border-border text-muted-foreground hover:text-rose-deep hover:bg-secondary/70"
            }`}
          >
            <ShieldCheck className="h-4 w-4 text-rose-deep" /> Orders & UTRs
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === "products" 
                ? "bg-primary text-primary-foreground shadow-xs" 
                : "bg-card border border-border text-muted-foreground hover:text-rose-deep hover:bg-secondary/70"
            }`}
          >
            <Package className="h-4 w-4 text-rose-deep" /> Add Product
          </button>
          <button
            onClick={() => setActiveTab("deals")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === "deals" 
                ? "bg-primary text-primary-foreground shadow-xs" 
                : "bg-card border border-border text-muted-foreground hover:text-rose-deep hover:bg-secondary/70"
            }`}
          >
            <Flame className="h-4 w-4 text-rose-deep" /> Hot / Wow Deals
          </button>
          <button
            onClick={() => setActiveTab("campaigns")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === "campaigns" 
                ? "bg-primary text-primary-foreground shadow-xs border border-rose-deep/30" 
                : "bg-card border border-border text-muted-foreground hover:text-rose-deep hover:bg-secondary/70"
            }`}
          >
            <Sparkles className="h-4 w-4 fill-rose-soft text-rose-soft animate-pulse" /> Dwell Grand Gala
          </button>
        </div>
      </div>

      {/* --- TAB 1: ORDERS & UTR VERIFICATION --- */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xs font-black uppercase tracking-widest text-rose-deep flex items-center gap-1.5">
              <span>✦</span> Incoming Orders ({orders.length})
            </h2>
            <button
              onClick={loadData}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-border bg-card rounded-xl text-xs font-bold text-foreground hover:border-rose-deep/40 hover:text-rose-deep transition-all shadow-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-rose-deep" : ""}`} /> Refresh
            </button>
          </div>

          <div className="overflow-x-auto border border-border rounded-3xl bg-card shadow-card backdrop-blur-md">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/60 text-muted-foreground uppercase text-[10px] tracking-widest border-b border-border">
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
              <tbody className="divide-y divide-border/70">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground text-xs font-medium">
                      {loading ? "Loading order records..." : "No orders found."}
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const addr = order.shippingAddress || {};
                    const isExpanded = expandedOrderId === order._id;

                    return (
                      <tr key={order._id} className="hover:bg-secondary/30 transition-colors align-top">
                        <td className="p-4 whitespace-nowrap space-y-1">
                          <span className="font-mono font-black text-rose-deep">
                            #{order._id.slice(-6).toUpperCase()}
                          </span>
                          <span className="block text-[10px] text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString("en-IN")}
                          </span>
                          <button
                            onClick={() => toggleExpand(order._id)}
                            className="flex items-center gap-1 text-[10px] text-rose-deep font-bold hover:underline pt-1"
                          >
                            <Eye className="h-3 w-3" /> {isExpanded ? "Hide Items" : `View Items (${order.items?.length || 0})`}
                          </button>
                        </td>

                        <td className="p-4 min-w-[240px] space-y-1">
                          <p className="font-bold text-foreground text-xs">
                            {addr.fullName || order.user?.name || "Guest User"}
                          </p>
                          <div className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 text-rose-deep shrink-0 mt-0.5" />
                            <div>
                              <p className="leading-snug text-foreground/90">{addr.street || "No street provided"}</p>
                              <p className="text-[10px] text-muted-foreground">
                                {addr.city ? `${addr.city}, ` : ""}{addr.state || ""} 
                                {addr.pinCode ? ` - ${addr.pinCode}` : ""}
                              </p>
                            </div>
                          </div>
                          <div className="pt-1 flex flex-col gap-0.5 text-[10px] text-muted-foreground">
                            {(addr.phone || order.user?.phone) && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-rose-deep" /> {addr.phone || order.user?.phone}
                              </span>
                            )}
                            {(addr.email || order.guestEmail || order.user?.email) && (
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3 text-rose-deep" /> {addr.email || order.guestEmail || order.user?.email}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-4 whitespace-nowrap">
                          <span className="font-black text-foreground text-sm">₹{order.finalTotal}</span>
                          {order.tokensUsed > 0 && (
                            <p className="text-[10px] text-rose-deep font-bold">
                              (Saved ₹{order.tokensUsed} tokens)
                            </p>
                          )}
                        </td>

                        <td className="p-4">
                          {order.paymentUtr ? (
                            <span className="font-mono font-black bg-secondary px-2.5 py-1 rounded-lg text-[11px] text-rose-deep border border-rose-deep/20 shadow-xs">
                              {order.paymentUtr}
                            </span>
                          ) : (
                            <span className="text-[11px] text-muted-foreground italic">Pending UTR</span>
                          )}
                        </td>

                        <td className="p-4 whitespace-nowrap font-bold text-rose-deep">
                          +{order.tokensEarned || 0} tokens
                        </td>

                        <td className="p-4 whitespace-nowrap">
                          <select
                            value={order.paymentStatus}
                            onChange={(e) => handleUpdateOrderStatus(order._id, order.orderStatus, e.target.value)}
                            className={`p-1.5 rounded-xl text-xs font-bold border outline-none bg-card ${
                              order.paymentStatus === "Paid"
                                ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
                                : "text-amber-600 border-amber-500/30 bg-amber-500/10"
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Failed">Failed</option>
                          </select>
                        </td>

                        <td className="p-4 whitespace-nowrap">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                            className="p-1.5 bg-background border border-border rounded-xl text-xs font-semibold text-foreground outline-none focus:border-rose-deep"
                          >
                            <option value="Placed">Placed</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="p-4 text-right space-x-2 whitespace-nowrap">
                          {order.paymentStatus !== "Paid" && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order._id, "Confirmed", "Paid")}
                              className="px-3 py-1.5 bg-primary text-primary-foreground rounded-xl text-[11px] font-black uppercase tracking-wider hover:opacity-90 transition-all shadow-xs"
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

            {expandedOrderId && (
              <div className="border-t border-border bg-secondary/30 p-5 space-y-3">
                {(() => {
                  const current = orders.find((o) => o._id === expandedOrderId);
                  if (!current) return null;

                  return (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
                          <span>✦</span> Ordered Items for #{current._id.slice(-6).toUpperCase()}
                        </h4>
                        <span className="text-xs text-rose-deep font-bold">
                          Shipping: {current.shippingFee === 0 ? "Free" : `₹${current.shippingFee}`}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {current.items?.map((item: any, i: number) => (
                          <div key={i} className="flex gap-3 p-3 bg-card border border-border rounded-2xl shadow-xs">
                            <img
                              src={item.image}
                              alt=""
                              className="h-14 w-12 rounded-xl object-cover bg-background border border-border shrink-0"
                            />
                            <div className="flex-1 min-w-0 text-xs">
                              <p className="font-bold truncate text-foreground">{item.name}</p>
                              <p className="text-[10px] text-muted-foreground">
                                Size: <span className="font-bold text-rose-deep">{item.selectedSize}</span> · Colour: <span className="font-bold text-rose-deep">{item.selectedColour}</span>
                              </p>
                              <p className="text-xs font-black text-primary mt-1">
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
        <form onSubmit={handleCreateProduct} className="max-w-2xl bg-card border border-border p-6 sm:p-7 rounded-3xl space-y-4.5 shadow-card backdrop-blur-md">
          <h2 className="font-display text-base font-black uppercase tracking-wider glam-gradient-text flex items-center gap-1.5">
            <span>✦</span> Add New Product to Catalog
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-rose-deep">Product Title</label>
              <input
                type="text"
                required
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                placeholder="e.g. Metallic Pink Silk Anarkali Set"
                className="w-full mt-1 p-2.5 bg-background border border-border rounded-xl text-xs text-foreground outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/15 transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-rose-deep">Brand</label>
              <input
                type="text"
                value={productForm.brand}
                onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                placeholder="Dwell Trends"
                className="w-full mt-1 p-2.5 bg-background border border-border rounded-xl text-xs text-foreground outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/15 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-rose-deep">Main Category</label>
              <select
                value={productForm.mainCategory}
                onChange={(e) => setProductForm({ ...productForm, mainCategory: e.target.value })}
                className="w-full mt-1 p-2.5 bg-background border border-border rounded-xl text-xs text-foreground outline-none focus:border-rose-deep font-semibold"
              >
                <option value="Women">Women</option>
                <option value="Men">Men</option>
                <option value="Kids">Kids</option>
                <option value="Beauty">Beauty</option>
                <option value="Home">Home</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-rose-deep">Sub-Category</label>
              <input
                type="text"
                required
                value={productForm.subCategory}
                onChange={(e) => setProductForm({ ...productForm, subCategory: e.target.value })}
                placeholder="e.g. Suits, Kurtis, Sarees"
                className="w-full mt-1 p-2.5 bg-background border border-border rounded-xl text-xs text-foreground outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/15 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-rose-deep">Regular Selling Price (₹)</label>
              <input
                type="number"
                required
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                placeholder="499"
                className="w-full mt-1 p-2.5 bg-background border border-border rounded-xl text-xs text-foreground outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/15 transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-rose-deep">MRP (Crossed Out Price)</label>
              <input
                type="number"
                required
                value={productForm.mrp}
                onChange={(e) => setProductForm({ ...productForm, mrp: e.target.value })}
                placeholder="1999"
                className="w-full mt-1 p-2.5 bg-background border border-border rounded-xl text-xs text-foreground outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/15 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-rose-deep">Description</label>
            <textarea
              rows={3}
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              placeholder="Provide product fabric details, fit, and style guidance..."
              className="w-full mt-1 p-2.5 bg-background border border-border rounded-xl text-xs text-foreground outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/15 transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-rose-deep">Product Images (Cloudinary)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setProductImages(e.target.files)}
              className="w-full mt-1 p-2 bg-background border border-border rounded-xl text-xs text-muted-foreground file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary file:text-primary-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary text-primary-foreground rounded-full text-xs font-black uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all shadow-card"
          >
            {loading ? "Uploading to Catalog..." : "Create Product"}
          </button>
        </form>
      )}

      {/* --- TAB 3: DEAL & FLASH SALE ENGINE --- */}
      {activeTab === "deals" && (
        <div className="space-y-6">
          <div className="bg-card border border-border p-6 rounded-3xl space-y-4 shadow-card backdrop-blur-md">
            <h2 className="font-display text-base font-black uppercase tracking-wider text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-rose-deep fill-rose-deep animate-pulse" /> Quick Flash Deal Configurator
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-rose-deep">Target Deal Type</label>
                <select
                  value={bulkDealType}
                  onChange={(e: any) => setBulkDealType(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-background border border-border rounded-xl text-xs text-foreground outline-none focus:border-rose-deep font-semibold"
                >
                  <option value="Hot">🔥 Hot Deal (Card Tag)</option>
                  <option value="Wow">⚡ Wow Deal (Badge & Discount)</option>
                  <option value="None">None (Remove Deal Status)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-rose-deep">Override Deal Price (₹)</label>
                <input
                  type="number"
                  disabled={bulkDealType === "None"}
                  value={bulkDealPrice}
                  onChange={(e) => setBulkDealPrice(e.target.value)}
                  placeholder={bulkDealType === "None" ? "N/A" : "e.g. 299"}
                  className="w-full mt-1 p-2.5 bg-background border border-border rounded-xl text-xs text-foreground outline-none focus:border-rose-deep disabled:opacity-40"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  disabled={loading || selectedProductIds.length === 0}
                  onClick={handleApplyDeals}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-full text-xs font-black uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all shadow-card"
                >
                  Apply to {selectedProductIds.length} Products
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-rose-deep flex items-center gap-1.5">
              <span>✦</span> Select Products to Update Deals
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
                        ? "border-rose-deep bg-secondary ring-2 ring-rose-deep/20 shadow-xs"
                        : "border-border bg-card hover:border-rose-deep/40"
                    }`}
                  >
                    <img
                      src={p.images?.[0]?.url || p.images?.[0] || ""}
                      alt=""
                      className="h-16 w-14 rounded-xl object-cover bg-background shrink-0 border border-border"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate text-foreground">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground">{p.mainCategory} · {p.subCategory}</p>
                      <div className="flex items-baseline gap-1.5 mt-1">
                        <span className="text-xs font-black text-primary">₹{p.price}</span>
                        {p.dealType !== "None" && (
                          <span className="text-[9px] font-black uppercase tracking-wider text-rose-deep bg-secondary border border-rose-deep/25 px-1.5 py-0.5 rounded-md">
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

      {/* --- TAB 4: DWELL GRAND GALA (CREATE, EDIT, TIMING & DELETE MANAGER) --- */}
      {activeTab === "campaigns" && (
        <div className="space-y-8">
          {/* Active Campaigns Management List */}
          <div className="bg-card border border-border p-6 rounded-3xl space-y-4 shadow-card backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-base font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-rose-deep fill-rose-deep animate-pulse" /> Existing Grand Gala Campaigns ({campaigns.length})
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                  View, edit details/timing, or delete running Gala events.
                </p>
              </div>
              {editingCampaignId && (
                <button
                  type="button"
                  onClick={handleResetCampaignForm}
                  className="px-3.5 py-1.5 bg-secondary border border-border text-xs font-bold rounded-xl hover:bg-secondary/70 text-foreground"
                >
                  + Create New Gala Instead
                </button>
              )}
            </div>

            {campaigns.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-2xl font-medium">
                No campaigns created yet. Build your first Grand Gala below!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campaigns.map((camp) => (
                  <div
                    key={camp._id}
                    className={`border rounded-2xl p-4 flex gap-4 bg-background backdrop-blur-md transition-all ${
                      camp._id === editingCampaignId 
                        ? "border-rose-deep ring-2 ring-rose-deep/20 bg-secondary/50 shadow-xs" 
                        : "border-border hover:border-rose-deep/40"
                    }`}
                  >
                    <img
                      src={camp.bannerImage?.url}
                      alt=""
                      className="w-24 h-20 rounded-xl object-cover bg-card shrink-0 border border-border"
                    />
                    <div className="flex-1 min-w-0 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold truncate text-foreground">{camp.title}</span>
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            camp.isActive ? "bg-secondary text-rose-deep border border-rose-deep/20" : "bg-card text-muted-foreground border border-border"
                          }`}
                        >
                          {camp.isActive ? "Live Hero" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{camp.tagline}</p>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground pt-1">
                        <span className="font-bold text-rose-deep">{camp.items?.length || 0} Products</span>
                        {camp.expiresAt && (
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="h-3 w-3 text-rose-deep" /> {new Date(camp.expiresAt).toLocaleDateString("en-IN")}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => handleEditCampaign(camp)}
                          className="px-2.5 py-1 bg-secondary text-rose-deep hover:bg-secondary/80 rounded-lg text-[11px] font-bold flex items-center gap-1 border border-rose-deep/20"
                        >
                          <Edit className="h-3 w-3" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCampaign(camp._id)}
                          className="px-2.5 py-1 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg text-[11px] font-bold flex items-center gap-1 border border-destructive/20"
                        >
                          <Trash2 className="h-3 w-3" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Campaign Form (Create & Update) */}
          <form onSubmit={handleSaveCampaign} className="space-y-8">
            <div className="bg-card border border-border p-6 rounded-3xl space-y-6 shadow-card backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-base font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                    <Zap className="h-5 w-5 fill-rose-deep text-rose-deep" />
                    {editingCampaignId ? "Edit Dwell Grand Gala Event" : "Create New Dwell Grand Gala Event"}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                    {editingCampaignId ? "Modifying existing campaign attributes and timing." : "Design a promotional poster and assign event prices."}
                  </p>
                </div>
                {editingCampaignId && (
                  <span className="bg-secondary text-rose-deep text-xs font-black px-3 py-1 rounded-full border border-rose-deep/20 uppercase tracking-wider">
                    Editing Mode
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-rose-deep">Event Title</label>
                  <input
                    type="text"
                    required
                    value={campaignForm.title}
                    onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
                    placeholder="Dwell Grand Gala"
                    className="w-full mt-1 p-2.5 bg-background border border-border rounded-xl text-xs text-foreground outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/15 transition-all font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-rose-deep">Badge Text</label>
                  <input
                    type="text"
                    required
                    value={campaignForm.badgeText}
                    onChange={(e) => setCampaignForm({ ...campaignForm, badgeText: e.target.value })}
                    placeholder="GRAND BASH LIVE"
                    className="w-full mt-1 p-2.5 bg-background border border-border rounded-xl text-xs text-foreground outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/15 transition-all font-bold uppercase tracking-wider"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-rose-deep">Expiry / Countdown Timing</label>
                  <input
                    type="datetime-local"
                    value={campaignForm.expiresAt}
                    onChange={(e) => setCampaignForm({ ...campaignForm, expiresAt: e.target.value })}
                    className="w-full mt-1 p-2.5 bg-background border border-border rounded-xl text-xs text-foreground outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/15 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-rose-deep">Tagline / Promo Subtitle</label>
                <input
                  type="text"
                  required
                  value={campaignForm.tagline}
                  onChange={(e) => setCampaignForm({ ...campaignForm, tagline: e.target.value })}
                  placeholder="Up to 70% Off on Handcrafted Silk & Festive Edit"
                  className="w-full mt-1 p-2.5 bg-background border border-border rounded-xl text-xs text-foreground outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/15 transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-rose-deep">
                  Event Promotional Poster / Banner {editingCampaignId ? "(Optional: leave blank to keep current)" : "(Cloudinary)"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCampaignBanner(e.target.files?.[0] || null)}
                  className="w-full mt-1 p-2.5 bg-background border border-border rounded-xl text-xs text-muted-foreground file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary file:text-primary-foreground"
                />
              </div>
            </div>

            {/* Product Multi-Picker with Custom Price Per Dress */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
                    <span>✦</span> Select Event Dresses & Assign Special Gala Prices
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium">
                    {selectedCampaignProductIds.length} styles selected for this campaign
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {editingCampaignId && (
                    <button
                      type="button"
                      onClick={handleResetCampaignForm}
                      className="px-4 py-2.5 bg-card text-foreground rounded-full text-xs font-bold hover:bg-secondary border border-border"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading || selectedCampaignProductIds.length === 0}
                    className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-xs font-black uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all shadow-card flex items-center gap-1.5"
                  >
                    <Zap className="h-4 w-4 fill-rose-soft text-rose-soft" />
                    {loading ? "Saving..." : editingCampaignId ? `Update Gala (${selectedCampaignProductIds.length} Items)` : `Launch Gala (${selectedCampaignProductIds.length} Items)`}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((p) => {
                  const isSelected = selectedCampaignProductIds.includes(p._id);
                  return (
                    <div
                      key={p._id}
                      className={`rounded-2xl border p-4 flex flex-col justify-between gap-3 transition-all ${
                        isSelected
                          ? "border-rose-deep bg-secondary ring-2 ring-rose-deep/20 shadow-xs"
                          : "border-border bg-card hover:border-rose-deep/40"
                      }`}
                    >
                      <div className="flex gap-3">
                        <img
                          src={p.images?.[0]?.url || p.images?.[0] || ""}
                          alt=""
                          className="h-16 w-14 rounded-xl object-cover bg-background border border-border shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate text-foreground">{p.name}</p>
                          <p className="text-[10px] text-muted-foreground">{p.mainCategory} · {p.subCategory}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                            Standard MRP: ₹{p.mrp || p.price}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black uppercase tracking-wider text-rose-deep">Include in Gala</label>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleCampaignProduct(p)}
                            className="h-4 w-4 accent-[#FF2A85] rounded border-border"
                          />
                        </div>

                        {isSelected && (
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-wider text-rose-deep block">
                              Gala Special Price (₹)
                            </label>
                            <input
                              type="number"
                              required
                              value={campaignCustomPrices[p._id] || ""}
                              onChange={(e) =>
                                setCampaignCustomPrices({
                                  ...campaignCustomPrices,
                                  [p._id]: e.target.value,
                                })
                              }
                              placeholder="e.g. 499"
                              className="w-full mt-1 p-2 bg-background border border-border rounded-lg text-xs font-black text-primary outline-none focus:border-rose-deep"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}