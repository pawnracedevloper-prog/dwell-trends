import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { KeyRound, CheckCircle2, ArrowLeft } from "lucide-react";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
        const res = await fetch("http://localhost:8000/api/v1/users/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, newPassword }),
        });
      const data = await res.json();

      if (res.ok && data.success) {
        setMessage("Password updated successfully! You can now log in.");
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-20 max-w-md mx-auto">
      <div className="bg-card border border-border p-8 rounded-2xl shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <KeyRound className="h-8 w-8 text-primary mx-auto" />
          <h1 className="font-display text-2xl font-bold">Reset Password</h1>
          <p className="text-xs text-muted-foreground">Enter your account email and choose a new password.</p>
        </div>

        {error && <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl">{error}</div>}
        {message && <div className="p-3 bg-primary/10 border border-primary/25 text-primary text-xs rounded-xl flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" />{message}</div>}

        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full p-3 bg-secondary/20 border border-border rounded-xl text-xs focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full p-3 bg-secondary/20 border border-border rounded-xl text-xs focus:outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold uppercase tracking-wider hover:opacity-95 transition-all disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link to="/auth" className="text-xs text-muted-foreground hover:text-primary flex items-center justify-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}