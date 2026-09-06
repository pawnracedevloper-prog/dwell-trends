import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { BRAND, PRODUCTS, inr } from "@/lib/products";
import { cartTotals, itemKey, useShop } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: `Shopping Bag — ${BRAND}` },
      { name: "description", content: "Review the suits and kurtis in your bag before checkout." },
      { property: "og:title", content: `Shopping Bag — ${BRAND}` },
      { property: "og:description", content: "Review your selected ethnic wear and proceed to checkout." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { cart, setQty, removeFromCart, toggleWishlist } = useShop();
  const t = cartTotals(cart);

  if (cart.length === 0) {
    return (
      <div className="container-page grid place-items-center py-24 text-center">
        <ShoppingBag className="h-12 w-12 text-rose-deep" />
        <h1 className="mt-5 text-2xl">Your bag is empty</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Nothing here yet. Have a look at this season's chikankari and Banarasi edits.
        </p>
        <Link
          to="/products"
          search={{ category: undefined, q: undefined }}
          className="mt-7 rounded-full bg-primary px-7 py-3 text-sm text-primary-foreground"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-3xl sm:text-4xl">Shopping bag</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t.count} item(s) reserved for you</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-4">
          {cart.map((item) => {
            const p = PRODUCTS.find((x) => x.id === item.id);
            if (!p) return null;
            const k = itemKey(item);
            return (
              <div key={k} className="card-surface grid grid-cols-[6rem_minmax(0,1fr)] gap-4 p-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
                <Link to="/product/$productId" params={{ productId: p.id }} className="overflow-hidden rounded-lg">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    loading="lazy"
                    className="aspect-[3/4] w-full object-cover"
                  />
                </Link>
                <div className="min-w-0">
                  <Link
                    to="/product/$productId"
                    params={{ productId: p.id }}
                    className="line-clamp-2 text-sm font-medium hover:text-primary sm:text-base"
                  >
                    {p.name}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Size {item.size} · {item.colour} · {p.fabric}
                  </p>
                  <div className="mt-2 flex flex-wrap items-baseline gap-2">
                    <span className="font-semibold">{inr(p.price * item.qty)}</span>
                    <span className="text-xs text-muted-foreground line-through">
                      {inr(p.mrp * item.qty)}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <div className="flex items-center rounded-full border border-border">
                      <button
                        aria-label="Decrease quantity"
                        onClick={() => setQty(k, item.qty - 1)}
                        className="grid h-9 w-9 place-items-center rounded-l-full transition-colors hover:bg-accent"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-9 text-center text-sm font-medium">{item.qty}</span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() => setQty(k, item.qty + 1)}
                        className="grid h-9 w-9 place-items-center rounded-r-full transition-colors hover:bg-accent"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="text-xs font-medium text-muted-foreground hover:text-rose-deep"
                    >
                      Save for later
                    </button>
                    <button
                      onClick={() => removeFromCart(k)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="h-fit lg:sticky lg:top-44">
          <div className="card-surface p-6">
            <p className="eyebrow text-muted-foreground">Price summary</p>
            <dl className="mt-4 space-y-3 text-sm">
              <Row label={`Total MRP (${t.count} items)`} value={inr(t.mrp)} />
              <Row label="Discount" value={`− ${inr(t.discount)}`} accent />
              <Row label="Delivery" value={t.shipping ? inr(t.shipping) : "Free"} accent={!t.shipping} />
              <div className="border-t border-border pt-3">
                <Row label="Total payable" value={inr(t.total)} bold />
              </div>
            </dl>
            <p className="mt-3 rounded-lg bg-rose-soft px-3 py-2 text-xs text-primary">
              You save {inr(t.discount)} on this order
            </p>
            <Link
              to="/checkout"
              className="mt-5 block rounded-full bg-primary py-3.5 text-center text-sm font-medium text-primary-foreground transition-all hover:shadow-[var(--shadow-lift)]"
            >
              Proceed to checkout
            </Link>
            <Link
              to="/products"
              search={{ category: undefined, q: undefined }}
              className="mt-3 block text-center text-xs text-muted-foreground hover:text-primary"
            >
              Continue shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
  bold,
}: {
  label: string;
  value: string;
  accent?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className={bold ? "font-medium" : "text-muted-foreground"}>{label}</dt>
      <dd className={`${bold ? "text-base font-semibold" : ""} ${accent ? "text-success" : ""}`}>
        {value}
      </dd>
    </div>
  );
}
