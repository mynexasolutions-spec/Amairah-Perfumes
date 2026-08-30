"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { calculateQuantityDiscount, calculateBundleDiscount } from "@/lib/constants";

export default function CartView({ quantityDiscount, bundleSettings }) {
  const { cart, updateQuantity, removeFromCart, cartSubtotal, cartCount } = useCart();
  const qtyDiscount = calculateQuantityDiscount(cartCount, quantityDiscount);
  const bundleDiscount = calculateBundleDiscount(cart, bundleSettings);

  if (cart.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-line py-20 text-center">
        <p className="font-display text-lg text-ivory/70">Your bag is empty</p>
        <Link href="/shop" className="btn-gold mt-6 inline-flex">
          Explore the Shop
        </Link>
      </div>
    );
  }

  return (
    <>
      <ul className="divide-y divide-ink-line border-y border-ink-line">
        {cart.map((item) => (
          <li key={item.variantId} className="flex gap-4 py-5">
            <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-ink-soft">
              {item.image && (
                <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
              )}
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/shop/${item.slug}`} className="font-display text-base text-ivory hover:text-gold-300">
                    {item.name}
                  </Link>
                  {item.variantName && <p className="text-sm text-ivory/50">{item.variantName}</p>}
                </div>
                <button
                  onClick={() => removeFromCart(item.variantId)}
                  className="text-ivory/40 hover:text-red-400"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 rounded-full border border-ink-line px-3 py-1.5">
                  <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} aria-label="Decrease">
                    <Minus className="h-3.5 w-3.5 text-ivory/60 hover:text-gold-300" />
                  </button>
                  <span className="w-5 text-center text-sm text-ivory">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} aria-label="Increase">
                    <Plus className="h-3.5 w-3.5 text-ivory/60 hover:text-gold-300" />
                  </button>
                </div>
                <span className="font-semibold text-ivory">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between">
        <span className="text-ivory/60">Subtotal</span>
        <span className="font-display text-2xl text-ivory">
          ₹{cartSubtotal.toLocaleString("en-IN")}
        </span>
      </div>
      {qtyDiscount > 0 && (
        <div className="mt-2 flex items-center justify-between">
          <span className="text-green-400 text-sm">Bulk Discount ({cartCount} items)</span>
          <span className="font-semibold text-green-400">-₹{qtyDiscount.toLocaleString("en-IN")}</span>
        </div>
      )}
      {bundleDiscount > 0 && (
        <div className="mt-2 flex items-center justify-between">
          <span className="text-green-400 text-sm">Bundle Discount</span>
          <span className="font-semibold text-green-400">-₹{bundleDiscount.toLocaleString("en-IN")}</span>
        </div>
      )}
      <p className="mt-2 text-xs text-ivory/40">Shipping and any COD fee calculated at checkout.</p>

      <Link href="/checkout" className="btn-gold mt-8 w-full">
        Proceed to Checkout
      </Link>
    </>
  );
}
