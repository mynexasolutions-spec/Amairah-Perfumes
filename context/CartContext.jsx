"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(undefined);
const STORAGE_KEY = "amairah-cart";

// Merges any entries that share a variantId (e.g. from stale carts saved
// before add-to-cart de-duplication existed) so React list keys stay unique.
function dedupeCart(items) {
  if (!Array.isArray(items)) return [];
  const merged = [];
  const indexByVariantId = new Map();
  for (const item of items) {
    const existingIndex = indexByVariantId.get(item.variantId);
    if (existingIndex === undefined) {
      indexByVariantId.set(item.variantId, merged.length);
      merged.push({ ...item });
    } else {
      merged[existingIndex].quantity += item.quantity;
    }
  }
  return merged;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setCart(dedupeCart(JSON.parse(saved)));
    } catch (e) {
      // ignore corrupt cart data
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  const addToCart = (item, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);
      if (existing) {
        return prev.map((i) =>
          i.variantId === item.variantId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
    setDrawerOpen(true);
  };

  const removeFromCart = (variantId) => {
    setCart((prev) => prev.filter((i) => i.variantId !== variantId));
  };

  const updateQuantity = (variantId, quantity) => {
    if (quantity <= 0) return removeFromCart(variantId);
    setCart((prev) => prev.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        drawerOpen,
        setDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
