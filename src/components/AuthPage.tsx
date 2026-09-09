import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useShop } from "@/lib/store";
import { endpoints } from "@/lib/endpoints";
import { Lock, Mail, User as UserIcon, ArrowRight, Sparkles } from "lucide-react";

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn } = useShop();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let data;
      if (isLogin) {
        data = await endpoints.login({ email, password });
      } else {
        data = await endpoints.register({ name, email, password });
      }

      // Save token and update global shop state
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      signIn({ 
        name: data.user.name, 
        email: data.user.email, 
        role: data.user.role, 
        walletTokens: data.user.walletTokens 
      });
      
      navigate({ to: "/" });
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page flex min-h-[75vh] items-center justify-center py-12 text-foreground">
      <div className="w-full max-w-md rounded-3xl border border-border/80 bg-card p-8 shadow-card backdrop-blur-xl relative overflow-hidden">
        {/* Soft Pink Glow Orbs */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-rose-deep/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-rose-soft/20 blur-3xl" />

        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-rose-deep/30 bg-secondary text-[10px] font-black uppercase tracking-widest text-rose-deep mb-3 glam-glow">
            <span className="animate-pulse">✦</span> Dwell Trends VIP <span>✦</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight glam-gradient-text">
            {isLogin ? "Welcome Back" : "Join the Collective"}
          </h1>
          <p className="text-xs text-muted-foreground mt-2 font-medium">
            {isLogin 
              ? "Enter your credentials to manage orders & token wallet" 
              : "Create an account to unlock exclusive cyber-glam drops"}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-destructive/10 border border-destructive/20 p-3.5 text-center text-xs font-bold text-destructive shadow-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {!isLogin && (
            <div className="relative group">
              <UserIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-rose-deep transition-colors" />
              <input
                required
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 w-full rounded-2xl border border-border bg-background pl-10 pr-4 text-xs font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-rose-deep focus:bg-card focus:ring-4 focus:ring-rose-deep/15"
              />
            </div>
          )}

          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-rose-deep transition-colors" />
            <input
              required
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-2xl border border-border bg-background pl-10 pr-4 text-xs font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-rose-deep focus:bg-card focus:ring-4 focus:ring-rose-deep/15"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-rose-deep transition-colors" />
            <input
              required
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded-2xl border border-border bg-background pl-10 pr-4 text-xs font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-rose-deep focus:bg-card focus:ring-4 focus:ring-rose-deep/15"
            />
          </div>

          {isLogin && (
            <div className="flex justify-end text-xs pt-0.5">
              <Link to="/forgot-password" className="text-muted-foreground hover:text-rose-deep font-bold transition-colors">
                Forgot password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-xs font-black uppercase tracking-widest text-primary-foreground transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 shadow-card"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <Sparkles className="h-4 w-4 fill-rose-soft text-rose-soft animate-pulse" />
                <span>{isLogin ? "Sign In" : "Register"}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs relative z-10 border-t border-border/70 pt-4">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-muted-foreground hover:text-rose-deep font-bold transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}