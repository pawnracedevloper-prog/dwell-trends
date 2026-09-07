import { useState, useEffect } from "react";
import { CheckCircle2, Loader2, Smartphone } from "lucide-react";

interface UpiProps {
  amount: number;
  orderId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function UpiPaymentModal({ amount, orderId, onSuccess, onCancel }: UpiProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [stage, setStage] = useState<"PAY" | "CONFIRMING">("PAY");

  const MERCHANT_UPI_ID = "rishijyotisna@okicici"; 
  const MERCHANT_NAME = "Jyotisna Rishi";
  const TRANSACTION_REF = `DT_${orderId}`;

  // Standard NPCI UPI URI Specification
  const upiIntentUri = `upi://pay?pa=${MERCHANT_UPI_ID}&pn=${encodeURIComponent(
    MERCHANT_NAME
  )}&am=${amount}&cu=INR&tr=${TRANSACTION_REF}&tn=Order%20${orderId.slice(-6).toUpperCase()}`;

  useEffect(() => {
    // Detect if user is browsing from mobile
    const checkMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
    setIsMobile(checkMobile);
  }, []);

  const handleOpenUpiApp = (appSpecificPrefix?: string) => {
    let targetUri = upiIntentUri;

    // Optional direct app intent schemes
    if (appSpecificPrefix === "gpay") {
      targetUri = `gpay://upi/pay?pa=${MERCHANT_UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amount}&cu=INR&tr=${TRANSACTION_REF}`;
    } else if (appSpecificPrefix === "phonepe") {
      targetUri = `phonepe://pay?pa=${MERCHANT_UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amount}&cu=INR&tr=${TRANSACTION_REF}`;
    } else if (appSpecificPrefix === "paytm") {
      targetUri = `paytmmp://pay?pa=${MERCHANT_UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amount}&cu=INR&tr=${TRANSACTION_REF}`;
    }

    setStage("CONFIRMING");
    window.location.href = targetUri;
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    upiIntentUri
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-6 py-4">
          <span className="font-display font-bold text-primary">UPI Payment</span>
          <span className="text-sm font-bold text-foreground">₹{amount}</span>
        </div>

        <div className="p-6 text-center">
          {stage === "PAY" ? (
            <div className="space-y-5">
              {isMobile ? (
                /* Mobile: One-Tap App Chooser */
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground font-medium">
                    Choose an app to complete the payment:
                  </p>

                  <div className="grid grid-cols-1 gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenUpiApp()}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-95 transition-all"
                    >
                      <Smartphone className="h-4 w-4" /> Open Any UPI App
                    </button>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleOpenUpiApp("gpay")}
                        className="p-2.5 rounded-xl border border-border bg-secondary/40 text-[11px] font-bold hover:bg-secondary flex flex-col items-center gap-1"
                      >
                        <span>Google Pay</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenUpiApp("phonepe")}
                        className="p-2.5 rounded-xl border border-border bg-secondary/40 text-[11px] font-bold hover:bg-secondary flex flex-col items-center gap-1"
                      >
                        <span>PhonePe</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenUpiApp("paytm")}
                        className="p-2.5 rounded-xl border border-border bg-secondary/40 text-[11px] font-bold hover:bg-secondary flex flex-col items-center gap-1"
                      >
                        <span>Paytm</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Desktop: Dynamic QR Code */
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">
                    Scan with GPay, PhonePe, Paytm or BHIM
                  </p>
                  <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-2xl border border-border bg-white p-2 shadow-inner">
                    <img src={qrImageUrl} alt="UPI QR Code" className="h-full w-full object-contain" />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-1/2 rounded-full border border-border py-2.5 text-xs font-semibold hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onSuccess}
                  className="w-1/2 rounded-full bg-secondary py-2.5 text-xs font-bold text-foreground hover:bg-secondary/80"
                >
                  I have Paid
                </button>
              </div>
            </div>
          ) : (
            /* Confirming State */
            <div className="space-y-4 py-6">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
              <h3 className="text-sm font-bold">Completing Transaction</h3>
              <p className="text-xs text-muted-foreground">
                Return here after completing payment in your UPI app.
              </p>

              <button
                type="button"
                onClick={onSuccess}
                className="w-full py-3 bg-primary text-primary-foreground rounded-full text-xs font-bold uppercase tracking-wider"
              >
                Confirm & View Tracking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}