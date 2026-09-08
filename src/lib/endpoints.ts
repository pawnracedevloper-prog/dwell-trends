const API_URL = import.meta.env.VITE_API_URL || "https://dwell-trends-backend.vercel.app/api/v1";

export interface ProductQueryParams {
  category?: string;
  mainCategory?: string;
  subCategory?: string;
  dealType?: "None" | "Hot" | "Wow";
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: "price-asc" | "price-desc";
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  // Allow browser to set boundary for FormData (file uploads)
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

export const endpoints = {
  // Products
  getProducts: (params?: ProductQueryParams | string) => {
    if (typeof params === "string") {
      const query = params ? `?category=${encodeURIComponent(params)}` : "";
      return fetchAPI(`/products${query}`);
    }

    if (!params) return fetchAPI("/products");

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    return fetchAPI(`/products${queryString ? `?${queryString}` : ""}`);
  },

  getProductById: (id: string) => fetchAPI(`/products/${id}`),

  createProduct: (formData: FormData) =>
    fetchAPI("/products", {
      method: "POST",
      body: formData,
    }),

  updateProduct: (id: string, formData: FormData) =>
    fetchAPI(`/products/${id}`, {
      method: "PUT",
      body: formData,
    }),

  deleteProduct: (id: string) =>
    fetchAPI(`/products/${id}`, {
      method: "DELETE",
    }),

  // Deal Management
  updateDealStatus: (payload: { productIds: string[]; dealType: string; dealPrice?: number | null }) =>
    fetchAPI("/products/deals", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  // Auth & Users
  login: (credentials: any) =>
    fetchAPI("/users/login", { method: "POST", body: JSON.stringify(credentials) }),

  register: (userData: any) =>
    fetchAPI("/users/register", { method: "POST", body: JSON.stringify(userData) }),

  getProfile: () => fetchAPI("/users/profile"),

  resetPassword: (payload: any) =>
    fetchAPI("/users/reset-password", { method: "POST", body: JSON.stringify(payload) }),

  toggleWishlist: (productId: string) =>
    fetchAPI("/users/wishlist", {
      method: "POST",
      body: JSON.stringify({ productId }),
    }),

  updateProfile: (profileData: any) =>
    fetchAPI("/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),

  // Orders
  createOrder: (orderData: any) =>
    fetchAPI("/orders", { method: "POST", body: JSON.stringify(orderData) }),

  getMyOrders: () => fetchAPI("/orders/myorders"),

  getOrderById: (orderId: string) => fetchAPI(`/orders/${orderId}`),

  // Admin Order Actions
  getAllOrders: () => fetchAPI("/orders/all"),

  updateOrderStatus: (orderId: string, statusData: { orderStatus?: string; paymentStatus?: string }) =>
    fetchAPI(`/orders/${orderId}/status`, { method: "PATCH", body: JSON.stringify(statusData) }),

  submitOrderUtr: (orderId: string, utr: string) =>
    fetchAPI(`/orders/${orderId}/utr`, {
      method: "PATCH",
      body: JSON.stringify({ utr }),
    }),

  // Payment Verification & Gateways
  initiatePayment: (orderId: string) =>
    fetchAPI("/payments/initiate", { method: "POST", body: JSON.stringify({ orderId }) }),

  checkPaymentStatus: (merchantTransactionId: string) =>
    fetchAPI(`/payments/status/${merchantTransactionId}`),
};