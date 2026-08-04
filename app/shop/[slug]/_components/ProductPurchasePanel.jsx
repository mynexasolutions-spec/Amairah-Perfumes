"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, MessageSquare, Check, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { whatsappLink } from "@/lib/constants";
import { useProductVariant } from "./ProductVariantContext";

export default function ProductPurchasePanel({ product, variants }) {
  const router = useRouter();
  const ctx = useProductVariant();
  const defaultVariant = variants.find((v) => (v.bottle_type || "glass") === "glass") || variants[0];
  const [localSelectedId, setLocalSelectedId] = useState(defaultVariant?.id);
  const selectedId = ctx ? ctx.selectedId : localSelectedId;
  const setSelectedId = ctx ? ctx.setSelectedId : setLocalSelectedId;
  const [quantity, setQuantity] = useState(1);
  const { addToCart, setDrawerOpen } = useCart();
  const { showToast } = useToast();

  const selected = variants.find((v) => v.id === selectedId) || defaultVariant;
  const inStock = selected && selected.stock_quantity > 0;

  if (!variants || variants.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-ink-line p-6 text-sm text-ivory/50">
        This fragrance is currently unavailable. Message us on WhatsApp for availability.
      </div>
    );
  }

  // One "Select Size" button per distinct size name; a size that has both a
  // Glass and a Plastic variant additionally shows a bottle-type toggle,
  // defaulting to Glass, with Plastic offered at its own (lower) price.
  const sizeNames = [...new Set(variants.map((v) => v.variant_name))];
  const variantsForSelectedSize = variants.filter((v) => v.variant_name === selected.variant_name);

  const selectSize = (sizeName) => {
    const optionsForSize = variants.filter((v) => v.variant_name === sizeName);
    const glass = optionsForSize.find((v) => (v.bottle_type || "glass") === "glass");
    setSelectedId((glass || optionsForSize[0]).id);
  };

  const selectBottleType = (bottleType) => {
    const match = variantsForSelectedSize.find((v) => (v.bottle_type || "glass") === bottleType);
    if (match) setSelectedId(match.id);
  };

  const buildCartItem = () => ({
    variantId: selected.id,
    productId: product.id,
    slug: product.slug,
    name: product.name,
    variantName: `${selected.variant_name} (${selected.bottle_type === "plastic" ? "Plastic" : "Glass"} Bottle)`,
    price: selected.price,
    image: product.images?.[0]?.image_url || product.featured_image_url || null,
  });

  const handleAdd = () => {
    if (!selected || !inStock) return;
    addToCart(buildCartItem(), quantity);
    showToast(`${product.name} (${buildCartItem().variantName}) added to your bag.`);
    setDrawerOpen(true);
  };

  const handleBuyNow = () => {
    if (!selected || !inStock) return;
    addToCart(buildCartItem(), quantity);
    setDrawerOpen(false);
    router.push("/checkout");
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Price block */}
      <div className="flex flex-wrap items-baseline gap-4">
        <span className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400">
          ₹{selected.price.toLocaleString("en-IN")}
        </span>
        {selected.original_price && selected.original_price > selected.price && (
          <>
            <span className="text-base text-ivory/40 line-through">
              ₹{selected.original_price.toLocaleString("en-IN")}
            </span>
            <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              Save {Math.round(((selected.original_price - selected.price) / selected.original_price) * 100)}%
            </span>
          </>
        )}
      </div>

      {/* Size buttons */}
      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-300">
          Select Size
        </p>
        <div className="flex flex-wrap gap-2">
          {sizeNames.map((name) => {
            const optionsForSize = variants.filter((v) => v.variant_name === name);
            const sizeInStock = optionsForSize.some((v) => v.stock_quantity > 0);
            const isSelected = selected.variant_name === name;
            return (
              <button
                key={name}
                disabled={!sizeInStock}
                onClick={() => selectSize(name)}
                className={`flex items-center gap-1.5 rounded-2xl border px-5 py-2.5 text-sm sm:text-base transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-20 ${
                  isSelected
                    ? "bg-gold-gradient text-ink border-transparent font-semibold shadow-gold/20 scale-[1.02]"
                    : "border-ink-line bg-ink-soft/40 text-ivory/60 hover:border-gold-400/30 hover:text-ivory"
                }`}
              >
                {isSelected && <Check className="h-3.5 w-3.5" />}
                {name}
              </button>
            );
          })}
        </div>
        {!inStock && <p className="mt-3 text-sm text-red-400 font-semibold">This size is out of stock.</p>}
      </div>

      {/* Bottle type — always shown for the selected size; just one button
          (Glass, already selected) when no Plastic alternative exists for it */}
      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-300">
          Bottle Type
        </p>
        <div className="flex flex-wrap gap-2">
          {variantsForSelectedSize.map((v) => {
            const bottleType = v.bottle_type || "glass";
            const isSelected = selected.id === v.id;
            return (
              <button
                key={v.id}
                disabled={v.stock_quantity <= 0}
                onClick={() => selectBottleType(bottleType)}
                className={`flex items-center gap-1.5 rounded-2xl border px-5 py-2.5 text-sm sm:text-base transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-20 ${
                  isSelected
                    ? "bg-gold-gradient text-ink border-transparent font-semibold shadow-gold/20 scale-[1.02]"
                    : "border-ink-line bg-ink-soft/40 text-ivory/60 hover:border-gold-400/30 hover:text-ivory"
                }`}
              >
                {isSelected && <Check className="h-3.5 w-3.5" />}
                {bottleType === "plastic" ? "Plastic Bottle" : "Glass Bottle"}
                <span className="text-xs opacity-70">₹{v.price.toLocaleString("en-IN")}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="flex w-fit items-center justify-between rounded-full border border-ink-line bg-ink-soft/40 px-5 py-3">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="text-ivory/60 hover:text-gold-200 transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-8 text-center text-sm font-semibold text-ivory">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="text-ivory/60 hover:text-gold-200 transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Add to Bag + Buy Now CTA */}
      <div className="flex flex-col sm:flex-row items-stretch gap-4">
        <button
          onClick={handleAdd}
          disabled={!inStock}
          className="btn-gold flex-1 py-4 text-xs font-semibold tracking-widest uppercase disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center gap-2 animate-shimmer bg-[length:200%_200%] shadow-[0_4px_20px_rgba(212,163,89,0.15)] hover:shadow-[0_4px_28px_rgba(212,163,89,0.3)] hover:-translate-y-0.5 transition-all duration-300"
        >
          <ShoppingBag className="h-4.5 w-4.5 text-ink" /> Add to Bag
        </button>
        <button
          onClick={handleBuyNow}
          disabled={!inStock}
          className="btn-outline flex-1 py-4 text-xs font-semibold tracking-widest uppercase disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center gap-2 hover:bg-gold-400/10 hover:border-gold-300 hover:-translate-y-0.5 transition-all duration-300"
        >
          <Zap className="h-4 w-4 text-gold-300" /> Buy Now
        </button>
      </div>

      {/* WhatsApp Link */}
      <a
        href={whatsappLink(
          `Hi Amairah Perfumes, I'd like to order ${product.name} (${buildCartItem().variantName}).`
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 w-full text-center text-sm text-ivory/40 hover:text-emerald-400 transition-colors py-2.5 border border-dashed border-ink-line/45 rounded-2xl hover:border-emerald-500/25 bg-ink/20"
      >
        <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> Prefer to order on WhatsApp instead?
      </a>
    </div>
  );
}
