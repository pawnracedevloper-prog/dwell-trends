import { useState, useEffect } from "react";
import { Check, Copy, Info, QrCode, ShieldCheck, Smartphone } from "lucide-react";

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
  const [copied, setCopied] = useState(false);

  const MERCHANT_UPI_ID = "rishijyotisna@okicici";
  const MERCHANT_NAME = "Dwell Trends";
  const TRANSACTION_REF = `DT_${orderId.slice(-8)}`;

  const upiIntentUri = `upi://pay?pa=${MERCHANT_UPI_ID}&pn=${encodeURIComponent(
    MERCHANT_NAME
  )}&am=${amount}&cu=INR&tr=${TRANSACTION_REF}&tn=${encodeURIComponent(
    `Order ${orderId.slice(-6).toUpperCase()}`
  )}`;

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent));
  }, []);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(MERCHANT_UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenUpiApp = (prefix?: string) => {
    let targetUri = upiIntentUri;
    if (prefix === "gpay") {
      targetUri = `gpay://upi/pay?pa=${MERCHANT_UPI_ID}&pn=${encodeURIComponent(
        MERCHANT_NAME
      )}&am=${amount}&cu=INR&tr=${TRANSACTION_REF}`;
    }
    if (prefix === "phonepe") {
      targetUri = `phonepe://pay?pa=${MERCHANT_UPI_ID}&pn=${encodeURIComponent(
        MERCHANT_NAME
      )}&am=${amount}&cu=INR&tr=${TRANSACTION_REF}`;
    }
    if (prefix === "paytm") {
      targetUri = `paytmmp://pay?pa=${MERCHANT_UPI_ID}&pn=${encodeURIComponent(
        MERCHANT_NAME
      )}&am=${amount}&cu=INR&tr=${TRANSACTION_REF}`;
    }

    setStage("CONFIRMING");
    window.location.href = targetUri;
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    upiIntentUri
  )}`;

  const handleSubmitUtr = () => {
    const cleanUtr = utrNumber.trim();
    if (cleanUtr.length < 12) {
      alert("Please enter a valid 12-digit UTR / UPI Reference Number.");
      return;
    }
    setSubmitting(true);
    onSuccess(cleanUtr);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="font-display font-bold text-foreground">UPI Payment</span>
          </div>
          <span className="text-sm font-bold text-primary">₹{amount}</span>
        </div>

        <div className="p-5 text-center">
          {stage === "PAY" ? (
            <div className="space-y-4">
              {/* Dynamic QR Code */}
              <div className="space-y-2">
                <p className="text-[11px] text-muted-foreground font-medium">
                  Scan QR with GPay, PhonePe, or Paytm
                </p>
                <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-2xl border border-border bg-white p-2.5 shadow-inner">
                  <img src={qrImageUrl} alt="UPI QR" className="h-full w-full object-contain" />
                </div>
              </div>

              {/* UPI ID Copy Field */}
              <div className="rounded-xl border border-border bg-secondary/20 p-2.5 flex items-center justify-between">
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">UPI ID</p>
                  <p className="text-xs font-bold text-foreground select-all">{MERCHANT_UPI_ID}</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="flex items-center gap-1 rounded-lg bg-background border border-border px-2.5 py-1 text-[11px] font-semibold text-primary hover:bg-secondary transition-colors"
                >
                  {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>

              {/* Mobile App Launchers */}
              {isMobile && (
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleOpenUpiApp()}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-95"
                  >
                    <Smartphone className="h-4 w-4" /> Open Installed UPI App
                  </button>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenUpiApp("gpay")}
                      className="p-2 rounded-lg border border-border bg-secondary/30 text-[11px] font-semibold hover:bg-secondary/60 transition-colors"
                    >
                      GPay
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenUpiApp("phonepe")}
                      className="p-2 rounded-lg border border-border bg-secondary/30 text-[11px] font-semibold hover:bg-secondary/60 transition-colors"
                    >
                      PhonePe
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenUpiApp("paytm")}
                      className="p-2 rounded-lg border border-border bg-secondary/30 text-[11px] font-semibold hover:bg-secondary/60 transition-colors"
                    >
                      Paytm
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-1/2 rounded-xl border border-border py-2.5 text-xs font-semibold hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setStage("CONFIRMING")}
                  className="w-1/2 rounded-xl bg-primary text-primary-foreground py-2.5 text-xs font-bold uppercase tracking-wider hover:opacity-95 transition-opacity"
                >
                  I Have Paid
                </button>
              </div>
            </div>
          ) : (
            /* UTR Verification Screen */
            <div className="space-y-4 py-2">
              <ShieldCheck className="mx-auto h-10 w-10 text-primary" />
              <div>
                <h3 className="text-sm font-bold">Payment Confirmation</h3>
                <div className="mt-2 flex items-start gap-1.5 text-[11px] text-amber-700 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 text-left">
                  <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <p>
                    Enter the <b>12-digit UTR / UPI Ref No.</b> from your banking app receipt:
                  </p>
                </div>
              </div>

              <input
                type="text"
                maxLength={12}
                placeholder="Enter 12-digit UTR"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ""))}
                className="w-full p-3 bg-secondary/30 border border-border rounded-xl text-center font-mono font-bold text-sm tracking-widest outline-none focus:border-primary"
              />

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setStage("PAY")}
                  className="w-1/3 rounded-xl border border-border py-2.5 text-xs font-semibold hover:bg-secondary transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={utrNumber.trim().length < 12 || submitting}
                  onClick={handleSubmitUtr}
                  className="w-2/3 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-50 hover:opacity-95 transition-all"
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