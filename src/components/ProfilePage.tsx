import { useState } from "react";
import { Package, Heart, LogOut, User as UserIcon } from "lucide-react";
import { useShop } from "@/lib/store";
import { PRODUCTS, inr } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export function ProfilePage() {
  const { orders, wishlist, user, signIn, signOut } = useShop();
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist">("orders");

  // Mock Login for the lite version
  if (!user) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center py-12">
        <UserIcon className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h1 className="font-display text-2xl mb-6">Account Login</h1>
        <button
          onClick={() => signIn({ name: "Guest User", email: "guest@saanvi.com" })}
          className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground"
        >
          Sign In as Guest
        </button>
      </div>
    );
  }

  const wishlistProducts = wishlist
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as typeof PRODUCTS;

  return (
    <div className="container-page py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-border/70">
        <div>
          <h1 className="font-display text-3xl">Hello, {user.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <nav className="flex w-full overflow-x-auto md:w-56 md:flex-col gap-2 hide-scrollbar">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === "orders" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"
            }`}
          >
            <Package className="h-4 w-4" /> My Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("wishlist")}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === "wishlist" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"
            }`}
          >
            <Heart className="h-4 w-4" /> Wishlist ({wishlist.length})
          </button>
        </nav>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {activeTab === "orders" && (
            <div className="space-y-6">
              {orders.length === 0 ? (
                <p className="text-muted-foreground text-sm">You haven't placed any orders yet.</p>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="border-b border-border bg-secondary/30 px-5 py-3 flex flex-wrap justify-between gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider">Order ID</p>
                        <p className="font-medium">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider">Date</p>
                        <p className="font-medium">{order.date}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider">Total</p>
                        <p className="font-medium">{inr(order.total)}</p>
                      </div>
                      <div>
                        <span className="inline-flex rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <ul className="divide-y divide-border/50">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                            <img src={item.image} alt="" className="h-16 w-12 rounded object-cover bg-muted" />
                            <div>
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">Qty: {item.qty}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "wishlist" && (
            <div>
              {wishlistProducts.length === 0 ? (
                <p className="text-muted-foreground text-sm">Your wishlist is empty.</p>
              ) : (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                  {wishlistProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}