import { useEffect, useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { endpoints } from "@/lib/endpoints";
import { Package, Truck, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const statusSteps = [
  { label: "Processing", icon: Clock },
  { label: "Confirmed", icon: Package },
  { label: "Shipped", icon: Truck },
  { label: "Delivered", icon: CheckCircle2 },
];

export function OrderTrackingPage() {
  const { orderId } = useParams({ strict: false }) as { orderId: string };
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;

    endpoints.getOrderById(orderId)
      .then((data) => {
        if (data.success) {
          setOrder(data.order);
        } else {
          setError(data.message || "Failed to load order details");
        }
      })
      .catch((err) => setError(err.message || "Something went wrong"))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return <div className="container-page py-20 text-center text-xs">Loading order tracking...</div>;
  }

  if (error || !order) {
    return (
      <div className="container-page py-20 text-center space-y-4 max-w-md mx-auto">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <h2 className="font-display text-xl font-bold">Order Not Found</h2>
        <p className="text-xs text-muted-foreground">{error || "Unable to find the requested order."}</p>
        <button
          onClick={() => navigate({ to: "/" })}
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold"
        >
          Return Home
        </button>
      </div>
    );
  }

  const currentStepIdx = statusSteps.findIndex((s) => s.label === order.orderStatus);

  return (
    <div className="container-page py-10 max-w-3xl mx-auto space-y-8">
      {/* Header Info */}
      <div className="flex flex-wrap justify-between items-end border-b border-border pb-6 gap-4">
        <div>
          <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">Tracking Details</span>
          <h1 className="font-display text-2xl font-bold">Order #{order._id}</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-muted-foreground">Payment Status</span>
          <p className="text-sm font-bold text-foreground">{order.paymentStatus} ({order.paymentMethod.toUpperCase()})</p>
        </div>
      </div>

      {/* Progress Timeline */}
      {order.orderStatus === "Cancelled" ? (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-xs font-semibold text-center">
          This order has been cancelled.
        </div>
      ) : (
        <div className="py-4">
          <div className="grid grid-cols-4 gap-2">
            {statusSteps.map((step, idx) => {
              const Icon = step.icon;
              const isPassed = idx <= currentStepIdx;
              return (
                <div key={step.label} className="flex flex-col items-center text-center space-y-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isPassed ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={`text-[11px] ${isPassed ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                    {step.label}
                  </span>
                  <div className={`h-1.5 w-full rounded-full ${isPassed ? "bg-primary" : "bg-secondary"}`} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Items Breakdown */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h3 className="font-display text-base font-bold">Ordered Items</h3>
        <div className="divide-y divide-border">
          {order.items.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
              <img src={item.image} alt={item.name} className="w-14 h-18 object-cover rounded-lg bg-secondary/30" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{item.name}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Size: {item.selectedSize} · Colour: {item.selectedColour} · Qty: {item.qty}
                </p>
              </div>
              <p className="text-xs font-bold text-foreground">₹{item.price * item.qty}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping & Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 space-y-2 text-xs">
          <h3 className="font-display text-base font-bold mb-3">Delivery Address</h3>
          <p className="font-semibold">{order.shippingAddress.fullName}</p>
          <p className="text-muted-foreground">{order.shippingAddress.street}</p>
          <p className="text-muted-foreground">
            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}
          </p>
          <p className="text-muted-foreground pt-1">Phone: {order.shippingAddress.phone}</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-2 text-xs">
          <h3 className="font-display text-base font-bold mb-3">Price Details</h3>
          <div className="flex justify-between text-muted-foreground"><span>Total MRP</span><span>₹{order.totalMrp}</span></div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-600 font-medium"><span>Discount</span><span>-₹{order.discount}</span></div>
          )}
          <div className="flex justify-between text-muted-foreground"><span>Shipping Fee</span><span>₹{order.shippingFee}</span></div>
          <div className="flex justify-between font-bold text-sm pt-2 border-t border-border text-foreground">
            <span>Total Paid</span>
            <span className="text-primary">₹{order.finalTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}