import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User, X, ChevronDown, Sparkles, ShieldAlert, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useShop } from "@/lib/store";
import { endpoints } from "@/lib/endpoints";

export const NAVIGATION_CATEGORIES = [
  {
    category: "Women",
    subcategories: [
      { name: "Suits & Dress Materials", sub: "Suits" },
      { name: "Kurtis & Tunics", sub: "Kurtis" },
      { name: "Salwar Suits", sub: "Salwar Suits" },
      { name: "Anarkali Sets", sub: "Anarkali" },
      { name: "Festive & Party Wear", sub: "Party Wear" },
    ],
  },
  {
    category: "Men",
    subcategories: [
      { name: "Kurta Sets", sub: "Kurta Sets" },
      { name: "Nehru & Ethnic Jackets", sub: "Jackets" },
      { name: "Sherwanis & Indo-Western", sub: "Sherwanis" },
      { name: "Festive Dhotis & Pyjamas", sub: "Dhotis" },
      { name: "Party Wear Shirts", sub: "Party Wear" },
    ],
  },
  {
    category: "Kids",
    subcategories: [
      { name: "Boys Ethnic Kurtas", sub: "Boys Ethnic" },
      { name: "Girls Lehengas & Cholis", sub: "Girls Lehengas" },
      { name: "Festive Frocks & Gowns", sub: "Frocks" },
      { name: "Dhoti Kurta Sets", sub: "Dhoti Sets" },
      { name: "Kids Party Wear", sub: "Party Wear" },
    ],
  },
  {
    category: "Beauty",
    subcategories: [
      { name: "Luxury Fragrances & Attar", sub: "Fragrances" },
      { name: "Festive Makeup Kits", sub: "Makeup" },
      { name: "Organic Ayurvedic Skincare", sub: "Skincare" },
      { name: "Herbal Hair Oils & Care", sub: "Haircare" },
      { name: "Bath & Wellness", sub: "Wellness" },
    ],
  },
  {
    category: "Home",
    subcategories: [
      { name: "Handcrafted Cushion Covers", sub: "Cushions" },
      { name: "Traditional Bed Linens", sub: "Bed Linen" },
      { name: "Ethnic Table Runners", sub: "Table Runners" },
      { name: "Festive Diya & Wall Decor", sub: "Decor" },
      { name: "Handwoven Curtains", sub: "Curtains" },
    ],
  },
];

export function Header({ onOpenCart }: { onOpenCart?: () => void }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);
  const navigate = useNavigate();
  const { cart, wishlist, user, setUser, logout } = useShop();
  const count = cart.reduce((n, c) => n + c.qty, 0);

  // Sync user authentication state on mount if token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      endpoints.getProfile?.()
        .then((res: any) => {
          if (res?.success && res.user && setUser) {
            setUser(res.user);
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          if (setUser) setUser(null);
        });
    }
  }, [user, setUser]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setOpen(false);
    navigate({ to: "/products", search: { q: q.trim() || undefined } });
  }

  const handleLogout = async () => {
    try {
      if (endpoints.logout) {
        await endpoints.logout();
      }
    } catch (err) {
      console.warn("Backend logout notification warning:", err);
    } finally {
      // 1. Clear all authentication cache keys
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("shop-storage");
      localStorage.removeItem("saanvi-shop-v1");

      // 2. Clear application store state
      if (typeof logout === "function") {
        logout();
      }
      if (typeof setUser === "function") {
        setUser(null);
      }

      setOpen(false);

      // 3. Navigate directly to auth route
      navigate({ to: "/auth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0d0f14]/90 border-b border-primary/20 shadow-[0_4px_25px_-4px_rgba(255,42,135,0.18)] backdrop-blur-xl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-primary via-rose-deep to-primary text-center text-primary-foreground shadow-sm">
        <p className="container-page py-1.5 text-[0.7rem] font-bold tracking-wider sm:text-xs flex items-center justify-center gap-2">
          <span>✦</span> Free shipping on orders above ₹999 &nbsp;·&nbsp; Easy 7-day returns &nbsp;·&nbsp; Token Rewards Active <span>✦</span>
        </p>
      </div>

      {/* Main Header Bar */}
      <div className="container-page grid grid-cols-[auto_1fr_auto] items-center gap-3 py-3 md:gap-6 md:py-4">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            aria-label="Menu"
            className="-ml-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl text-foreground transition-all hover:bg-secondary/70 hover:text-primary md:hidden border border-border/40"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to="/" className="min-w-0 leading-none group">
            <span className="block font-display text-xl font-black tracking-tight glam-gradient-text sm:text-2xl group-hover:opacity-90 transition-opacity">
              Dwell Trends
            </span>
            <span className="text-[9px] uppercase tracking-[0.22em] text-rose-soft/80 font-bold hidden sm:block">
              Modern Living & Ethnic Glam
            </span>
          </Link>
        </div>

        <form onSubmit={submit} className="hidden md:block">
          <div className="relative group">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search metallic silks, glam anarkalis, festive drops…"
              aria-label="Search products"
              className="h-11 w-full rounded-full border border-border/80 bg-secondary/50 pl-11 pr-4 text-xs font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/20"
            />
          </div>
        </form>

        <nav className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          {/* Admin Portal Header Button - Visible strictly to Admins */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="hidden items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-2 text-xs font-bold text-rose-soft transition-all hover:bg-primary/20 hover:border-primary glam-glow sm:flex"
            >
              <ShieldAlert className="h-4 w-4 text-primary" />
              <span>Admin Portal</span>
            </Link>
          )}

          <Link
            to={user ? "/profile" : "/auth"}
            className="hidden items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all hover:bg-secondary/70 hover:text-primary text-foreground sm:flex border border-transparent hover:border-border/60"
          >
            <User className="h-4 w-4 text-rose-soft" />
            <span>{user ? user.name.split(" ")[0] : "Login"}</span>
          </Link>

          {/* Desktop Logout Button */}
          {user && (
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
              className="hidden h-9 w-9 place-items-center rounded-xl text-muted-foreground transition-all hover:bg-destructive/15 hover:text-destructive border border-border/40 sm:grid"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}

          <Link
            to="/profile"
            aria-label="Wishlist"
            className="relative grid h-9 w-9 place-items-center rounded-xl text-foreground transition-all hover:bg-secondary/70 hover:text-primary border border-border/40"
          >
            <Heart className="h-4.5 w-4.5 text-rose-soft/90" />
            {wishlist.length > 0 && <Badge n={wishlist.length} />}
          </Link>
          <button
            type="button"
            onClick={onOpenCart}
            aria-label="Cart"
            className="relative grid h-9 w-9 place-items-center rounded-xl text-foreground transition-all hover:bg-secondary/70 hover:text-primary border border-border/40"
          >
            <ShoppingBag className="h-4.5 w-4.5 text-primary" />
            {count > 0 && <Badge n={count} />}
          </button>
        </nav>
      </div>

      {/* Mobile Search Bar */}
      <form onSubmit={submit} className="container-page pb-3 md:hidden">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products, collections…"
            aria-label="Search products"
            className="h-10 w-full rounded-full border border-border/80 bg-secondary/50 pl-11 pr-4 text-xs outline-none placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20 text-foreground"
          />
        </div>
      </form>

      {/* Desktop Main Categories Navigation with Hover Mega-Dropdowns */}
      <nav className="relative hidden border-t border-border/40 md:block">
        <div className="container-page flex items-center justify-center gap-4 lg:gap-8 py-2 text-xs font-semibold tracking-wide">
          {NAVIGATION_CATEGORIES.map((cat) => (
            <div
              key={cat.category}
              onMouseEnter={() => setHoveredCategory(cat.category)}
              onMouseLeave={() => setHoveredCategory(null)}
              className="relative group py-1.5"
            >
              <Link
                to="/products"
                search={{ mainCategory: cat.category }}
                className="flex items-center gap-1 uppercase tracking-wider font-bold text-muted-foreground group-hover:text-primary transition-colors py-1 px-2.5 rounded-lg group-hover:bg-secondary/50"
              >
                <span>{cat.category}</span>
                <ChevronDown className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180 opacity-60 group-hover:opacity-100" />
              </Link>

              {/* Hover Floating Dropdown Menu */}
              {hoveredCategory === cat.category && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-60 animate-in fade-in-50 zoom-in-95 duration-150">
                  <div className="bg-[#14171e]/95 border border-primary/25 rounded-2xl shadow-[0_12px_35px_-4px_rgba(255,42,135,0.25)] p-3 backdrop-blur-2xl space-y-1 ring-1 ring-white/5">
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-rose-soft/80 border-b border-border/50 flex items-center justify-between">
                      <span>{cat.category} Collection</span>
                      <span className="text-primary text-[10px]">✦</span>
                    </div>
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub.name}
                        to="/products"
                        search={{ mainCategory: cat.category, subCategory: sub.sub }}
                        className="block px-3 py-2 rounded-xl text-[11px] font-medium text-foreground hover:bg-primary hover:text-white transition-all truncate"
                      >
                        {sub.name}
                      </Link>
                    ))}
                    <div className="pt-1.5 border-t border-border/50">
                      <Link
                        to="/products"
                        search={{ mainCategory: cat.category }}
                        className="flex items-center justify-between px-3 py-1.5 rounded-lg text-[10px] font-black text-primary hover:underline uppercase tracking-wider"
                      >
                        <span>Explore All {cat.category}</span>
                        <span>&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <Link
            to="/products"
            search={{ dealType: "Hot" }}
            className="flex items-center gap-1.5 uppercase tracking-wider font-bold text-primary hover:text-rose-soft transition-colors py-1 px-3 rounded-full hover:bg-primary/10 border border-primary/30"
          >
            <Sparkles className="h-3.5 w-3.5 fill-primary text-primary animate-pulse" />
            <span>Hot Deals</span>
          </Link>

          <Link
            to="/products"
            search={{}}
            className="uppercase tracking-wider font-bold text-foreground hover:text-primary transition-colors py-1 px-2.5"
          >
            Shop All
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {open && (
        <div className="border-t border-border bg-[#12151b] md:hidden max-h-[80vh] overflow-y-auto">
          <div className="container-page flex flex-col py-3 space-y-1">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="eyebrow">Shop Categories</span>
              <button aria-label="Close menu" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Mobile Admin Portal Item */}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 p-2.5 text-xs font-bold text-rose-soft my-1 glam-glow"
              >
                <ShieldAlert className="h-4 w-4 text-primary" />
                <span>Admin Operations Portal</span>
              </Link>
            )}

            {NAVIGATION_CATEGORIES.map((cat) => {
              const isExpanded = mobileExpandedCat === cat.category;
              return (
                <div key={cat.category} className="border-b border-border/40 py-1">
                  <div className="flex items-center justify-between py-2">
                    <Link
                      to="/products"
                      search={{ mainCategory: cat.category }}
                      onClick={() => setOpen(false)}
                      className="font-bold text-xs text-foreground uppercase tracking-wide"
                    >
                      {cat.category}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setMobileExpandedCat(isExpanded ? null : cat.category)}
                      className="p-1 rounded-md text-muted-foreground hover:bg-secondary"
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180 text-primary" : ""}`}
                      />
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="pl-3 pb-2 space-y-1.5">
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub.name}
                          to="/products"
                          search={{ mainCategory: cat.category, subCategory: sub.sub }}
                          onClick={() => setOpen(false)}
                          className="block py-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <Link
              to="/products"
              search={{ dealType: "Hot" }}
              onClick={() => setOpen(false)}
              className="py-2.5 text-xs font-bold text-primary flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 fill-primary" /> Hot Deals
            </Link>

            <Link
              to="/products"
              search={{}}
              onClick={() => setOpen(false)}
              className="py-2.5 text-xs font-bold text-foreground hover:text-primary"
            >
              Shop All Catalog
            </Link>

            {user ? (
              <div className="border-t border-border/60 pt-2 space-y-1">
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="block py-2 text-xs font-semibold text-foreground"
                >
                  My Account ({user.name})
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 py-2 text-xs font-bold text-destructive w-full text-left"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="border-t border-border/60 pt-3 text-xs font-semibold text-muted-foreground"
              >
                Login / Sign up
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <span className="absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[0.625rem] font-black text-white glam-glow">
      {n}
    </span>
  );
}