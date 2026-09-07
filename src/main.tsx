import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Outlet,
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router";

// 1. Global CSS
import "./styles.css";

// 2. Providers & Layout
import { ShopProvider } from "./lib/store";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";

// 3. Pages & Components
import { HomePage } from "./components/HomePage";
import { ProductsPage } from "./components/ProductsPage";
import { ProductDetailPage } from "./components/ProductDetailPage";
import { CheckoutPage } from "./components/CheckoutPage";
import { ProfilePage } from "./components/ProfilePage";
import { AuthPage } from "./components/AuthPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { CartPage } from "./components/CartPage";
import { ForgotPasswordPage } from "./components/ForgotPasswordPage";
import { OrderTrackingPage } from "./pages/OrderTrackingPage"; // Placed in components directory alongside other views

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

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboard,
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

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: AuthPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forgot-password",
  component: ForgotPasswordPage,
});

const orderTrackingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders/track/$orderId",
  component: OrderTrackingPage,
});

// --- ROUTER ASSEMBLY ---
const routeTree = rootRoute.addChildren([
  indexRoute,
  productsRoute,
  adminRoute,
  productDetailRoute,
  checkoutRoute,
  profileRoute,
  authRoute,
  cartRoute,
  forgotPasswordRoute,
  orderTrackingRoute,
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