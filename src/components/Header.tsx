import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { CATEGORIES } from "@/lib/products";
import { useShop } from "@/lib/store";

export function Header({ onOpenCart }: { onOpenCart?: () => void }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { cart, wishlist, user } = useShop();
  const count = cart.reduce((n, c) => n + c.qty, 0);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setOpen(false);
    navigate({ to: "/products", search: { q: q.trim() || undefined, category: undefined } });
  }

  return (
    <header className="sticky top-0 z-50 bg-card/95 shadow-[var(--shadow-bar)] backdrop-blur">
      <div className="bg-primary text-center text-primary-foreground">
        <p className="container-page py-2 text-[0.7rem] tracking-wide sm:text-xs">
          Free shipping on orders above ₹999 &nbsp;·&nbsp; Easy 7-day returns &nbsp;·&nbsp; COD available
        </p>
      </div>

      <div className="container-page grid grid-cols-[auto_1fr_auto] items-center gap-3 py-3 md:gap-6 md:py-4">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            aria-label="Menu"
            className="-ml-1 grid h-9 w-9 shrink-0 place-items-center rounded-lg text-foreground transition-colors hover:bg-accent md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <Menu className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to="/" className="min-w-0 leading-none">
            <span className="block font-display text-xl font-bold tracking-tight text-primary sm:text-2xl">
              Dwell Trends
            </span>
            <span className="eyebrow hidden text-muted-foreground sm:block">
              Modern Living & Ethnic Collection
            </span>
          </Link>
        </div>

        <form onSubmit={submit} className="hidden md:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products, collections, trends…"
              aria-label="Search products"
              className="h-11 w-full rounded-full border border-border bg-secondary/60 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-rose-deep focus:bg-card focus:ring-4 focus:ring-rose-soft"
            />
          </div>
        </form>

        <nav className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            to={user ? "/profile" : "/auth"}
            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent sm:flex"
          >
            <User className="h-4.5 w-4.5" />
            <span>{user ? user.name.split(" ")[0] : "Login"}</span>
          </Link>
          <Link
            to="/profile"
            aria-label="Wishlist"
            className="relative grid h-10 w-10 place-items-center rounded-lg transition-colors hover:bg-accent"
          >
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && <Badge n={wishlist.length} />}
          </Link>
          <button
            type="button"
            onClick={onOpenCart}
            aria-label="Cart"
            className="relative grid h-10 w-10 place-items-center rounded-lg transition-colors hover:bg-accent"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && <Badge n={count} />}
          </button>
        </nav>
      </div>

      <form onSubmit={submit} className="container-page pb-3 md:hidden">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products, collections…"
            aria-label="Search products"
            className="h-11 w-full rounded-full border border-border bg-secondary/60 pl-11 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-rose-deep focus:bg-card"
          />
        </div>
      </form>

      <div className="border-t border-border/70">
        <div className="container-page hide-scrollbar hidden gap-7 overflow-x-auto py-3 md:flex">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              to="/products"
              search={{ category: c, q: undefined }}
              className="relative whitespace-nowrap text-sm text-foreground/80 transition-colors hover:text-primary after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              {c}
            </Link>
          ))}
          <Link
            to="/products"
            search={{ category: undefined, q: undefined }}
            className="whitespace-nowrap text-sm font-medium text-rose-deep"
          >
            Shop all
          </Link>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-card md:hidden">
          <div className="container-page flex flex-col py-2">
            <div className="flex items-center justify-between py-2">
              <span className="eyebrow text-muted-foreground">Categories</span>
              <button aria-label="Close menu" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                to="/products"
                search={{ category: c, q: undefined }}
                onClick={() => setOpen(false)}
                className="border-t border-border/60 py-3 text-sm"
              >
                {c}
              </Link>
            ))}
            <Link to={user ? "/profile" : "/auth"} onClick={() => setOpen(false)} className="border-t border-border/60 py-3 text-sm">
              {user ? "My account" : "Login / Sign up"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-deep px-1 text-[0.625rem] font-semibold text-primary-foreground">
      {n}
    </span>
  );
}