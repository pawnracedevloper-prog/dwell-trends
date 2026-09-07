import { useState, useEffect } from "react";
import { CheckCircle2, Loader2, Smartphone, ShieldCheck } from "lucide-react";

interface UpiProps {
  amount: number;
  orderId: string;
  onSuccess: (utrNumber: string) => void;
  onCancel: () => void;
}

export function UpiPaymentModal({ amount, orderId, onSuccess, onCancel }: UpiProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [stage, setStage] = useState<"PAY" | "CONFIRMING">("PAY");
  const [utrNumber, setUtrNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const MERCHANT_UPI_ID = "rishijyotisna@okicici";
  const MERCHANT_NAME = "Jyotisna Rishi";
  const TRANSACTION_REF = `DT_${orderId}`;

  const upiIntentUri = `upi://pay?pa=${MERCHANT_UPI_ID}&pn=${encodeURIComponent(
    MERCHANT_NAME
  )}&am=${amount}&cu=INR&tr=${TRANSACTION_REF}&tn=Order%20${orderId.slice(-6).toUpperCase()}`;

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent));
  }, []);

  const handleOpenUpiApp = (prefix?: string) => {
    let targetUri = upiIntentUri;
    if (prefix === "gpay") targetUri = `gpay://upi/pay?pa=${MERCHANT_UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amount}&cu=INR&tr=${TRANSACTION_REF}`;
    if (prefix === "phonepe") targetUri = `phonepe://pay?pa=${MERCHANT_UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amount}&cu=INR&tr=${TRANSACTION_REF}`;
    if (prefix === "paytm") targetUri = `paytmmp://pay?pa=${MERCHANT_UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amount}&cu=INR&tr=${TRANSACTION_REF}`;

    setStage("CONFIRMING");
    window.location.href = targetUri;
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    upiIntentUri
  )}`;

  const handleSubmitUtr = () => {
    if (!utrNumber.trim()) return;
    setSubmitting(true);
    onSuccess(utrNumber.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-6 py-4">
          <span className="font-display font-bold text-primary">UPI Payment</span>
          <span className="text-sm font-bold text-foreground">₹{amount}</span>
        </div>

        <div className="p-6 text-center">
          {stage === "PAY" ? (
            <div className="space-y-5">
              {isMobile ? (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground font-medium">Choose an app to pay:</p>
                  <div className="grid grid-cols-1 gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenUpiApp()}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-95"
                    >
                      <Smartphone className="h-4 w-4" /> Open Any UPI App
                    </button>
                    <div className="grid grid-cols-3 gap-2">
                      <button type="button" onClick={() => handleOpenUpiApp("gpay")} className="p-2.5 rounded-xl border border-border bg-secondary/40 text-[11px] font-bold">Google Pay</button>
                      <button type="button" onClick={() => handleOpenUpiApp("phonepe")} className="p-2.5 rounded-xl border border-border bg-secondary/40 text-[11px] font-bold">PhonePe</button>
                      <button type="button" onClick={() => handleOpenUpiApp("paytm")} className="p-2.5 rounded-xl border border-border bg-secondary/40 text-[11px] font-bold">Paytm</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">Scan with any UPI app</p>
                  <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-2xl border border-border bg-white p-2">
                    <img src={qrImageUrl} alt="UPI QR" className="h-full w-full object-contain" />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={onCancel} className="w-1/2 rounded-full border border-border py-2.5 text-xs font-semibold hover:bg-secondary">
                  Cancel
                </button>
                <button type="button" onClick={() => setStage("CONFIRMING")} className="w-1/2 rounded-full bg-secondary py-2.5 text-xs font-bold text-foreground">
                  I have Paid
                </button>
              </div>
            </div>
          ) : (
            /* Confirming / UTR Entry Screen */
            <div className="space-y-4 py-2">
              <ShieldCheck className="mx-auto h-10 w-10 text-primary" />
              <div>
                <h3 className="text-sm font-bold">Payment Verification</h3>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Enter the 12-digit <b>UPI Ref / UTR No.</b> from your payment receipt to verify:
                </p>
              </div>

              <input
                type="text"
                maxLength={16}
                placeholder="e.g. 423589123456"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                className="w-full p-3 bg-secondary/30 border border-border rounded-xl text-center font-mono font-bold text-xs tracking-widest outline-none focus:border-primary"
              />

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setStage("PAY")}
                  className="w-1/3 rounded-full border border-border py-2.5 text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={utrNumber.trim().length < 6 || submitting}
                  onClick={handleSubmitUtr}
                  className="w-2/3 py-2.5 bg-primary text-primary-foreground rounded-full text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit & Track"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}