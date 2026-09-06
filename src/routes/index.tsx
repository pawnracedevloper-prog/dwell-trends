import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import hero from "@/assets/hero.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p6 from "@/assets/p6.jpg";
import p2 from "@/assets/p2.jpg";
import p8 from "@/assets/p8.jpg";
import p5 from "@/assets/p5.jpg";
import { ProductCard } from "@/components/ProductCard";
import { BRAND, PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${BRAND} — Premium Women's Suits, Kurtis & Anarkali` },
      {
        name: "description",
        content:
          "Handpicked Indian ethnic wear for women. Anarkali suits, Lucknowi chikankari, Banarasi silk and everyday kurtis with free shipping above ₹999.",
      },
      { property: "og:title", content: `${BRAND} — Premium Women's Ethnic Wear` },
      {
        property: "og:description",
        content: "Anarkali suits, chikankari salwar suits, kurtis and party wear, shipped across India.",
      },
    ],
  }),
  component: Home,
});

const CATEGORY_TILES = [
  { name: "Anarkali", image: p6 },
  { name: "Salwar Suits", image: p3 },
  { name: "Kurtis", image: p2 },
  { name: "Party Wear", image: p4 },
  { name: "Suits", image: p5 },
  { name: "New Arrivals", image: p8 },
];

function Home() {
  const newArrivals = PRODUCTS.filter((p) => p.isNew);
  const bestsellers = [...PRODUCTS].sort((a, b) => b.ratingCount - a.ratingCount).slice(0, 4);
  const festive = PRODUCTS.filter((p) => p.price >= 3000);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-secondary/50">
        <div className="container-page grid items-center gap-8 py-10 md:grid-cols-2 md:py-16">
          <div className="order-2 md:order-1">
            <p className="eyebrow inline-flex items-center gap-2 rounded-full bg-rose-soft px-3 py-1.5 text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Festive Edit 2026
            </p>
            <h1 className="mt-5 text-4xl leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
              Suits that carry
              <span className="block text-rose-deep">a little tradition</span>
              and a lot of ease.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              Handwoven Banarasi, Lucknowi chikankari and soft everyday cottons — cut for real
              Indian sizing and priced without the boutique markup.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/products"
                search={{ category: undefined, q: undefined }}
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-lift)]"
              >
                Shop the collection
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/products"
                search={{ category: "New Arrivals", q: undefined }}
                className="text-sm font-medium text-foreground underline decoration-rose-deep decoration-2 underline-offset-8 transition-colors hover:text-rose-deep"
              >
                New arrivals
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-8 border-t border-border/70 pt-6">
              {[
                ["12,000+", "Happy customers"],
                ["4.6★", "Average rating"],
                ["₹999+", "Free shipping"],
              ].map(([a, b]) => (
                <div key={b}>
                  <p className="font-display text-xl text-primary">{a}</p>
                  <p className="text-xs text-muted-foreground">{b}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="overflow-hidden rounded-2xl shadow-[var(--shadow-lift)]">
              <img
                src={hero}
                alt="Model wearing a rose pink embroidered anarkali suit"
                width={1600}
                height={1000}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-14">
        <SectionHead title="Shop by category" sub="Six edits, every occasion covered" />
        <div className="mt-7 grid grid-cols-3 gap-3 sm:gap-5 lg:grid-cols-6">
          {CATEGORY_TILES.map((c) => (
            <Link
              key={c.name}
              to="/products"
              search={{ category: c.name, q: undefined }}
              className="group text-center"
            >
              <div className="overflow-hidden rounded-full border border-border/70 shadow-[var(--shadow-card)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-lift)]">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    width={800}
                    height={800}
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </div>
              <p className="mt-3 text-xs font-medium sm:text-sm">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="container-page pb-14">
        <SectionHead title="Just in" sub="Fresh off the loom this month" link="New Arrivals" />
        <Grid products={newArrivals} />
      </section>

      {/* Festive banner */}
      <section className="container-page">
        <div className="grid items-center gap-8 overflow-hidden rounded-2xl bg-primary px-6 py-10 text-primary-foreground sm:px-12 md:grid-cols-[1.2fr_1fr] md:py-14">
          <div>
            <p className="eyebrow opacity-80">Wedding season</p>
            <h2 className="mt-3 text-3xl text-primary-foreground sm:text-4xl">
              Up to 50% off on festive silks & velvets
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed opacity-85">
              Banarasi brocade, micro velvet anarkalis and sequinned georgette — dispatched within
              24 hours so it reaches you before the mehendi.
            </p>
            <Link
              to="/products"
              search={{ category: "Party Wear", q: undefined }}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-card px-6 py-3 text-sm font-medium text-primary transition-transform hover:scale-[1.03]"
            >
              Explore party wear <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {festive.slice(0, 3).map((p) => (
              <Link
                key={p.id}
                to="/product/$productId"
                params={{ productId: p.id }}
                className="overflow-hidden rounded-xl"
              >
                <img
                  src={p.images[0]}
                  alt={p.name}
                  loading="lazy"
                  width={800}
                  height={1067}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="container-page py-14">
        <SectionHead title="Most loved" sub="Ranked by what our customers keep reordering" />
        <Grid products={bestsellers} />
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/50 py-14">
        <div className="container-page">
          <SectionHead title="From our customers" sub="Verified reviews from across India" />
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {[
              {
                t: "The chikankari suit is genuine hand work — I checked the reverse side. Better than what I've paid double for in Lucknow.",
                n: "Ritika A.",
                c: "Pune",
              },
              {
                t: "Ordered the Banarasi for my sister's wedding. Reached in 3 days, packed beautifully in a muslin bag.",
                n: "Lakshmi N.",
                c: "Hyderabad",
              },
              {
                t: "Sizing charts are honest, which is rare. Exchanged one size up and pickup was arranged next morning.",
                n: "Meera P.",
                c: "Chennai",
              },
            ].map((r) => (
              <figure key={r.n} className="card-surface p-6">
                <p className="text-sm leading-relaxed text-foreground/90">“{r.t}”</p>
                <figcaption className="mt-4 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{r.n}</span> · {r.c}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHead({ title, sub, link }: { title: string; sub: string; link?: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
      <div className="min-w-0">
        <h2 className="text-2xl sm:text-3xl">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
      </div>
      <Link
        to="/products"
        search={{ category: link, q: undefined }}
        className="shrink-0 text-sm font-medium text-rose-deep hover:underline"
      >
        View all
      </Link>
    </div>
  );
}

function Grid({ products }: { products: { id: string }[] }) {
  return (
    <div className="mt-7 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
      {products.map((p) => {
        const full = PRODUCTS.find((x) => x.id === p.id)!;
        return <ProductCard key={full.id} product={full} />;
      })}
    </div>
  );
}
