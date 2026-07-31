"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { deleteProduct } from "@/actions/admin/products";

export default function ProductCard({ product }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      await deleteProduct(product.id);
      router.refresh();
    });
  };

  const stockBadge =
    product.totalStock === 0
      ? "bg-red-500/10 text-red-300 border-red-500/20"
      : product.totalStock <= 5
      ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
      : "bg-ivory/5 text-ivory/60 border-ivory/10";

  return (
    <li className="rounded-2xl border border-gold-400/10 bg-white/[0.02] p-4">
      <div className="flex items-start gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-gold-400/10 bg-ink-soft">
          {product.featured_image_url && (
            <Image src={product.featured_image_url} alt="" fill sizes="48px" className="object-cover" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ivory">{product.name}</p>
          <p className="truncate text-sm text-ivory/35">{product.categoryName || "No category"}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="rounded-lg p-2 text-ivory/40 hover:bg-gold-400/10 hover:text-gold-300"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={handleDelete}
            disabled={pending}
            className={`rounded-lg p-2 ${confirming ? "bg-red-500/10 text-red-400" : "text-ivory/40 hover:bg-red-500/10 hover:text-red-400"}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-ivory/10 bg-ivory/5 px-2.5 py-1 text-xs font-semibold text-ivory/60">
          {product.minPrice != null ? `₹${product.minPrice.toLocaleString("en-IN")}` : "No price"}
        </span>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold border ${stockBadge}`}>
          {product.totalStock} in stock
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold tracking-wider uppercase border ${
            product.is_active
              ? "bg-green-500/10 text-green-300 border-green-500/20"
              : "bg-ivory/5 text-ivory/40 border-ivory/10"
          }`}
        >
          {product.is_active ? "Active" : "Hidden"}
        </span>
      </div>
    </li>
  );
}
