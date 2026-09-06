import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Outlet,
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router";

// 1. Critical: Import global CSS first so Tailwind applies universally
import "./styles.css";

// 2. Import Provider & Layout Components
import { ShopProvider } from "./lib/store";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";

// 3. Import Pages
import { HomePage } from "./components/HomePage";
import { ProductsPage } from "./components/ProductsPage";
import { ProductDetailPage } from "./components/ProductDetailPage";
import { CheckoutPage } from "./components/CheckoutPage";
import { ProfilePage } from "./components/ProfilePage";

// --- ROOT LAYOUT ---
const rootRoute = createRootRoute({
  component: function RootLayout() {
    const [cartOpen, setCartOpen] = useState(false);
    return (
      <ShopProvider>
        <div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
          <Header onOpenCart={() => setCartOpen(true)} />
          <main className="flex-1">
            <Outlet />
          </main>
          <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
          <Footer />
        </div>
      </ShopProvider>
    );
  },
});

// --- ROUTES ---
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products",
  component: ProductsPage,
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$productId",
  component: ProductDetailPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});

// --- ROUTER ASSEMBLY ---
const routeTree = rootRoute.addChildren([
  indexRoute,
  productsRoute,
  productDetailRoute,
  checkoutRoute,
  profileRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// --- RENDER APP ---
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);