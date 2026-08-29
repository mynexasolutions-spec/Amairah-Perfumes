"use client";

import { useActionState, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Trash2, AlertCircle, ListChecks } from "lucide-react";
import { addBundleItem, removeBundleItem } from "@/actions/admin/bundle";

const inputClass =
  "w-full rounded-xl border border-gold-400/10 bg-ink/40 px-4 py-2.5 text-sm text-ivory transition-colors duration-300 focus:border-gold-400/40 focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/20";

function AddItemForm({ pickerProducts }) {
  const [state, formAction, pending] = useActionState(addBundleItem, {});
  const [productId, setProductId] = useState("");

  const variants = useMemo(
    () => pickerProducts.find((p) => p.id === productId)?.variants || [],
    [pickerProducts, productId]
  );

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-gold-400/10 bg-ink/30 p-4">
      {state.error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-300">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-[1fr_1fr_auto]">
        <select
          name="product_id"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className={inputClass}
        >
          <option value="">Choose a product…</option>
          {pickerProducts.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select name="variant_id" defaultValue="" className={inputClass} disabled={!productId}>
          <option value="">Choose a size…</option>
          {variants.map((v) => (
            <option key={v.id} value={v.id}>
              {v.variantName} · ₹{v.price}
            </option>
          ))}
        </select>

        <button type="submit" disabled={pending || !productId} className="btn-gold flex items-center justify-center gap-1.5 px-5 disabled:opacity-60">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
      <p className="text-xs text-ivory/30">
        This is the fixed size a customer gets when they pick this product for the bundle — they don't choose a size themselves.
      </p>
    </form>
  );
}

function ItemRow({ item }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      await removeBundleItem(item.id);
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-gold-400/10 bg-ink/20 px-3 py-2.5">
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-gold-400/10 bg-ink-soft">
        {item.productImage && <Image src={item.productImage} alt="" fill sizes="44px" className="object-cover" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ivory">{item.productName}</p>
        <p className="truncate text-xs text-ivory/40">
          {item.variantName} {item.price != null && `· ₹${item.price}`}
        </p>
      </div>
      <button
        onClick={handleDelete}
        disabled={pending}
        className={`shrink-0 rounded-lg p-2 border border-transparent transition-all duration-300 ${
          confirming ? "text-red-400 bg-red-500/10 border-red-500/20" : "text-ivory/40 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20"
        }`}
        title={confirming ? "Click again to confirm" : "Remove"}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function BundleItemsManager({ items, pickerProducts }) {
  return (
    <div className="space-y-5 rounded-[2rem] border border-gold-400/10 bg-gradient-to-b from-ink-soft/80 to-ink-soft/30 p-6 backdrop-blur-md md:p-8">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/10 text-gold-300">
          <ListChecks className="h-4 w-4" />
        </div>
        <h2 className="font-display text-base text-ivory">Bundle-Eligible Products</h2>
      </div>

      <AddItemForm pickerProducts={pickerProducts} />

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-ivory/40">No products added yet — add one above.</p>
        ) : (
          items.map((item) => <ItemRow key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}
