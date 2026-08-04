"use client";

import { createContext, useContext, useState } from "react";

// Shared selected-size state so the gallery (which needs to know which size
// is active in order to show that size's mapped images) and the purchase
// panel (which owns the size picker) can stay in sync despite living in
// separate branches of the product detail page's layout.
const ProductVariantContext = createContext(null);

export function ProductVariantProvider({ variants, children }) {
  // Glass is the default bottle shown up front; Plastic (where offered) is
  // only ever an explicit alternate the shopper opts into on the page.
  const defaultVariant = variants?.find((v) => (v.bottle_type || "glass") === "glass") || variants?.[0] || null;
  const [selectedId, setSelectedId] = useState(defaultVariant?.id ?? null);
  const selected = variants?.find((v) => v.id === selectedId) || defaultVariant;

  return (
    <ProductVariantContext.Provider value={{ selected, selectedId, setSelectedId }}>
      {children}
    </ProductVariantContext.Provider>
  );
}

export function useProductVariant() {
  return useContext(ProductVariantContext);
}
