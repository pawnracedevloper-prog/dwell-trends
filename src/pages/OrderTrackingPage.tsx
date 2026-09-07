import { useEffect, useState } from "react";
import { useParams, Link } from "@tanstack/react-router";
import { endpoints } from "@/lib/endpoints";
import { CheckCircle2, Clock, Package, Truck, ArrowLeft } from "lucide-react";

export function OrderTrackingPage() {
  const { orderId } = useParams({ strict: false });
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const response = await endpoints.getOrderById(orderId);
        if (response.success) {
          setOrder(response.order);
        } else {
          setError(response.message || "Failed to load order.");
        }
      } catch (err: any) {
        setError(err.message || "Could not retrieve order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="container-page py-16 text-center text-sm text-muted-foreground">
        Loading order status...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container-page py-16 text-center space-y-4">
        <h2 className="text-lg font-bold text-destructive">Order Not Found</h2>
        <p className="text-xs text-muted-foreground">{error || "Invalid order reference."}</p>
        <Link to="/products" className="inline-flex items-center gap-2 text-xs font-semibold text-primary underline">
          <ArrowLeft className="h-4 w-4" /> Return to Shop
        </Link>
      </div>
    );
  }

  const steps = [
    { label: "Order Placed", status: "Processing", icon: Clock },
    { label: "Confirmed", status: "Confirmed", icon: Package },
    { label: "Shipped", status: "Shipped", icon: Truck },
    { label: "Delivered", status: "Delivered", icon: CheckCircle2 },
  ];

  const statusOrder = ["Processing", "Confirmed", "Shipped", "Delivered"];
  const currentStepIndex = statusOrder.indexOf(order.orderStatus);

  return (
    <div className="container-page max-w-3xl py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Tracking Order</span>
          <h1 className="font-display text-2xl font-bold mt-1">#{order._id.slice(-8).toUpperCase()}</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold">Payment:</span>
          <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
            order.paymentStatus === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
          }`}>
            {order.paymentStatus}
          </span>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">
          Delivery Status
        </h2>

        <div className="grid grid-cols-4 relative gap-2">
          {steps.map((step, index) => {
            const isCompleted = currentStepIndex >= index;
            const isCurrent = currentStepIndex === index;
            const Icon = step.icon;

            return (
              <div key={step.status} className="flex flex-col items-center text-center space-y-2 relative">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary text-muted-foreground border-border"
                  } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`text-[11px] font-semibold ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Items & Delivery Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Items List */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Items ({order.items.length})
          </h2>
          <div className="divide-y divide-border">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                <img src={item.image} alt={item.name} className="h-14 w-12 rounded-lg object-cover bg-secondary" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Size: {item.selectedSize} · Qty: {item.qty}
                  </p>
                  <p className="text-xs font-bold text-primary mt-1">₹{item.price * item.qty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Financial Breakdown */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Delivery Address
            </h2>
            <p className="text-xs font-semibold">{order.shippingAddress.fullName}</p>
            <p className="text-xs text-muted-foreground">{order.shippingAddress.street}</p>
            <p className="text-xs text-muted-foreground">
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Phone: {order.shippingAddress.phone}</p>
          </div>

          <div className="border-t border-border pt-4 space-y-1.5 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Items Total:</span>
              <span>₹{order.totalMrp}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Discount:</span>
                <span>-₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping Fee:</span>
              <span>{order.shippingFee === 0 ? "FREE" : `₹${order.shippingFee}`}</span>
            </div>
            <div className="flex justify-between font-bold text-sm pt-2 border-t border-border">
              <span>Total Paid:</span>
              <span className="text-primary">₹{order.finalTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}