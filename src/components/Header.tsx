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
        .catch(console.error);
    }
  }, [user, setUser]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setOpen(false);
    navigate({ to: "/products", search: { q: q.trim() || undefined } });
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (logout) {
      logout();
    } else if (setUser) {
      setUser(null);
    }
    setOpen(false);
    navigate({ to: "/auth" });
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 shadow-[var(--shadow-bar)] backdrop-blur">
      {/* Top Banner */}
      <div className="bg-primary text-center text-primary-foreground">
        <p className="container-page py-2 text-[0.7rem] tracking-wide sm:text-xs">
          Free shipping on orders above ₹999 &nbsp;·&nbsp; Easy 7-day returns &nbsp;·&nbsp; COD available
        </p>
      </div>

      {/* Main Header Bar */}
      <div className="container-page grid grid-cols-[auto_1fr_auto] items-center gap-3 py-3 md:gap-6 md:py-4">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            aria-label="Menu"
            className="-ml-1 grid h-9 w-9 shrink-0 place-items-center rounded-lg text-foreground transition-colors hover:bg-accent md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
              className="h-11 w-full rounded-full border border-border bg-secondary/60 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/20"
            />
          </div>
        </form>

        <nav className="flex shrink-0 items-center gap-1 sm:gap-2">
          {/* Admin Portal Header Button - Visible strictly to Admins */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="hidden items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-700 transition-colors hover:bg-amber-500/20 sm:flex"
            >
              <ShieldAlert className="h-4 w-4 text-amber-600" />
              <span>Admin Portal</span>
            </Link>
          )}

          <Link
            to={user ? "/profile" : "/auth"}
            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent sm:flex"
          >
            <User className="h-4.5 w-4.5" />
            <span>{user ? user.name.split(" ")[0] : "Login"}</span>
          </Link>

          {/* Desktop Logout Button */}
          {user && (
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
              className="hidden h-10 w-10 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive sm:grid"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          )}

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

      {/* Mobile Search Bar */}
      <form onSubmit={submit} className="container-page pb-3 md:hidden">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products, collections…"
            aria-label="Search products"
            className="h-11 w-full rounded-full border border-border bg-secondary/60 pl-11 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:bg-card"
          />
        </div>
      </form>

      {/* Desktop Main Categories Navigation with Hover Mega-Dropdowns */}
      <nav className="relative hidden border-t border-border/70 md:block">
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
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-56 animate-in fade-in-50 zoom-in-95 duration-150">
                  <div className="bg-card border border-border/80 rounded-2xl shadow-xl p-2.5 backdrop-blur-lg space-y-1 ring-1 ring-black/5">
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">
                      {cat.category} Collection
                    </div>
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub.name}
                        to="/products"
                        search={{ mainCategory: cat.category, subCategory: sub.sub }}
                        className="block px-3 py-2 rounded-xl text-[11px] font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-all truncate"
                      >
                        {sub.name}
                      </Link>
                    ))}
                    <div className="pt-1 border-t border-border/50">
                      <Link
                        to="/products"
                        search={{ mainCategory: cat.category }}
                        className="flex items-center justify-between px-3 py-1.5 rounded-lg text-[10px] font-bold text-primary hover:underline"
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
            className="flex items-center gap-1 uppercase tracking-wider font-bold text-amber-600 hover:text-amber-700 transition-colors py-1 px-2.5 rounded-lg hover:bg-amber-500/10"
          >
            <Sparkles className="h-3 w-3 fill-amber-500 text-amber-500" />
            <span>Hot Deals</span>
          </Link>

          <Link
            to="/products"
            search={{}}
            className="uppercase tracking-wider font-bold text-primary hover:underline py-1 px-2.5"
          >
            Shop All
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {open && (
        <div className="border-t border-border bg-card md:hidden max-h-[80vh] overflow-y-auto">
          <div className="container-page flex flex-col py-3 space-y-1">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="eyebrow text-muted-foreground">Shop Categories</span>
              <button aria-label="Close menu" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Mobile Admin Portal Item */}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-2.5 text-xs font-bold text-amber-700 my-1"
              >
                <ShieldAlert className="h-4 w-4 text-amber-600" />
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
                      className="font-bold text-sm text-foreground uppercase tracking-wide"
                    >
                      {cat.category}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setMobileExpandedCat(isExpanded ? null : cat.category)}
                      className="p-1 rounded-md text-muted-foreground hover:bg-secondary"
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
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
              className="py-2.5 text-xs font-bold text-amber-600 flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 fill-amber-500" /> Hot Deals
            </Link>

            <Link
              to="/products"
              search={{}}
              onClick={() => setOpen(false)}
              className="py-2.5 text-xs font-bold text-primary"
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
    <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[0.625rem] font-semibold text-primary-foreground">
      {n}
    </span>
  );
}