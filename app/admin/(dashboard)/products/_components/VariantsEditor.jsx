"use client";

import { Plus, Trash2 } from "lucide-react";

const inputClass = "w-full rounded-lg border border-ink-line bg-ink px-3 py-2 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold-400/50 focus:outline-none";
const errorInputClass = "border-red-500/60 focus:border-red-500/60";

export default function VariantsEditor({ variants, onChange, showErrors }) {
  const update = (idx, key, value) => {
    onChange(variants.map((v, i) => (i === idx ? { ...v, [key]: value } : v)));
  };

  const add = () => {
    onChange([...variants, { variant_name: "", bottle_type: "glass", price: "", original_price: "", stock_quantity: "", weight_grams: "" }]);
  };

  const remove = (idx) => onChange(variants.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3">
      {variants.map((v, i) => {
        const nameMissing = showErrors && !v.variant_name?.trim();
        const priceMissing = showErrors && (v.price === "" || v.price == null || Number(v.price) <= 0);
        const stockMissing = showErrors && (v.stock_quantity === "" || v.stock_quantity == null || Number(v.stock_quantity) < 0);

        return (
          <div key={i} className="grid grid-cols-1 gap-2 rounded-xl border border-ink-line p-3 sm:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_auto]">
            <div>
              <input
                placeholder="Size (e.g. 30ml)"
                value={v.variant_name}
                onChange={(e) => update(i, "variant_name", e.target.value)}
                className={`${inputClass} ${nameMissing ? errorInputClass : ""}`}
              />
              {nameMissing && <p className="mt-1 text-[11px] text-red-400">Size name required</p>}
            </div>
            <div>
              <select
                value={v.bottle_type === "plastic" ? "plastic" : "glass"}
                onChange={(e) => update(i, "bottle_type", e.target.value)}
                className={inputClass}
              >
                <option value="glass">Glass Bottle</option>
                <option value="plastic">Plastic Bottle</option>
              </select>
            </div>
            <div>
              <input
                type="number"
                placeholder="Price"
                value={v.price}
                onChange={(e) => update(i, "price", e.target.value)}
                className={`${inputClass} ${priceMissing ? errorInputClass : ""}`}
              />
              {priceMissing && <p className="mt-1 text-[11px] text-red-400">Valid price required</p>}
            </div>
            <div>
              <input
                type="number"
                placeholder="Old price"
                value={v.original_price}
                onChange={(e) => update(i, "original_price", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Stock"
                value={v.stock_quantity}
                onChange={(e) => update(i, "stock_quantity", e.target.value)}
                className={`${inputClass} ${stockMissing ? errorInputClass : ""}`}
              />
              {stockMissing && <p className="mt-1 text-[11px] text-red-400">Stock required</p>}
            </div>
            <div>
              <input
                type="number"
                placeholder="Weight (g)"
                value={v.weight_grams ?? ""}
                onChange={(e) => update(i, "weight_grams", e.target.value)}
                className={inputClass}
              />
            </div>
            <button type="button" onClick={() => remove(i)} className="flex h-fit items-center justify-center rounded-lg p-2 text-ivory/40 hover:bg-ink hover:text-red-400">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      })}

      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 text-sm text-gold-300 hover:text-gold-200"
      >
        <Plus className="h-4 w-4" /> Add Bottle Size
      </button>
      <p className="text-[11px] text-ivory/40">
        To offer both Glass and Plastic for the same size, add two rows with the same size name — one Glass, one Plastic (with a lower price). Glass is shown as the default on the product page. Weight (grams) is used for courier shipment booking — leave blank to use a default estimate.
      </p>
    </div>
  );
}
