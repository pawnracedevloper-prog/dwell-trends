const API_URL = import.meta.env.VITE_API_URL || "https://dwell-trends-backend.vercel.app/api/v1";

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
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
  getProducts: (category?: string) => {
    const query = category ? `?category=${encodeURIComponent(category)}` : "";
    return fetchAPI(`/products${query}`);
  },
  
  // Auth & Users
  login: (credentials: any) => 
    fetchAPI("/users/login", { method: "POST", body: JSON.stringify(credentials) }),
    
  register: (userData: any) => 
    fetchAPI("/users/register", { method: "POST", body: JSON.stringify(userData) }),

  resetPassword: (payload: any) => 
    fetchAPI("/users/reset-password", { method: "POST", body: JSON.stringify(payload) }),
    
  // Orders
  createOrder: (orderData: any) => 
    fetchAPI("/orders", { method: "POST", body: JSON.stringify(orderData) }),
    
  getMyOrders: () => 
    fetchAPI("/orders/myorders"),

  getOrderById: (orderId: string) => 
    fetchAPI(`/orders/${orderId}`),

  // Admin Order Actions
  updateOrderStatus: (orderId: string, statusData: { orderStatus?: string; paymentStatus?: string }) =>
    fetchAPI(`/orders/${orderId}/status`, { method: "PATCH", body: JSON.stringify(statusData) }),
};