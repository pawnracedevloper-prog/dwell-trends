import { Link } from "@tanstack/react-router";
import { 
  Instagram, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Coins, 
  Heart,
  ChevronRight
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
    <footer className="bg-card border-t border-border pt-14 pb-8 text-foreground">
      {/* 1. Value Proposition Banner */}
      <div className="container-page pb-12 border-b border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-secondary/30 border border-border/60">
          <Truck className="h-6 w-6 text-primary shrink-0" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">Free Express Delivery</h4>
            <p className="text-[11px] text-muted-foreground">On all orders above ₹999 across India</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-secondary/30 border border-border/60">
          <RotateCcw className="h-6 w-6 text-primary shrink-0" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">7-Day Easy Returns</h4>
            <p className="text-[11px] text-muted-foreground">Hassle-free doorstep collection</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-secondary/30 border border-border/60">
          <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">100% Authentic Products</h4>
            <p className="text-[11px] text-muted-foreground">Handpicked handcrafted collections</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-secondary/30 border border-border/60">
          <Coins className="h-6 w-6 text-amber-500 shrink-0" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">Dwell Rewards</h4>
            <p className="text-[11px] text-muted-foreground">Earn 1 token for every ₹100 spent</p>
          </div>
        </div>
      </div>

      {/* 2. Main Directory & Links Matrix */}
      <div className="container-page py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-8 text-xs">
        {/* Brand & Newsletter Column (Spans 2 cols on Large screens) */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-2 space-y-4 pr-0 lg:pr-6">
          <Link to="/" className="inline-block">
            <h3 className="font-serif text-2xl font-black tracking-tight text-primary">Dwell Trends</h3>
            <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground font-semibold">
              Modern Living & Ethnic Collection
            </p>
          </Link>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Thoughtfully curated ethnic and contemporary apparel — celebrating handcrafted silks, festive palettes, and modern heritage silhouettes across India.
          </p>

          <div className="pt-1">
            <p className="text-xs font-bold uppercase tracking-wider mb-2">Get 10% Off Your First Order</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-1.5">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-2.5 bg-secondary/40 border border-border rounded-xl text-xs outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-95 transition-opacity shrink-0"
              >
                Join
              </button>
            </form>
          </div>

          <div className="flex items-center gap-3 pt-2 text-muted-foreground">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 rounded-lg bg-secondary/50 hover:text-primary hover:bg-secondary transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a 
              href="mailto:support@dwelltrends.com" 
              className="p-2 rounded-lg bg-secondary/50 hover:text-primary hover:bg-secondary transition-colors"
            >
              <Mail className="h-4 w-4" />
            </a>
            <a 
              href="tel:+917656999488" 
              className="p-2 rounded-lg bg-secondary/50 hover:text-primary hover:bg-secondary transition-colors"
            >
              <Phone className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* 5 Main Category Columns (5 Subcategories Each) */}
        {SHOP_DIRECTORIES.map((cat) => (
          <div key={cat.category} className="space-y-3">
            <Link
              to="/products"
              search={{ mainCategory: cat.category }}
              className="font-display font-bold uppercase tracking-wider text-[11px] text-foreground hover:text-primary transition-colors block"
            >
              {cat.category}
            </Link>
            <ul className="space-y-2 text-[11px] text-muted-foreground">
              {cat.subcategories.map((sub) => (
                <li key={sub.name}>
                  <Link
                    to="/products"
                    search={{ mainCategory: cat.category, subCategory: sub.sub }}
                    className="hover:text-primary transition-colors block truncate"
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
          <h4 className="font-display font-bold uppercase tracking-wider text-[11px] text-foreground">
            Help & Care
          </h4>
          <ul className="space-y-2 text-[11px] text-muted-foreground">
            <li>
              <Link to="/profile" className="hover:text-primary transition-colors">
                Track Order & UTR
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-primary transition-colors">
                Dwell Token Wallet
              </Link>
            </li>
            <li>
              <a href="#returns" className="hover:text-primary transition-colors">
                Shipping & Returns
              </a>
            </li>
            <li>
              <a href="#size-guide" className="hover:text-primary transition-colors">
                Size & Fit Guide
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-primary transition-colors">
                Customer Support
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. Bottom Legal & Copyright Bar */}
      <div className="container-page pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
        <p>© 2026 Dwell Trends Private Limited. All prices inclusive of GST. Made with pride in India.</p>
        <div className="flex items-center gap-5">
          <a href="#privacy" className="hover:underline">Privacy Policy</a>
          <a href="#terms" className="hover:underline">Terms of Service</a>
          <a href="#security" className="hover:underline">UPI Security</a>
        </div>
      </div>
    </footer>
  );
}