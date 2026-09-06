import { useState } from "react";
import { CheckCircle2, Loader2, QrCode, ShieldCheck } from "lucide-react";

interface UpiProps {
  amount: number;
  onSuccess: (upiRefId: string) => void;
  onCancel: () => void;
}

export function UpiPaymentModal({ amount, onSuccess, onCancel }: UpiProps) {
  const [upiId, setUpiId] = useState("");
  const [selectedApp, setSelectedApp] = useState<string>("gpay");
  const [stage, setStage] = useState<"SELECT" | "PROCESSING" | "SUCCESS">("SELECT");

  const apps = [
    { id: "gpay", name: "Google Pay", icon: "🟢" },
    { id: "phonepe", name: "PhonePe", icon: "🟣" },
    { id: "paytm", name: "Paytm UPI", icon: "🔵" },
    { id: "custom", name: "Other UPI ID", icon: "⚡" },
  ];

  const handlePay = () => {
    setStage("PROCESSING");
    // Simulate real UPI authorization & handshake
    setTimeout(() => {
      setStage("SUCCESS");
      setTimeout(() => {
        const mockUpiRef = "UPI" + Math.floor(100000000 + Math.random() * 900000000);
        onSuccess(mockUpiRef);
      }, 1200);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Flipkart-Style Header */}
        <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-primary">UPI Payment</span>
          </div>
          <span className="text-sm font-bold text-foreground">₹{amount}</span>
        </div>

        <div className="p-6">
          {stage === "SELECT" && (
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Select your UPI App
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                {apps.map((app) => (
                  <label
                    key={app.id}
                    onClick={() => setSelectedApp(app.id)}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-all ${
                      selectedApp === app.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:bg-secondary/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{app.icon}</span>
                      <span className="text-xs font-bold text-foreground">{app.name}</span>
                    </div>
                    <input
                      type="radio"
                      name="upiApp"
                      checked={selectedApp === app.id}
                      onChange={() => setSelectedApp(app.id)}
                      className="accent-primary"
                    />
                  </label>
                ))}
              </div>

              {selectedApp === "custom" && (
                <div className="space-y-1 pt-2">
                  <input
                    type="text"
                    placeholder="Enter UPI ID (e.g. mobile@upi)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background p-3 text-xs outline-none focus:border-primary"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 pt-2 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span>100% Safe & Secure Payment via UPI</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-1/3 rounded-full border border-border py-3 text-xs font-semibold hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePay}
                  className="w-2/3 rounded-full bg-primary py-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:opacity-95"
                >
                  Pay ₹{amount}
                </button>
              </div>
            </div>
          )}

          {stage === "PROCESSING" && (
            <div className="space-y-4 py-8 text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              <h3 className="text-base font-bold">Requesting Payment</h3>
              <p className="text-xs text-muted-foreground">
                Please approve the payment request of ₹{amount} on your UPI App.
              </p>
            </div>
          )}

          {stage === "SUCCESS" && (
            <div className="space-y-3 py-8 text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />
              <h3 className="text-base font-bold text-green-700">Payment Received!</h3>
              <p className="text-xs text-muted-foreground">Generating your order receipt...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}