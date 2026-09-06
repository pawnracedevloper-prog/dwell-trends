import { createFileRoute, Link } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import {
  BRAND,
  CATEGORIES,
  COLOUR_SWATCHES,
  PRODUCTS,
  SIZES,
  inCategory,
  inr,
} from "@/lib/products";

type Search = { category?: string; q?: string };

export const Route = createFileRoute("/products")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    category: typeof search.category === "string" ? search.category : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: `Shop Women's Suits, Kurtis & Anarkali — ${BRAND}` },
      {
        name: "description",
        content:
          "Browse every suit, kurti and anarkali in the collection. Filter by price, size, colour and category, and sort by what matters to you.",
      },
      { property: "og:title", content: `Shop all ethnic wear — ${BRAND}` },
      {
        property: "og:description",
        content: "Filter by price, size, colour and category across our full women's ethnic wear range.",
      },
    ],
  }),
  component: Products,
});

const PRICE_BANDS = [
  { label: "Under ₹1,500", min: 0, max: 1500 },
  { label: "₹1,500 – ₹3,000", min: 1500, max: 3000 },
  { label: "₹3,000 – ₹5,000", min: 3000, max: 5000 },
  { label: "Above ₹5,000", min: 5000, max: Infinity },
];

const ALL_COLOURS = Array.from(
  new Set(PRODUCTS.flatMap((p) => p.colours.map((c) => c.name))),
).sort();

function Products() {
  const { category, q } = Route.useSearch();
  const [sizes, setSizes] = useState<string[]>([]);
  const [colours, setColours] = useState<string[]>([]);
  const [bands, setBands] = useState<number[]>([]);
  const [cats, setCats] = useState<string[]>([]);
  const [sort, setSort] = useState("popular");
  const [open, setOpen] = useState(false);

  const activeCats = category ? [category] : cats;

  const results = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (q) {
        const hay = `${p.name} ${p.category} ${p.fabric} ${p.work} ${p.colours.map((c) => c.name).join(" ")}`.toLowerCase();
        if (!q.toLowerCase().split(/\s+/).every((t) => hay.includes(t))) return false;
      }
      if (activeCats.length && !activeCats.some((c) => inCategory(p, c))) return false;
      if (sizes.length && !sizes.some((s) => p.sizes.includes(s))) return false;
      if (colours.length && !p.colours.some((c) => colours.includes(c.name))) return false;
      if (bands.length) {
        const ok = bands.some((i) => p.price >= PRICE_BANDS[i].min && p.price < PRICE_BANDS[i].max);
        if (!ok) return false;
      }
      return true;
    });

    list = [...list];
    if (sort === "low") list.sort((a, b) => a.price - b.price);
    else if (sort === "high") list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sort === "new") list.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    else list.sort((a, b) => b.ratingCount - a.ratingCount);
    return list;
  }, [q, activeCats, sizes, colours, bands, sort]);

  const toggle = <T,>(arr: T[], set: (v: T[]) => void, v: T) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const clearAll = () => {
    setSizes([]);
    setColours([]);
    setBands([]);
    setCats([]);
  };

  const activeCount = sizes.length + colours.length + bands.length + cats.length;

  const filters = (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <p className="eyebrow text-muted-foreground">Filters</p>
        {activeCount > 0 && (
          <button onClick={clearAll} className="text-xs font-medium text-rose-deep hover:underline">
            Clear all
          </button>
        )}
      </div>

      {!category && (
        <FilterGroup title="Category">
          {CATEGORIES.map((c) => (
            <Check key={c} label={c} checked={cats.includes(c)} onChange={() => toggle(cats, setCats, c)} />
          ))}
        </FilterGroup>
      )}

      <FilterGroup title="Price">
        {PRICE_BANDS.map((b, i) => (
          <Check key={b.label} label={b.label} checked={bands.includes(i)} onChange={() => toggle(bands, setBands, i)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggle(sizes, setSizes, s)}
              className={`h-9 min-w-9 rounded-lg border px-3 text-xs font-medium transition-all ${
                sizes.includes(s)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-rose-deep"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Colour">
        <div className="space-y-2">
          {ALL_COLOURS.map((c) => (
            <button
              key={c}
              onClick={() => toggle(colours, setColours, c)}
              className="flex w-full items-center gap-2.5 text-left text-sm"
            >
              <span
                className={`h-5 w-5 shrink-0 rounded-full ring-offset-2 ring-offset-card transition-all ${
                  colours.includes(c) ? "ring-2 ring-primary" : "ring-1 ring-border"
                }`}
                style={{ backgroundColor: COLOUR_SWATCHES[c] }}
              />
              <span className={colours.includes(c) ? "font-medium" : "text-muted-foreground"}>{c}</span>
            </button>
          ))}
        </div>
      </FilterGroup>
    </div>
  );

  return (
    <div className="container-page py-8">
      <nav className="mb-5 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{category ?? (q ? `Search: ${q}` : "All products")}</span>
      </nav>

      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl sm:text-4xl">{category ?? (q ? `Results for “${q}”` : "All products")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {results.length} {results.length === 1 ? "style" : "styles"} · prices from{" "}
            {results.length ? inr(Math.min(...results.map((r) => r.price))) : "—"}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters{activeCount ? ` (${activeCount})` : ""}
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort products"
            className="h-11 rounded-full border border-border bg-card px-4 text-sm outline-none focus:border-rose-deep"
          >
            <option value="popular">Sort: Popularity</option>
            <option value="new">Newest first</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="rating">Customer rating</option>
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-44 card-surface p-5">{filters}</div>
        </aside>

        <div>
          {results.length === 0 ? (
            <div className="card-surface grid place-items-center px-6 py-20 text-center">
              <p className="font-display text-xl">No styles match those filters</p>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Try widening your price range or clearing a colour — our full collection has{" "}
                {PRODUCTS.length} styles.
              </p>
              <button
                onClick={clearAll}
                className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm text-primary-foreground"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-3">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            aria-label="Close filters"
            className="flex-1 bg-foreground/40"
            onClick={() => setOpen(false)}
          />
          <div className="w-[85%] max-w-sm overflow-y-auto bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-lg">Filters</p>
              <button aria-label="Close" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            {filters}
            <button
              onClick={() => setOpen(false)}
              className="mt-8 w-full rounded-full bg-primary py-3 text-sm text-primary-foreground"
            >
              Show {results.length} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border/70 pt-5 first:border-0 first:pt-0">
      <p className="mb-3 text-sm font-medium">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-[var(--primary)]"
      />
      <span className={checked ? "font-medium" : "text-muted-foreground"}>{label}</span>
    </label>
  );
}
