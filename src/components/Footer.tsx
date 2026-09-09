import { Link } from "@tanstack/react-router";
import { 
  Instagram, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles,
  ArrowRight,
  Zap
} from "lucide-react";

const SHOP_DIRECTORIES = [
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

export function Footer() {
  return (
    <footer className="relative bg-[#0d0f14] border-t border-primary/20 pt-14 pb-8 text-foreground overflow-hidden">
      {/* Decorative Cyber-Pink Glow Orbs in Background */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-rose-soft/10 blur-3xl" />

      {/* 1. Value Proposition Banner */}
      <div className="container-page pb-12 border-b border-border/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10">
        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-card/60 backdrop-blur-md border border-border/70 hover:border-primary/50 transition-all group">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 group-hover:glam-glow transition-transform">
            <Truck className="h-5 w-5 shrink-0" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-foreground">Free Express Delivery</h4>
            <p className="text-[11px] text-muted-foreground">Orders above ₹999 across India</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-card/60 backdrop-blur-md border border-border/70 hover:border-primary/50 transition-all group">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 group-hover:glam-glow transition-transform">
            <RotateCcw className="h-5 w-5 shrink-0" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-foreground">7-Day Easy Returns</h4>
            <p className="text-[11px] text-muted-foreground">Doorstep pickup & quick checks</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-card/60 backdrop-blur-md border border-border/70 hover:border-primary/50 transition-all group">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 group-hover:glam-glow transition-transform">
            <ShieldCheck className="h-5 w-5 shrink-0" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-foreground">100% Authentic</h4>
            <p className="text-[11px] text-muted-foreground">Direct from artisanal weavers</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-card/60 backdrop-blur-md border border-border/70 hover:border-primary/50 transition-all group">
          <div className="p-2.5 rounded-xl bg-rose-soft/10 text-rose-soft border border-rose-soft/20 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(244,166,199,0.3)] transition-transform">
            <Zap className="h-5 w-5 shrink-0 fill-rose-soft text-rose-soft" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-foreground">Token Rewards</h4>
            <p className="text-[11px] text-muted-foreground">Earn 1 token for every ₹100</p>
          </div>
        </div>
      </div>

      {/* 2. Main Directory & Links Matrix */}
      <div className="container-page py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-8 text-xs relative z-10">
        {/* Brand & Newsletter Column (Spans 2 cols on Large screens) */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-2 space-y-4 pr-0 lg:pr-6">
          <Link to="/" className="inline-block space-y-1">
            <h3 className="font-display text-2xl font-black tracking-tight glam-gradient-text">
              Dwell Trends
            </h3>
            <p className="text-[9px] uppercase tracking-[0.25em] text-rose-soft/80 font-bold flex items-center gap-1.5">
              <span>✦</span> Modern Living & Ethnic Glam <span>✦</span>
            </p>
          </Link>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Curated high-glam ethnic silhouettes, festive palettes, and contemporary statement apparel tailored for modern wardrobes across India.
          </p>

          <div className="pt-2">
            <p className="text-[11px] font-black uppercase tracking-wider text-foreground mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary fill-primary" /> Get 10% Off Your First Drop
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-1.5">
              <input
                type="email"
                placeholder="Enter your email..."
                className="w-full p-2.5 bg-secondary/60 border border-border/80 rounded-xl text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-wider hover:opacity-95 active:scale-95 transition-all glam-glow shrink-0 flex items-center gap-1"
              >
                Join <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

          <div className="flex items-center gap-2.5 pt-2 text-muted-foreground">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 rounded-xl bg-secondary/60 border border-border/60 hover:text-primary hover:border-primary/40 hover:bg-secondary transition-all"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a 
              href="mailto:support@dwelltrends.com" 
              className="p-2 rounded-xl bg-secondary/60 border border-border/60 hover:text-primary hover:border-primary/40 hover:bg-secondary transition-all"
              aria-label="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
            <a 
              href="tel:+917656999488" 
              className="p-2 rounded-xl bg-secondary/60 border border-border/60 hover:text-primary hover:border-primary/40 hover:bg-secondary transition-all"
              aria-label="Phone"
            >
              <Phone className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* 5 Main Category Columns */}
        {SHOP_DIRECTORIES.map((cat) => (
          <div key={cat.category} className="space-y-3">
            <Link
              to="/products"
              search={{ mainCategory: cat.category }}
              className="font-display font-black uppercase tracking-wider text-[11px] text-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <span className="text-primary text-[10px]">✧</span>
              <span>{cat.category}</span>
            </Link>
            <ul className="space-y-2 text-[11px] text-muted-foreground">
              {cat.subcategories.map((sub) => (
                <li key={sub.name}>
                  <Link
                    to="/products"
                    search={{ mainCategory: cat.category, subCategory: sub.sub }}
                    className="hover:text-primary hover:translate-x-0.5 transition-all block truncate"
                  >
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Customer Help & Support Column */}
        <div className="space-y-3">
          <h4 className="font-display font-black uppercase tracking-wider text-[11px] text-foreground flex items-center gap-1">
            <span className="text-rose-soft text-[10px]">✧</span>
            <span>Help & Care</span>
          </h4>
          <ul className="space-y-2 text-[11px] text-muted-foreground">
            <li>
              <Link to="/profile" className="hover:text-primary transition-colors block">
                Track Order & UTR
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-primary transition-colors block">
                Dwell Token Wallet
              </Link>
            </li>
            <li>
              <a href="#returns" className="hover:text-primary transition-colors block">
                Shipping & Returns
              </a>
            </li>
            <li>
              <a href="#size-guide" className="hover:text-primary transition-colors block">
                Size & Fit Guide
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-primary transition-colors block">
                Customer Support
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. Bottom Legal & Copyright Bar */}
      <div className="container-page pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground relative z-10">
        <p>© 2026 Dwell Trends Private Limited. All prices inclusive of GST. Made with pride in India.</p>
        <div className="flex items-center gap-5">
          <a href="#privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#security" className="hover:text-primary transition-colors">UPI Security</a>
        </div>
      </div>
    </footer>
  );
}