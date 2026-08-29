"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Check, ShoppingBag } from "lucide-react";
import BottleGlyph from "@/components/BottleGlyph";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export default function BundleBuilder({ products, bottleCount }) {
  const { addToCart, setDrawerOpen } = useCart();
  const { showToast } = useToast();
  const [selectedIds, setSelectedIds] = useState([]);

  const isFull = selectedIds.length >= bottleCount;
  const isComplete = selectedIds.length === bottleCount;

  const total = useMemo(() => {
    return products.filter((p) => selectedIds.includes(p.variantId)).reduce((sum, p) => sum + p.price, 0);
  }, [products, selectedIds]);

  const toggle = (product) => {
    if (!product.inStock) return;
    setSelectedIds((prev) => {
      if (prev.includes(product.variantId)) return prev.filter((id) => id !== product.variantId);
      if (prev.length >= bottleCount) return prev;
      return [...prev, product.variantId];
    });
  };

  const handleAddBundle = () => {
    if (!isComplete) return;
    const picked = products.filter((p) => selectedIds.includes(p.variantId));
    picked.forEach((p) => {
      addToCart({
        variantId: p.variantId,
        productId: p.productId,
        slug: p.slug,
        name: p.name,
        variantName: p.variantName,
        price: p.price,
        image: p.image,
      });
    });
    setDrawerOpen(true);
    showToast(`${picked.length} bottles added to your bag.`);
    setSelectedIds([]);
  };

  return (
    <div className="pb-28">
      <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => {
          const selected = selectedIds.includes(product.variantId);
          const disabled = !product.inStock || (isFull && !selected);

          return (
            <button
              key={product.variantId}
              type="button"
              onClick={() => toggle(product)}
              disabled={disabled}
              className={`group flex h-full flex-col overflow-hidden rounded-[2rem] border bg-ink-soft/50 text-left backdrop-blur-sm transition-all duration-300 ${
                selected
                  ? "border-gold-400/60 shadow-gold"
                  : "border-ink-line hover:border-gold-400/25 hover:shadow-gold hover:-translate-y-0.5"
              } ${disabled && !selected ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-ink">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-ink-gradient">
                    <BottleGlyph className="h-16 w-auto opacity-30 text-gold-300/60" />
                  </div>
                )}

                <span
                  className={`absolute right-3.5 top-3.5 flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-300 ${
                    selected
                      ? "border-gold-300 bg-gold-gradient text-ink shadow-gold"
                      : "border-ivory/30 bg-ink/50 text-transparent"
                  }`}
                >
                  <Check className="h-4 w-4" />
                </span>

                {!product.inStock && (
                  <span className="absolute left-3.5 top-3.5 rounded-full bg-red-500/20 px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-red-300">
                    Sold out
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-3.5 sm:p-5">
                <h3 className="font-display text-sm sm:text-lg text-ivory font-medium line-clamp-2">{product.name}</h3>
                <p className="mt-1 text-xs text-ivory/40">{product.variantName}</p>
                <div className="mt-auto flex items-baseline gap-1 sm:gap-2 pt-2.5 sm:pt-3.5">
                  <span className="font-semibold text-ivory text-sm sm:text-lg">₹{product.price.toLocaleString("en-IN")}</span>
                  {product.oldPrice && product.oldPrice > product.price && (
                    <span className="text-[10px] sm:text-sm text-ivory/40 line-through">₹{product.oldPrice.toLocaleString("en-IN")}</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gold-400/10 bg-[#0b0a0a]/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-wrap flex-wrap items-center justify-between gap-3 px-6 py-4 md:px-12">
          <div>
            <p className="text-sm font-medium text-ivory">
              Selected <span className="text-gold-300">{selectedIds.length}</span> / {bottleCount}
            </p>
            {total > 0 && <p className="text-xs text-ivory/40">Total ₹{total.toLocaleString("en-IN")}</p>}
          </div>
          <button
            type="button"
            onClick={handleAddBundle}
            disabled={!isComplete}
            className="btn-gold flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold tracking-widest uppercase disabled:opacity-40"
          >
            <ShoppingBag className="h-4 w-4" /> Add Bundle to Bag
          </button>
        </div>
      </div>
    </div>
  );
}
