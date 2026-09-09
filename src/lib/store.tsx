import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { endpoints } from "./endpoints";

export type CartItem = {
  id: string;          // Maps to product _id from MongoDB
  size: string;
  colour: string;
  qty: number;
  productDetails?: any; // To hold live fetched product data cache in cart if needed
  productData?: any;
};

export type Order = {
  id: string;
  date: string;
  total: number;
  status: string;
  items: { name: string; qty: number; image: string }[];
};

export type User = { name: string; email: string; role?: string; walletTokens?: number };

type ShopState = {
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  user: User | null;
  setUser: (u: User | null) => void;
  addToCart: (item: CartItem) => void;
  setQty: (key: string, qty: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  placeOrder: (total: number, orderPayload?: any) => Promise<Order>;
  signIn: (u: User) => void;
  signOut: () => void;
  logout: () => void;
  hydrated: boolean;
};

const ShopContext = createContext<ShopState | null>(null);

export const itemKey = (i: CartItem) => `${i.id}__${i.size}__${i.colour}`;

const LS = "saanvi-shop-v1";

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS);
      if (raw) {
        const d = JSON.parse(raw);
        setCart(d.cart ?? []);
        setWishlist(d.wishlist ?? []);
        setOrders(d.orders ?? []);
        setUser(d.user ?? null);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LS, JSON.stringify({ cart, wishlist, orders, user }));
  }, [cart, wishlist, orders, user, hydrated]);

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      const k = itemKey(item);
      const found = prev.find((p) => itemKey(p) === k);
      if (found) return prev.map((p) => (itemKey(p) === k ? { ...p, qty: p.qty + item.qty } : p));
      return [...prev, item];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setCart((prev) =>
      prev.flatMap((p) => (itemKey(p) === key ? (qty <= 0 ? [] : [{ ...p, qty }]) : [p])),
    );
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setCart((prev) => prev.filter((p) => itemKey(p) !== key));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const placeOrder = useCallback(
    async (total: number, orderPayload?: any) => {
      try {
        const res = await endpoints.createOrder(orderPayload || { total, items: cart });
        const newOrder: Order = {
          id: res.order?.id || res.order?._id || "SF" + Math.floor(100000 + Math.random() * 899999),
          date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
          total,
          status: "Confirmed",
          items: cart.map((c) => ({
            name: c.productDetails?.name || c.id,
            qty: c.qty,
            image: c.productDetails?.images?.[0]?.url || "",
          })),
        };
        setOrders((prev) => [newOrder, ...prev]);
        setCart([]);
        return newOrder;
      } catch (err) {
        const fallbackOrder: Order = {
          id: "SF" + Math.floor(100000 + Math.random() * 899999),
          date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
          total,
          status: "Confirmed",
          items: cart.map((c) => ({
            name: c.id,
            qty: c.qty,
            image: "",
          })),
        };
        setOrders((prev) => [fallbackOrder, ...prev]);
        setCart([]);
        return fallbackOrder;
      }
    },
    [cart],
  );

  const signIn = useCallback((u: User) => setUser(u), []);

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem(LS);
  }, []);

  const logout = signOut;

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      orders,
      user,
      setUser,
      addToCart,
      setQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      placeOrder,
      signIn,
      signOut,
      logout,
      hydrated,
    }),
    [
      cart,
      wishlist,
      orders,
      user,
      addToCart,
      setQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      placeOrder,
      signIn,
      signOut,
      logout,
      hydrated,
    ],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
}

export function cartTotals(cart: CartItem[], liveProductsMap?: Map<string, any>) {
  let mrp = 0;
  let price = 0;
  let count = 0;
  for (const c of cart) {
    const p = liveProductsMap?.get(c.id) || c.productDetails || c.productData;
    if (!p) {
      count += c.qty;
      continue;
    }
    mrp += (p.mrp || p.price) * c.qty;
    price += (p.dealPrice || p.price) * c.qty;
    count += c.qty;
  }
  const shipping = price > 0 && price < 999 ? 79 : 0;
  return {
    mrp: mrp || price,
    price,
    discount: mrp && mrp > price ? mrp - price : 0,
    shipping,
    total: price + shipping,
    count,
  };
}