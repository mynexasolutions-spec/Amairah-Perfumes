"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Link as LinkIcon, Minus, Plus, Send, Share2, ShoppingBag, Truck, MessageSquare, Check, X, Zap } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { whatsappLink } from "@/lib/constants";
import { useProductVariant } from "./ProductVariantContext";

function getEstimatedDeliveryDate() {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getViewerCount() {
  return Math.floor(Math.random() * 91) + 10;
}

export default function ProductPurchasePanel({ product, variants }) {
  const router = useRouter();
  const ctx = useProductVariant();
  const defaultVariant = variants.find((v) => (v.bottle_type || "glass") === "glass") || variants[0];
  const [localSelectedId, setLocalSelectedId] = useState(defaultVariant?.id);
  const selectedId = ctx ? ctx.selectedId : localSelectedId;
  const setSelectedId = ctx ? ctx.setSelectedId : setLocalSelectedId;
  const [quantity, setQuantity] = useState(1);
  const [viewerCount, setViewerCount] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const { addToCart, setDrawerOpen } = useCart();
  const { showToast } = useToast();

  const selected = variants.find((v) => v.id === selectedId) || defaultVariant;
  const inStock = selected && selected.stock_quantity > 0;
  const shareText = `Check out ${product.name} by Amairah Perfumes`;

  useEffect(() => {
    setViewerCount(getViewerCount());
    setDeliveryDate(getEstimatedDeliveryDate());
    setProductUrl(window.location.href);
  }, []);

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

  const copyProductLink = async () => {
    if (!productUrl) return;
    await navigator.clipboard.writeText(productUrl);
    showToast("Product link copied.");
  };

  const shareNative = async () => {
    if (!productUrl) return;
    if (!navigator.share) {
      await copyProductLink();
      return;
    }
    try {
      await navigator.share({
        title: product.name,
        text: shareText,
        url: productUrl,
      });
    } catch (error) {
      if (error?.name !== "AbortError") {
        await copyProductLink();
      }
    }
  };

  const shareOnInstagram = async () => {
    await copyProductLink();
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
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

      {viewerCount && (
        <div className="inline-flex max-w-full items-center gap-2.5 rounded-2xl border border-gold-400/10 bg-ink-soft/30 px-4 py-3 text-sm font-medium text-ivory/70">
          <Eye className="h-4 w-4 text-gold-300" />
          <span>{viewerCount} people are viewing this right now</span>
        </div>
      )}

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
              <div key={name} className="flex flex-col items-stretch gap-1.5">
                <button
                  disabled={!sizeInStock}
                  onClick={() => selectSize(name)}
                  className={`flex w-full items-center justify-center gap-1.5 rounded-2xl border px-5 py-2.5 text-sm sm:text-base transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
                    isSelected
                      ? "bg-gold-gradient text-ink border-transparent font-semibold shadow-gold/20 scale-[1.02]"
                      : "border-ink-line bg-ink-soft/40 text-ivory/60 hover:border-gold-400/30 hover:text-ivory"
                  }`}
                >
                  {isSelected && <Check className="h-3.5 w-3.5" />}
                  {name}
                </button>
                {!sizeInStock && (
                  <span className="w-full rounded-xl border border-red-500/25 bg-red-500/10 px-2 py-0.5 text-center text-[8px] font-semibold uppercase tracking-wider text-red-400">
                    Out of stock
                  </span>
                )}
              </div>
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
              <div key={v.id} className="flex flex-col items-stretch gap-1.5">
                <button
                  disabled={v.stock_quantity <= 0}
                  onClick={() => selectBottleType(bottleType)}
                  className={`flex w-full items-center justify-center gap-1.5 rounded-2xl border px-5 py-2.5 text-sm sm:text-base transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
                    isSelected
                      ? "bg-gold-gradient text-ink border-transparent font-semibold shadow-gold/20 scale-[1.02]"
                      : "border-ink-line bg-ink-soft/40 text-ivory/60 hover:border-gold-400/30 hover:text-ivory"
                  }`}
                >
                  {isSelected && <Check className="h-3.5 w-3.5" />}
                  {bottleType === "plastic" ? "Plastic Bottle" : "Glass Bottle"}
                  <span className="text-xs opacity-70">₹{v.price.toLocaleString("en-IN")}</span>
                </button>
                {v.stock_quantity <= 0 && (
                  <span className="w-full rounded-xl border border-red-500/25 bg-red-500/10 px-2 py-0.5 text-center text-[8px] font-semibold uppercase tracking-wider text-red-400">
                    Out of stock
                  </span>
                )}
              </div>
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

      <div className="flex flex-wrap items-start gap-3">
        <div className="relative z-[1000]">
          <div className="w-fit max-w-full rounded-2xl border border-gold-400/10 bg-ink-soft/30 px-4 py-2">
            <button
              type="button"
              onClick={() => setShareOpen((open) => !open)}
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold uppercase leading-none tracking-widest text-ivory/70 transition-colors hover:text-gold-200"
            >
              <Share2 className="h-4.5 w-4.5 text-gold-300" />
              <span>Share</span>
            </button>
          </div>

          {shareOpen && (
            <>
              <button
                type="button"
                aria-label="Close share popup"
                className="fixed inset-0 z-20 cursor-default bg-black/70 backdrop-blur-sm"
                onClick={() => setShareOpen(false)}
              />
              <div className="absolute left-0 top-0 z-30 w-[min(22rem,calc(100vw-3rem))] overflow-hidden rounded-[1.35rem] border border-gold-400/20 bg-[#100d0b] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.65),0_0_28px_rgba(212,163,89,0.08)]">
                <div className="absolute inset-x-0 top-0 h-px bg-gold-gradient" />
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-display text-xl font-semibold text-ivory">
                    Share Product
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShareOpen(false)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-400/10 bg-ink-soft/70 text-ivory/50 transition-colors hover:text-gold-200"
                    aria-label="Close share popup"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="my-4 h-px bg-ink-line" />

                <p className="text-sm font-medium text-ivory/65">Share this link via</p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${shareText}: ${productUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-300 transition-all hover:-translate-y-0.5 hover:border-emerald-400/45 hover:bg-emerald-500/15"
                    aria-label="Share on WhatsApp"
                  >
                    <FaWhatsapp className="h-5 w-5" />
                  </a>
                  <button
                    type="button"
                    onClick={shareOnInstagram}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-pink-500/25 bg-pink-500/10 text-pink-300 transition-all hover:-translate-y-0.5 hover:border-pink-400/45 hover:bg-pink-500/15"
                    aria-label="Share on Instagram"
                  >
                    <FaInstagram className="h-5 w-5" />
                  </button>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-sky-500/25 bg-sky-500/10 text-sky-300 transition-all hover:-translate-y-0.5 hover:border-sky-400/45 hover:bg-sky-500/15"
                    aria-label="Share on Facebook"
                  >
                    <FaFacebookF className="h-5 w-5" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/25 bg-cyan-400/10 text-cyan-300 transition-all hover:-translate-y-0.5 hover:border-cyan-300/45 hover:bg-cyan-400/15"
                    aria-label="Share on Twitter"
                  >
                    <FaTwitter className="h-5 w-5" />
                  </a>
                  <button
                    type="button"
                    onClick={shareNative}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/25 bg-gold-400/10 text-gold-200 transition-all hover:-translate-y-0.5 hover:border-gold-300/45 hover:bg-gold-400/15"
                    aria-label="Open more share options"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>

                <p className="mt-5 text-sm font-medium text-ivory/65">Or copy link</p>

                <div className="mt-3 flex overflow-hidden rounded-xl border border-gold-400/15 bg-ink-soft/35">
                  <div className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2.5 text-sm text-ivory/60">
                    <LinkIcon className="h-4 w-4 shrink-0 text-gold-300" />
                    <span className="truncate">{productUrl}</span>
                  </div>
                  <button
                    type="button"
                    onClick={copyProductLink}
                    className="shrink-0 bg-gold-gradient px-4 text-sm font-semibold text-ink transition-opacity hover:opacity-90"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {deliveryDate && (
          <div className="inline-flex max-w-full items-center gap-3 rounded-2xl border border-gold-400/10 bg-ink-soft/30 px-4 py-3 text-sm text-ivory/70">
            <Truck className="h-5 w-5 text-gold-300" />
            <span>
              Estimated Delivery: <span className="font-semibold text-ivory">{deliveryDate}</span>
            </span>
          </div>
        )}
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
