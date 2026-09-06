import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Heart, MapPin, RotateCcw, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProductCard } from "@/components/ProductCard";
import { Stars } from "@/components/Rating";
import { BRAND, PRODUCTS, discountPercent, getProduct, inr } from "@/lib/products";
import { useShop } from "@/lib/store";

export const Route = createFileRoute("/product/$productId")({
  loader: ({ params }) => {
    const product = getProduct(params.productId);
    if (!product) throw notFound();
    return { name: product.name, description: product.description, price: product.price };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: `Product unavailable — ${BRAND}` }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.name} — ${BRAND}`;
    const desc = loaderData.description.slice(0, 155);
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { productId } = Route.useParams();
  const product = getProduct(productId)!;
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist } = useShop();

  const [img, setImg] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [colour, setColour] = useState(product.colours[0].name);
  const [pin, setPin] = useState("");
  const [pinResult, setPinResult] = useState<string | null>(null);

  const wished = wishlist.includes(product.id);
  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  function add(buyNow = false) {
    if (!size) {
      toast.error("Please select a size first");
      return;
    }
    addToCart({ id: product.id, size, colour, qty: 1 });
    if (buyNow) navigate({ to: "/cart" });
    else toast.success(`${product.name.split(" ").slice(0, 3).join(" ")} added to bag`);
  }

  function checkPin(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{6}$/.test(pin)) {
      setPinResult("Enter a valid 6-digit PIN code");
      return;
    }
    const days = 2 + (Number(pin[5]) % 4);
    setPinResult(`Delivers in ${days}–${days + 2} days · Cash on delivery available`);
  }

  return (
    <div className="container-page py-8">
      <nav className="mb-6 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link
          to="/products"
          search={{ category: product.category, q: undefined }}
          className="hover:text-primary"
        >
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        {/* Gallery */}
        <div className="grid gap-4 sm:grid-cols-[5rem_minmax(0,1fr)]">
          <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:flex-col sm:overflow-visible">
            {product.images.map((src, i) => (
              <button
                key={src}
                onClick={() => setImg(i)}
                aria-label={`View image ${i + 1}`}
                className={`h-24 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  img === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="relative order-1 overflow-hidden rounded-2xl bg-muted shadow-[var(--shadow-card)] sm:order-2">
            <img
              src={product.images[img]}
              alt={product.name}
              width={800}
              height={1067}
              className="aspect-[3/4] w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <button
              aria-label="Add to wishlist"
              onClick={() => toggleWishlist(product.id)}
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-card/90 backdrop-blur transition-transform hover:scale-110"
            >
              <Heart className={`h-5 w-5 ${wished ? "fill-rose-deep text-rose-deep" : ""}`} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="eyebrow text-rose-deep">{product.category}</p>
          <h1 className="mt-2 text-3xl leading-tight sm:text-4xl">{product.name}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Stars rating={product.rating} />
            <span className="text-sm text-muted-foreground">
              {product.rating} · {product.ratingCount.toLocaleString("en-IN")} ratings ·{" "}
              {product.reviewCount} reviews
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-3xl text-foreground">{inr(product.price)}</span>
            <span className="text-base text-muted-foreground line-through">{inr(product.mrp)}</span>
            <span className="rounded-full bg-rose-soft px-2.5 py-1 text-xs font-semibold text-primary">
              {discountPercent(product)}% off
            </span>
          </div>
          <p className="mt-1 text-xs text-success">Inclusive of all taxes · Free shipping above ₹999</p>

          {/* Colour */}
          <div className="mt-7">
            <p className="text-sm font-medium">
              Colour: <span className="text-muted-foreground">{colour}</span>
            </p>
            <div className="mt-3 flex gap-3">
              {product.colours.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColour(c.name)}
                  aria-label={c.name}
                  className={`h-9 w-9 rounded-full ring-offset-2 ring-offset-background transition-all ${
                    colour === c.name ? "ring-2 ring-primary" : "ring-1 ring-border hover:ring-rose-deep"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mt-7">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Select size</p>
              <span className="text-xs text-muted-foreground">Size guide</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`h-11 min-w-11 rounded-lg border px-4 text-sm font-medium transition-all ${
                    size === s
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:border-rose-deep"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => add(false)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-primary bg-card px-6 py-3.5 text-sm font-medium text-primary transition-colors hover:bg-accent"
            >
              <ShoppingBag className="h-4 w-4" /> Add to bag
            </button>
            <button
              onClick={() => add(true)}
              className="flex-1 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-lift)]"
            >
              Buy now
            </button>
          </div>

          {/* Delivery */}
          <div className="card-surface mt-8 p-5">
            <p className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-rose-deep" /> Delivery & services
            </p>
            <form onSubmit={checkPin} className="mt-3 flex gap-2">
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter PIN code"
                inputMode="numeric"
                aria-label="PIN code"
                className="h-11 min-w-0 flex-1 rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-rose-deep"
              />
              <button className="shrink-0 rounded-lg bg-secondary px-5 text-sm font-medium text-primary">
                Check
              </button>
            </form>
            {pinResult && <p className="mt-2 text-xs text-success">{pinResult}</p>}
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Truck className="h-4 w-4 shrink-0 text-rose-deep" /> Dispatched within 24 hours from Jaipur
              </li>
              <li className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 shrink-0 text-rose-deep" /> 7-day easy return & size exchange
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-rose-deep" /> 100% authentic, quality checked
              </li>
            </ul>
          </div>

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-xl">Product details</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Fabric</dt>
                <dd className="font-medium">{product.fabric}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Work</dt>
                <dd className="font-medium">{product.work}</dd>
              </div>
            </dl>
            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              {product.details.map((d) => (
                <li key={d} className="flex gap-2">
                  <span className="text-rose-deep">·</span> {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16">
        <h2 className="text-2xl">Ratings & reviews</h2>
        <div className="mt-6 grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
          <div className="card-surface grid h-fit place-items-center p-6 text-center">
            <p className="font-display text-5xl text-primary">{product.rating}</p>
            <Stars rating={product.rating} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              {product.ratingCount.toLocaleString("en-IN")} ratings
            </p>
          </div>
          <div className="space-y-5">
            {product.reviews.map((r) => (
              <article key={r.name} className="border-b border-border/70 pb-5 last:border-0">
                <div className="flex flex-wrap items-center gap-3">
                  <Stars rating={r.rating} />
                  <span className="text-sm font-medium">{r.name}</span>
                  <span className="rounded bg-secondary px-2 py-0.5 text-[0.65rem] text-muted-foreground">
                    Verified purchase
                  </span>
                  <span className="text-xs text-muted-foreground">{r.date}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">{r.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl">You may also like</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
