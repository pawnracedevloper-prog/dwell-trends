import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useShop } from "@/lib/store";
import { endpoints } from "@/lib/endpoints";
import { Lock, Mail, User as UserIcon, ArrowRight } from "lucide-react";

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
      signIn({ name: data.user.name, email: data.user.email, role: data.user.role });
      
      navigate({ to: "/" });
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl sm:text-3xl">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-xs text-muted-foreground mt-2">
            {isLogin ? "Enter your credentials to access your account" : "Join Saanvi Fashion for exclusive ethnic wear drops"}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-destructive/10 p-3 text-center text-xs font-medium text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                required
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 w-full rounded-lg border border-border bg-secondary/30 pl-10 pr-4 text-xs outline-none focus:border-primary focus:bg-card"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              required
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-lg border border-border bg-secondary/30 pl-10 pr-4 text-xs outline-none focus:border-primary focus:bg-card"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              required
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded-lg border border-border bg-secondary/30 pl-10 pr-4 text-xs outline-none focus:border-primary focus:bg-card"
            />
          </div>

          {isLogin && (
            <div className="flex justify-end text-xs">
              <Link to="/forgot-password" className="text-muted-foreground hover:text-primary transition-colors">
                Forgot password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-95 disabled:opacity-50"
          >
            <span>{loading ? "Please wait..." : isLogin ? "Sign In" : "Register"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}