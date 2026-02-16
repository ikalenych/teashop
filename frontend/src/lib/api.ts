import type { Product } from "../data/products";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper для отримання токена
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Адаптер: backend → frontend
const adaptProduct = (apiProduct: any): Product => {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    slug: apiProduct.slug,
    category: apiProduct.category,
    description: apiProduct.description || "",

    origin: apiProduct.origin || [],
    flavor: apiProduct.flavor || [],
    caffeine: apiProduct.caffeine || "medium",

    organic: apiProduct.organic,
    vegan: apiProduct.vegan,

    image: apiProduct.image, // ← Backend тепер повертає "image"

    allergens: apiProduct.allergens || [],
    qualities: apiProduct.qualities || [],
    ingredients: apiProduct.ingredients || "",

    brewing: apiProduct.brewing || {
      servingSize: "1 tsp per cup",
      waterTemp: "100°C",
      steepingTime: "3-5 minutes",
      colorAfter3Min: "#8B4513",
    },

    variants:
      apiProduct.variants?.map((v: any) => ({
        id: v.id, // ← Тепер є!
        weight: v.weight,
        price: Number(v.price),
        stock: v.stock || 0,
      })) || [],

    price: apiProduct.price || 0,

    createdAt: apiProduct.createdAt,
    updatedAt: apiProduct.updatedAt,
  };
};

export const api = {
  register: async (data: { email: string; password: string; name: string }) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  login: async (data: { email: string; password: string }) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getProducts: async () => {
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();
    return data.map(adaptProduct);
  },

  getProductBySlug: async (slug: string) => {
    const response = await fetch(`${API_URL}/products/slug/${slug}`);
    const data = await response.json();
    return adaptProduct(data);
  },

  // ========== ORDERS API ========== //

  createOrder: async (data: {
    shippingFirstName: string;
    shippingLastName: string;
    shippingStreet: string;
    shippingPostCode: string;
    shippingCity: string;
    shippingCountry: string;
    billingSameAsShipping: boolean;
    billingFirstName?: string;
    billingLastName?: string;
    billingStreet?: string;
    billingPostCode?: string;
    billingCity?: string;
    billingCountry?: string;
    email: string;
    paymentType: string;
    items: Array<{ variantId: string; quantity: number }>;
  }) => {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    return response.json();
  },

  getUserOrders: async () => {
    const response = await fetch(`${API_URL}/orders`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to get orders");
    }

    return response.json();
  },

  getOrderById: async (id: string) => {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to get order");
    }

    return response.json();
  },

  // ========== ADMIN API ========== //

  getAllOrders: async (status?: string, limit = 50, offset = 0) => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    params.append("limit", limit.toString());
    params.append("offset", offset.toString());

    const response = await fetch(`${API_URL}/orders/admin/all?${params}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to get all orders");
    }

    return response.json();
  },
  createProduct: async (data: any) => {
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create product");
    }

    return response.json();
  },

  updateProduct: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update product");
    }

    return response.json();
  },

  deleteProduct: async (id: string) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }

    return response.json();
  },
  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update order status");
    }

    return response.json();
  },
};
