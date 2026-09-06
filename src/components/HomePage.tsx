import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { CATEGORIES, PRODUCTS, BRAND } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import heroImg from "@/assets/p1.jpg"; // Adjust if needed

export function HomePage() {
  const newArrivals = PRODUCTS.filter((p) => p.isNew).slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex h-[70vh] min-h-[500px] items-center justify-center overflow-hidden bg-secondary">
        <img
          src={heroImg}
          alt="Festive Collection"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <span className="eyebrow mb-4 rounded-full bg-primary/10 px-4 py-1.5 text-primary backdrop-blur-md">
            Festive Edit 2026
          </span>
          <h1 className="font-display text-4xl font-medium tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Elegance in <br /> Every Thread.
          </h1>
          <p className="mt-6 max-w-md text-sm text-foreground/80 sm:text-base">
            Discover {BRAND}'s latest collection of handcrafted suits, anarkalis, and pure cotton kurtis.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-105"
          >
            Shop the Collection <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="border-b border-border py-8">
        <div className="container-page hide-scrollbar flex overflow-x-auto gap-4 sm:justify-center">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to="/products"
              search={{ category: cat }}
              className="whitespace-nowrap rounded-full border border-border bg-card px-6 py-2.5 text-sm font-medium transition-colors hover:border-primary hover:bg-primary/5"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container-page py-16 sm:py-24">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-deep">
              <Sparkles className="h-5 w-5" />
              <span className="eyebrow">Just Dropped</span>
            </div>
            <h2 className="mt-2 font-display text-3xl">New Arrivals</h2>
          </div>
          <Link
            to="/products"
            search={{ category: "New Arrivals" }}
            className="hidden text-sm font-medium text-primary hover:underline sm:block"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/products"
            search={{ category: "New Arrivals" }}
            className="inline-flex items-center justify-center rounded-full border border-border px-6 py-2.5 text-sm font-medium"
          >
            View all New Arrivals
          </Link>
        </div>
      </section>
    </div>
  );
}