import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PRODUCTS, type Product } from "./products";

export type CartItem = {
  id: string;
  size: string;
  colour: string;
  qty: number;
};

export type Order = {
  id: string;
  date: string;
  total: number;
  status: string;
  items: { name: string; qty: number; image: string }[];
};

export type User = { name: string; email: string };

type ShopState = {
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  user: User | null;
  addToCart: (item: CartItem) => void;
  setQty: (key: string, qty: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  placeOrder: (total: number) => Order;
  signIn: (u: User) => void;
  signOut: () => void;
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
    (total: number) => {
      const order: Order = {
        id: "SF" + Math.floor(100000 + Math.random() * 899999),
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        total,
        status: "Confirmed",
        items: cart.map((c) => {
          const p = PRODUCTS.find((x) => x.id === c.id) as Product;
          return { name: p?.name ?? c.id, qty: c.qty, image: p?.images[0] ?? "" };
        }),
      };
      setOrders((prev) => [order, ...prev]);
      setCart([]);
      return order;
    },
    [cart],
  );

  const signIn = useCallback((u: User) => setUser(u), []);
  const signOut = useCallback(() => setUser(null), []);

  const value = useMemo(
    () => ({
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
      hydrated,
    }),
    [cart, wishlist, orders, user, addToCart, setQty, removeFromCart, clearCart, toggleWishlist, placeOrder, signIn, signOut, hydrated],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
}

export function cartTotals(cart: CartItem[]) {
  let mrp = 0;
  let price = 0;
  let count = 0;
  for (const c of cart) {
    const p = PRODUCTS.find((x) => x.id === c.id);
    if (!p) continue;
    mrp += p.mrp * c.qty;
    price += p.price * c.qty;
    count += c.qty;
  }
  const shipping = price > 0 && price < 999 ? 79 : 0;
  return { mrp, price, discount: mrp - price, shipping, total: price + shipping, count };
}
