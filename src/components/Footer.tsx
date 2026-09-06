import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { BRAND, CATEGORIES } from "@/lib/products";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="container-page grid gap-6 border-b border-border/70 py-8 sm:grid-cols-3">
        {[
          { icon: Truck, title: "Free delivery", text: "On all orders above ₹999 across India" },
          { icon: RotateCcw, title: "7-day returns", text: "Easy pickup from your doorstep" },
          { icon: ShieldCheck, title: "Secure payments", text: "UPI, cards, netbanking and COD" },
        ].map((f) => (
          <div key={f.title} className="flex items-start gap-3">
            <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-rose-deep" />
            <div className="min-w-0">
              <p className="text-sm font-medium">{f.title}</p>
              <p className="text-sm text-muted-foreground">{f.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl text-primary">{BRAND}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Thoughtfully made ethnic wear for women — handwoven silks, Lucknowi chikankari and
            everyday cottons, shipped from Jaipur.
          </p>
          <div className="mt-4 flex gap-4 text-muted-foreground">
            <a href="#" aria-label="Instagram" className="transition-colors hover:text-rose-deep">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Email" className="transition-colors hover:text-rose-deep">
              <Mail className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Phone" className="transition-colors hover:text-rose-deep">
              <Phone className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-3 text-muted-foreground">Shop</p>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link
                  to="/products"
                  search={{ category: c, q: undefined }}
                  className="text-foreground/80 transition-colors hover:text-primary"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-3 text-muted-foreground">Help</p>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li>Size guide</li>
            <li>Shipping & delivery</li>
            <li>Returns & exchange</li>
            <li>Track your order</li>
            <li>Contact us</li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-3 text-muted-foreground">Get 10% off</p>
          <p className="text-sm text-muted-foreground">
            Join our list for new drops and festive edits.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-3 flex overflow-hidden rounded-full border border-border bg-card"
          >
            <input
              aria-label="Email address"
              placeholder="you@email.com"
              className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm outline-none"
            />
            <button className="shrink-0 bg-primary px-4 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-border/70">
        <p className="container-page py-5 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {BRAND}. All prices inclusive of taxes. Made in India.
        </p>
      </div>
    </footer>
  );
}
