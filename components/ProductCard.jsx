"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star } from "lucide-react";
import BottleGlyph from "./BottleGlyph";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!product.variantId) return;
    addToCart({
      variantId: product.variantId,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      variantName: product.variantName,
      price: product.price,
      image: product.image,
    });
    showToast(`${product.name} added to your bag.`);
  };

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-ink-line bg-ink-soft/50 transition-all duration-300 hover:border-gold-400/25 hover:shadow-gold hover:-translate-y-0.5 backdrop-blur-sm"
    >
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-ink">
        
        {/* Soft background light behind bottle */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(202,161,75,0.02),transparent_70%)] pointer-events-none" />

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

        {product.badge && (
          <span className="absolute left-3.5 top-3.5 rounded-full bg-gold-gradient px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-ink shadow-gold">
            {product.badge}
          </span>
        )}

        {product.variantId && (
          <button
            onClick={handleQuickAdd}
            aria-label={`Add ${product.name} to bag`}
            className="absolute bottom-3.5 right-3.5 flex h-10 w-10 items-center justify-center rounded-full bg-gold-gradient text-ink opacity-100 shadow-gold transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 hover:scale-105"
          >
            <ShoppingBag className="h-4.5 w-4.5 text-ink" />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
        <p className="text-[9px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gold-300 font-medium">
          Fragrance
          {product.gender && <span className="hidden sm:inline"> · {product.gender}</span>}
        </p>

        <h3 className="mt-1.5 sm:mt-2 font-display text-sm sm:text-lg text-ivory font-medium transition-colors group-hover:text-gold-200 line-clamp-2">
          {product.name}
        </h3>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-1 pt-2.5 sm:pt-3.5">
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="font-semibold text-ivory text-sm sm:text-lg">
              {product.price != null ? `₹${product.price.toLocaleString("en-IN")}` : "—"}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-[10px] sm:text-sm text-ivory/40 line-through">
                ₹{product.oldPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          {product.reviewCount > 0 && product.rating > 0 ? (
            <span className="flex shrink-0 items-center gap-1 text-[11px] sm:text-sm font-semibold text-ivory">
              <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-gold-300 text-gold-300" />
              {product.rating.toFixed(1)}
            </span>
          ) : (
            <span className="flex shrink-0 items-center gap-1 text-[10px] sm:text-xs text-ivory/35">
              <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-ivory/25" />
              New
            </span>
          )}
        </div>

        {!product.inStock && (
          <p className="mt-2.5 text-[10px] uppercase tracking-wider text-red-400 font-semibold">Out of stock</p>
        )}
      </div>
    </Link>
  );
}
