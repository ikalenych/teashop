// src/context/CartContext.tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface CartItem {
  productId: string;
  variantId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  variantIndex: number;
  variantWeight: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (productId: string, variantIndex: number) => void;
  updateQuantity: (
    productId: string,
    variantIndex: number,
    quantity: number,
  ) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "tea-shop-cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Ініціалізуємо одразу з localStorage
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Helper для збереження в localStorage
  const saveToLocalStorage = (cartItems: CartItem[]) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  };

  const addToCart = (
    item: Omit<CartItem, "quantity">,
    quantity: number = 1,
  ) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (i) =>
          i.productId === item.productId &&
          i.variantIndex === item.variantIndex,
      );

      let newItems: CartItem[];

      if (existingIndex !== -1) {
        // Товар вже є - збільшуємо кількість
        newItems = [...prevItems];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity,
        };
      } else {
        // Новий товар - додаємо
        newItems = [...prevItems, { ...item, quantity }];
      }

      // Зберігаємо одразу
      saveToLocalStorage(newItems);
      return newItems;
    });
  };

  const removeFromCart = (productId: string, variantIndex: number) => {
    setItems((prevItems) => {
      const newItems = prevItems.filter(
        (item) =>
          !(item.productId === productId && item.variantIndex === variantIndex),
      );

      // Зберігаємо одразу
      saveToLocalStorage(newItems);
      return newItems;
    });
  };

  const updateQuantity = (
    productId: string,
    variantIndex: number,
    quantity: number,
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantIndex);
      return;
    }

    setItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item.productId === productId && item.variantIndex === variantIndex
          ? { ...item, quantity }
          : item,
      );

      // Зберігаємо одразу
      saveToLocalStorage(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    saveToLocalStorage([]);
  };

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isSidebarOpen,
        openSidebar,
        closeSidebar,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
