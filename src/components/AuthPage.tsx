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
      {/* Dark Slate/Charcoal Card Box */}
      <div className="w-full max-w-md rounded-3xl border border-rose-deep/40 bg-[#14171e]/95 p-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden ring-1 ring-rose-deep/20">
        {/* Cyber Pink Ambient Glow Orbs */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-52 w-52 rounded-full bg-rose-deep/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-rose-soft/20 blur-3xl" />

        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-rose-deep/40 bg-rose-deep/15 text-[10px] font-black uppercase tracking-widest text-rose-soft mb-3.5 glam-glow">
            <span className="animate-pulse text-rose-deep">✦</span> Dwell Trends VIP <span>✦</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-soft to-rose-deep drop-shadow-sm">
            {isLogin ? "Welcome Back" : "Join the Collective"}
          </h1>
          <p className="text-xs text-rose-soft/90 mt-2 font-semibold tracking-wide">
            {isLogin 
              ? "Enter your credentials to manage orders & token wallet" 
              : "Create an account to unlock exclusive cyber-glam drops"}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-destructive/20 border border-destructive/40 p-3.5 text-center text-xs font-bold text-destructive shadow-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4.5 relative z-10">
          {!isLogin && (
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-rose-soft block mb-1">
                Full Name
              </label>
              <div className="relative group">
                <UserIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-soft/70 group-focus-within:text-rose-deep transition-colors" />
                <input
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 w-full rounded-2xl border border-white/10 bg-[#1e222b]/90 pl-10 pr-4 text-xs font-semibold text-white outline-none transition-all placeholder:text-muted-foreground focus:border-rose-deep focus:bg-[#1a1d26] focus:ring-4 focus:ring-rose-deep/20"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-rose-soft block mb-1">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-soft/70 group-focus-within:text-rose-deep transition-colors" />
              <input
                required
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 w-full rounded-2xl border border-white/10 bg-[#1e222b]/90 pl-10 pr-4 text-xs font-semibold text-white outline-none transition-all placeholder:text-muted-foreground focus:border-rose-deep focus:bg-[#1a1d26] focus:ring-4 focus:ring-rose-deep/20"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-rose-soft block mb-1">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-soft/70 group-focus-within:text-rose-deep transition-colors" />
              <input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-2xl border border-white/10 bg-[#1e222b]/90 pl-10 pr-4 text-xs font-semibold text-white outline-none transition-all placeholder:text-muted-foreground focus:border-rose-deep focus:bg-[#1a1d26] focus:ring-4 focus:ring-rose-deep/20"
              />
            </div>
          </div>

          {isLogin && (
            <div className="flex justify-end text-xs pt-0.5">
              <Link to="/forgot-password" className="text-rose-soft font-bold hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-rose-deep py-3.5 text-xs font-black uppercase tracking-widest text-white transition-all hover:opacity-95 active:scale-95 disabled:opacity-50 glam-glow shadow-xl"
          >
            {loading ? (
              <span className="text-rose-soft">Authenticating...</span>
            ) : (
              <>
                <Sparkles className="h-4 w-4 fill-white text-white animate-pulse" />
                <span>{isLogin ? "Sign In" : "Register"}</span>
                <ArrowRight className="h-4 w-4 text-white" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs relative z-10 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-rose-soft font-black uppercase tracking-wider hover:text-white transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}