"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft, ChevronRight, CreditCard, Minus, Plus, ShoppingBag, Sparkles, X } from "lucide-react";
import BottleGlyph from "@/components/BottleGlyph";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

function QuantityStepper({ value, onDecrease, onIncrease, increaseDisabled, className = "" }) {
  return (
    <div className={`flex items-center justify-between rounded-full border border-gold-300/40 bg-gold-400/10 p-1 ${className}`}>
      <button
        type="button"
        onClick={onDecrease}
        aria-label="Decrease quantity"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gold-200 transition-colors hover:bg-gold-400/15"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="min-w-[1.5rem] text-center text-sm font-semibold text-ivory">{value}</span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={increaseDisabled}
        aria-label="Increase quantity"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gold-200 transition-colors hover:bg-gold-400/15 disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function ProductModal({ product, quantity, maxQuantity, onSetQuantity, onClose }) {
  const [qtyInput, setQtyInput] = useState(Math.max(1, quantity));

  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const hasCutPrice = product.oldPrice && product.oldPrice > product.price;
  const gallery = product.images?.length ? product.images : product.image ? [product.image] : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = gallery[activeIndex] || null;

  const soldOut = !product.inStock;
  const noRoom = maxQuantity <= 0;
  const isUnchanged = qtyInput === quantity;

  let label = "Add to Bag";
  if (soldOut) label = "Sold Out";
  else if (noRoom) label = "Bundle Full";
  else if (qtyInput === 0) label = "Remove from Bag";
  else if (quantity > 0) label = isUnchanged ? "Added" : "Update Quantity";

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />

      <div className="relative grid w-full max-w-2xl animate-fadeUp grid-cols-1 overflow-hidden rounded-[2rem] border border-gold-400/15 bg-gradient-to-b from-[#120f0d] via-[#0b0a0a] to-[#080707] shadow-[0_30px_80px_rgba(0,0,0,0.8),0_0_50px_rgba(212,163,89,0.05)] sm:grid-cols-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="group absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-gold-400/15 bg-ink/60 text-ivory/70 backdrop-blur-md transition-all duration-300 hover:border-gold-400/30 hover:text-gold-300"
        >
          <X className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
        </button>

        <div className="flex flex-col">
          <div className="relative aspect-square shrink-0 overflow-hidden bg-ink">
            {activeImage ? (
              <Image src={activeImage} alt={product.name} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-ink-gradient">
                <BottleGlyph className="h-24 w-auto opacity-30 text-gold-300/60" />
              </div>
            )}
            {soldOut && (
              <span className="absolute left-4 top-4 rounded-full bg-red-500/20 px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-red-300">
                Sold out
              </span>
            )}

            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveIndex((i) => (i - 1 + gallery.length) % gallery.length)}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-gold-400/15 bg-ink/60 text-ivory/70 backdrop-blur-md transition-all duration-300 hover:border-gold-400/30 hover:text-gold-300"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIndex((i) => (i + 1) % gallery.length)}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-gold-400/15 bg-ink/60 text-ivory/70 backdrop-blur-md transition-all duration-300 hover:border-gold-400/30 hover:text-gold-300"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="flex gap-2 overflow-x-auto p-3 scrollbar-thin scrollbar-thumb-gold-400/10">
              {gallery.map((url, i) => (
                <button
                  key={url + i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border transition-all duration-200 ${
                    i === activeIndex ? "border-gold-300" : "border-ink-line opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={url} alt="" fill sizes="48px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col p-6 sm:p-8">
          <p className="eyebrow">
            <span className="gold-line" /> {product.variantName}
          </p>
          <h2 className="font-display mt-3 text-2xl sm:text-3xl font-light text-ivory">{product.name}</h2>

          <div className="mt-4 flex items-baseline gap-2.5">
            <span className="font-display text-3xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {hasCutPrice && <span className="text-base text-ivory/40 line-through">₹{product.oldPrice.toLocaleString("en-IN")}</span>}
          </div>

          {product.description && <p className="mt-4 text-base leading-relaxed text-ivory/65 font-light">{product.description}</p>}

          {!soldOut && !noRoom && (
            <div className="mt-6 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-ivory/40">Quantity</span>
              <QuantityStepper
                value={qtyInput}
                onDecrease={() => setQtyInput((q) => Math.max(0, q - 1))}
                onIncrease={() => setQtyInput((q) => Math.min(quantity + maxQuantity, q + 1))}
                increaseDisabled={qtyInput >= quantity + maxQuantity}
                className="px-1"
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              if (!isUnchanged) onSetQuantity(product, qtyInput);
              onClose();
            }}
            disabled={soldOut || noRoom}
            className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${
              !isUnchanged && !soldOut && !noRoom
                ? "btn-gold"
                : quantity > 0
                ? "border border-gold-300/50 bg-gold-400/10 text-gold-200"
                : "cursor-not-allowed border border-ink-line text-ivory/30"
            }`}
          >
            {quantity > 0 && isUnchanged ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
            {label}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BundleBuilder({ products, bottleCount, fixedPrice }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const [quantities, setQuantities] = useState({});
  const [modalProduct, setModalProduct] = useState(null);

  const totalSelected = useMemo(() => Object.values(quantities).reduce((sum, q) => sum + q, 0), [quantities]);
  const isFull = totalSelected >= bottleCount;
  const isComplete = totalSelected === bottleCount;
  const remaining = bottleCount - totalSelected;

  // One entry per picked unit, in product-grid order — used for the total
  // price so repeated picks of the same product are counted correctly.
  const selectedUnits = useMemo(() => {
    const units = [];
    for (const product of products) {
      const qty = quantities[product.variantId] || 0;
      for (let i = 0; i < qty; i++) units.push(product);
    }
    return units;
  }, [products, quantities]);

  // One entry per distinct picked product (with its quantity attached), so
  // the dock shows a single thumbnail with a "×N" badge instead of N copies.
  const selectedGroups = useMemo(
    () =>
      products
        .map((product) => ({ product, qty: quantities[product.variantId] || 0 }))
        .filter((g) => g.qty > 0),
    [products, quantities]
  );

  const naturalTotal = useMemo(() => selectedUnits.reduce((sum, p) => sum + p.price, 0), [selectedUnits]);

  const hasBundlePrice = isComplete && fixedPrice != null && fixedPrice < naturalTotal;
  const total = hasBundlePrice ? fixedPrice : naturalTotal;
  const savings = hasBundlePrice ? naturalTotal - fixedPrice : 0;

  // Sets an exact quantity for a product, clamped to [0, current + remaining
  // room], so the total picked across all products never exceeds bottleCount.
  const setQuantity = (product, qty) => {
    if (!product.inStock) return;
    const current = quantities[product.variantId] || 0;
    const roomForThis = bottleCount - totalSelected + current;
    const clamped = Math.max(0, Math.min(qty, roomForThis));
    setQuantities((prev) => {
      if (clamped === 0) {
        const { [product.variantId]: _omit, ...rest } = prev;
        return rest;
      }
      return { ...prev, [product.variantId]: clamped };
    });
  };

  const addOne = (product) => setQuantity(product, (quantities[product.variantId] || 0) + 1);
  const removeOne = (product) => setQuantity(product, (quantities[product.variantId] || 0) - 1);

  const handleCheckoutBundle = () => {
    if (!isComplete) return;
    const bundleGroupId = `bundle-${Date.now()}`;
    Object.entries(quantities).forEach(([variantId, qty]) => {
      const p = products.find((prod) => prod.variantId === variantId);
      if (!p || qty <= 0) return;
      addToCart(
        {
          variantId: p.variantId,
          productId: p.productId,
          slug: p.slug,
          name: p.name,
          variantName: p.variantName,
          price: p.price,
          image: p.image,
          bundleGroupId,
        },
        qty
      );
    });
    showToast(`${totalSelected} bottles added — let's checkout!`);
    setQuantities({});
    router.push("/checkout");
  };

  return (
    <div className="pb-56 sm:pb-48">
      <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product, index) => {
          const qty = quantities[product.variantId] || 0;
          const selected = qty > 0;
          const disabled = !product.inStock || (isFull && !selected);

          return (
            <div
              key={product.variantId}
              onClick={() => setModalProduct(product)}
              style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
              className={`group relative flex h-full animate-fadeUp cursor-pointer flex-col overflow-hidden rounded-2xl sm:rounded-[2rem] border bg-ink-soft/50 text-left backdrop-blur-sm transition-all duration-300 ${
                selected
                  ? "-translate-y-1 border-gold-300/70 shadow-[0_0_0_1px_rgba(212,163,89,0.3),0_20px_45px_-15px_rgba(212,163,89,0.35)]"
                  : "border-ink-line hover:border-gold-400/25 hover:shadow-gold hover:-translate-y-0.5"
              } ${disabled && !selected ? "opacity-40" : ""}`}
            >
              <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-ink">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className={`object-cover transition-transform duration-700 group-hover:scale-105 ${selected ? "scale-105" : ""}`}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-ink-gradient">
                    <BottleGlyph className="h-16 w-auto opacity-30 text-gold-300/60" />
                  </div>
                )}

                {selected && <div className="absolute inset-0 bg-gradient-to-t from-gold-500/25 via-transparent to-transparent" />}

                {selected && (
                  <span className="absolute left-3.5 top-3.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-gold-gradient px-1.5 text-[11px] font-bold text-ink shadow-gold">
                    {qty}
                  </span>
                )}

                {!product.inStock && (
                  <span className="absolute left-3.5 top-3.5 rounded-full bg-red-500/20 px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-red-300">
                    Sold out
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-2.5 sm:p-5">
                <h3 className="font-display text-[13px] sm:text-lg text-ivory font-medium line-clamp-2 transition-colors group-hover:text-gold-100">
                  {product.name}
                </h3>
                <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-ivory/40">{product.variantName}</p>
                {product.description && (
                  <p className="mt-1 hidden text-[13px] text-ivory/50 line-clamp-2 sm:block">{product.description}</p>
                )}
                <div className="mt-auto flex items-baseline gap-1 sm:gap-2 pt-2 sm:pt-3.5">
                  <span className="font-semibold text-ivory text-sm sm:text-lg">₹{product.price.toLocaleString("en-IN")}</span>
                  {product.oldPrice && product.oldPrice > product.price && (
                    <span className="text-[10px] sm:text-sm text-ivory/40 line-through">₹{product.oldPrice.toLocaleString("en-IN")}</span>
                  )}
                </div>

                {selected ? (
                  <QuantityStepper
                    value={qty}
                    onDecrease={(e) => {
                      e.stopPropagation();
                      removeOne(product);
                    }}
                    onIncrease={(e) => {
                      e.stopPropagation();
                      addOne(product);
                    }}
                    increaseDisabled={isFull}
                    className="mt-2 sm:mt-3 w-full"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addOne(product);
                    }}
                    disabled={disabled}
                    className={`mt-2 sm:mt-3 flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-full py-2 sm:py-2.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide sm:tracking-widest transition-all duration-300 ${
                      disabled ? "cursor-not-allowed border border-ink-line text-ivory/30" : "btn-gold"
                    }`}
                  >
                    {!product.inStock ? "Sold Out" : isFull ? "Bundle Full" : "Add to Bag"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky build dock */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gold-400/15 bg-[#0b0a0a]/95 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />

        <div className="mx-auto max-w-wrap px-3 py-3 sm:px-6 sm:py-4 md:px-12">
          {/* Progress message + bar */}
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <p className="flex min-w-0 items-center gap-1.5 whitespace-nowrap text-xs sm:gap-2 sm:text-base font-medium text-ivory/90">
              {isComplete ? (
                <>
                  <Sparkles className="h-3.5 w-3.5 sm:h-5 sm:w-5 shrink-0 text-gold-300" />
                  {hasBundlePrice ? (
                    <>
                      <span className="sm:hidden">Saved ₹{savings.toLocaleString("en-IN")}!</span>
                      <span className="hidden sm:inline">
                        Bundle ready — you saved{" "}
                        <span className="font-semibold text-gold-300">₹{savings.toLocaleString("en-IN")}</span>!
                      </span>
                    </>
                  ) : (
                    <span>Your bundle is ready!</span>
                  )}
                </>
              ) : (
                <>
                  <span className="sm:hidden">
                    <span className="font-semibold text-gold-300">{remaining}</span> more
                    {fixedPrice != null ? ` — unlocks ₹${fixedPrice.toLocaleString("en-IN")}` : ""}
                  </span>
                  <span className="hidden sm:inline">
                    Add <span className="font-semibold text-gold-300">{remaining}</span> more bottle{remaining === 1 ? "" : "s"}
                    {fixedPrice != null ? ` to unlock the bundle at ₹${fixedPrice.toLocaleString("en-IN")}` : " to build your bundle"}
                  </span>
                </>
              )}
            </p>
            <span className="shrink-0 text-xs sm:text-base font-semibold text-ivory/70">
              {totalSelected}/{bottleCount}
            </span>
          </div>

          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-soft">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                isComplete ? "bg-gradient-to-r from-green-400 to-emerald-400" : "bg-gold-gradient"
              }`}
              style={{ width: `${Math.min(100, (totalSelected / bottleCount) * 100)}%` }}
            />
          </div>

          {/* Slot thumbnails + CTA */}
          <div className="mt-3.5 flex flex-col gap-3 sm:mt-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gold-400/10 sm:flex-1 sm:gap-2.5">
              {selectedGroups.map(({ product: p, qty }) => (
                <div key={p.variantId} className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gold-400/30 bg-ink-soft sm:h-20 sm:w-20">
                  {p.image ? (
                    <Image src={p.image} alt={p.name} fill sizes="80px" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BottleGlyph className="h-8 w-auto text-gold-300/50" />
                    </div>
                  )}
                  {qty > 1 && (
                    <span className="absolute bottom-1 right-1 rounded-md bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-ivory">
                      ×{qty}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeOne(p)}
                    aria-label={`Remove ${p.name}`}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-200 hover:opacity-100"
                  >
                    <X className="h-4 w-4 text-ivory" />
                  </button>
                </div>
              ))}

              {Array.from({ length: remaining }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-gold-400/20 text-gold-400/30 sm:h-20 sm:w-20"
                >
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              ))}
            </div>

            <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end sm:gap-4">
              {total > 0 && (
                <p className="text-left text-xs text-ivory/60 sm:text-right sm:text-sm">
                  <span className="hidden sm:inline">Total </span>
                  <span className={`text-base sm:text-xl ${hasBundlePrice ? "font-semibold text-gold-300" : "font-semibold text-ivory"}`}>
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                  {hasBundlePrice && (
                    <span className="ml-1 sm:ml-1.5 text-[11px] sm:text-base text-ivory/40 line-through">
                      ₹{naturalTotal.toLocaleString("en-IN")}
                    </span>
                  )}
                </p>
              )}
              <button
                type="button"
                onClick={handleCheckoutBundle}
                disabled={!isComplete}
                className="btn-gold flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap px-4 py-3 text-xs font-semibold tracking-wide uppercase shadow-[0_4px_20px_rgba(212,163,89,0.15)] transition-all duration-300 enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_4px_25px_rgba(212,163,89,0.3)] disabled:opacity-40 sm:flex-none sm:gap-2 sm:px-7 sm:py-3.5 sm:text-sm sm:tracking-widest"
              >
                <CreditCard className="h-4 w-4" /> Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      {modalProduct && (
        <ProductModal
          product={modalProduct}
          quantity={quantities[modalProduct.variantId] || 0}
          maxQuantity={bottleCount - totalSelected + (quantities[modalProduct.variantId] || 0)}
          onSetQuantity={setQuantity}
          onClose={() => setModalProduct(null)}
        />
      )}
    </div>
  );
}
