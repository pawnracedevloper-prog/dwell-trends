import { useState, useEffect } from "react";
import { Check, Copy, Info, ShieldCheck, Smartphone, Sparkles, ArrowRight } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm text-foreground animate-in fade-in-50 duration-200">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-border/80 bg-card shadow-2xl">
        {/* Ambient Subtle Pink Accent */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-rose-deep/15 blur-3xl" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-border bg-secondary/50 px-5 py-3.5 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-card text-rose-deep border border-rose-deep/20 shadow-xs">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="font-display text-sm font-black uppercase tracking-wider text-foreground">
              UPI Instant Gateway
            </span>
          </div>
          <span className="text-sm font-black text-primary">₹{amount}</span>
        </div>

        <div className="relative z-10 p-5 text-center">
          {stage === "PAY" ? (
            <div className="space-y-4">
              {/* Dynamic QR Code */}
              <div className="space-y-2">
                <p className="text-[11px] text-muted-foreground font-medium">
                  Scan QR with GPay, PhonePe, Paytm, or Any UPI App
                </p>
                <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-2xl border border-border bg-white p-2.5 shadow-card">
                  <img src={qrImageUrl} alt="UPI QR" className="h-full w-full object-contain" />
                </div>
              </div>

              {/* UPI ID Copy Field */}
              <div className="rounded-2xl border border-border bg-background p-3 flex items-center justify-between shadow-xs">
                <div className="text-left">
                  <p className="text-[10px] uppercase font-black text-rose-deep tracking-wider">Merchant UPI ID</p>
                  <p className="text-xs font-bold text-foreground select-all font-mono">{MERCHANT_UPI_ID}</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="flex items-center gap-1 rounded-xl bg-secondary border border-rose-deep/20 px-3 py-1.5 text-[11px] font-black text-rose-deep hover:bg-secondary/80 transition-all shadow-xs"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>

              {/* Mobile App Launchers */}
              {isMobile && (
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleOpenUpiApp()}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-full text-xs font-black uppercase tracking-widest shadow-card hover:opacity-90 active:scale-95 transition-all"
                  >
                    <Smartphone className="h-4 w-4" /> Open Installed UPI App
                  </button>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenUpiApp("gpay")}
                      className="p-2 rounded-xl border border-border bg-card text-[11px] font-bold text-foreground hover:bg-secondary hover:text-rose-deep hover:border-rose-deep/30 transition-all shadow-xs"
                    >
                      GPay
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenUpiApp("phonepe")}
                      className="p-2 rounded-xl border border-border bg-card text-[11px] font-bold text-foreground hover:bg-secondary hover:text-rose-deep hover:border-rose-deep/30 transition-all shadow-xs"
                    >
                      PhonePe
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenUpiApp("paytm")}
                      className="p-2 rounded-xl border border-border bg-card text-[11px] font-bold text-foreground hover:bg-secondary hover:text-rose-deep hover:border-rose-deep/30 transition-all shadow-xs"
                    >
                      Paytm
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-1/2 rounded-full border border-border py-2.5 text-xs font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setStage("CONFIRMING")}
                  className="w-1/2 rounded-full bg-primary text-primary-foreground py-2.5 text-xs font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-card flex items-center justify-center gap-1"
                >
                  <span>I Have Paid</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* UTR Verification Screen */
            <div className="space-y-4 py-2">
              <div className="h-14 w-14 rounded-2xl bg-secondary text-rose-deep flex items-center justify-center mx-auto border border-rose-deep/30 glam-glow shadow-xs">
                <ShieldCheck className="h-7 w-7" />
              </div>

              <div>
                <h3 className="font-display text-base font-black text-foreground">Verify UTR Number</h3>
                <div className="mt-2.5 flex items-start gap-2 text-[11px] text-rose-deep bg-secondary p-3 rounded-2xl border border-rose-deep/25 text-left font-medium">
                  <Info className="h-4 w-4 shrink-0 mt-0.5 text-rose-deep" />
                  <p className="leading-relaxed">
                    Enter the <b>12-digit UPI Ref / UTR No.</b> shown on your payment receipt to link your order.
                  </p>
                </div>
              </div>

              <input
                type="text"
                maxLength={12}
                placeholder="Enter 12-digit UTR"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ""))}
                className="w-full p-3.5 bg-background border border-border rounded-2xl text-center font-mono font-black text-sm tracking-widest outline-none focus:border-rose-deep focus:ring-4 focus:ring-rose-deep/15 transition-all text-foreground placeholder:text-muted-foreground"
              />

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setStage("PAY")}
                  className="w-1/3 rounded-full border border-border py-2.5 text-xs font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={utrNumber.trim().length < 12 || submitting}
                  onClick={handleSubmitUtr}
                  className="w-2/3 py-2.5 bg-primary text-primary-foreground rounded-full text-xs font-black uppercase tracking-widest disabled:opacity-50 hover:opacity-90 active:scale-95 transition-all shadow-card flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5 fill-rose-soft text-rose-soft animate-pulse" />
                  <span>{submitting ? "Submitting..." : "Submit & Track"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}