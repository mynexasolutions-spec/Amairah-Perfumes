"use client";

import { useState } from "react";
import ImageUploader from "@/components/admin/ImageUploader";

/**
 * `images` is an array of `{ url, size }`, where `size` is either null
 * (shows on every bottle — "General"), a compound `"<variant_name>|<bottle_type>"`
 * key identifying one exact size+bottle-type combination (e.g. "30ml|glass"),
 * or — for images saved before bottle-type-aware mapping existed — a bare
 * `variant_name` (e.g. "30ml"), which is treated as matching every bottle
 * type of that size until the admin re-saves that tab.
 */
export default function SizeImageMapper({ images, onChange, variants, folder = "amairah/products" }) {
  const typesBySize = new Map();
  (variants || []).forEach((v) => {
    const name = (v.variant_name || "").trim();
    if (!name) return;
    const type = v.bottle_type === "plastic" ? "plastic" : "glass";
    if (!typesBySize.has(name)) typesBySize.set(name, new Set());
    typesBySize.get(name).add(type);
  });

  const variantTabs = Array.from(
    new Map(
      (variants || [])
        .map((v) => {
          const name = (v.variant_name || "").trim();
          if (!name) return null;
          const type = v.bottle_type === "plastic" ? "plastic" : "glass";
          const key = `${name}|${type}`;
          return [key, { key, name, label: `${name} (${type === "plastic" ? "Plastic" : "Glass"})` }];
        })
        .filter(Boolean)
    ).values()
  );

  const tabs = [{ key: "General", name: null, label: "General" }, ...variantTabs];
  const [active, setActive] = useState("General");
  const activeTab = tabs.find((t) => t.key === active) || tabs[0];
  const activeKey = activeTab.key === "General" ? null : activeTab.key;

  const matchesTab = (imgSize, tab) => {
    if (tab.key === "General") return !imgSize;
    if (!imgSize) return false;
    if (imgSize === tab.key) return true;
    if (imgSize.includes("|")) return false;
    // Legacy bare size (no "|", saved before bottle-type-aware mapping
    // existed) — only auto-matches a tab when that size has just one
    // bottle type, so it can never appear in both a size's Glass and
    // Plastic tab at once.
    const types = typesBySize.get(tab.name);
    return imgSize === tab.name && types && types.size === 1;
  };

  const activeUrls = images.filter((img) => matchesTab(img.size, activeTab)).map((img) => img.url);

  const setActiveUrls = (urls) => {
    const others = images.filter((img) => !matchesTab(img.size, activeTab));
    onChange([...others, ...urls.map((url) => ({ url, size: activeKey }))]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const count = images.filter((img) => matchesTab(img.size, t)).length;
          return (
            <button
              type="button"
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all duration-300 ${
                activeTab.key === t.key
                  ? "border-gold-300/60 bg-gold-400/15 text-gold-200"
                  : "border-ink-line bg-ink/40 text-ivory/50 hover:border-gold-400/25 hover:text-ivory"
              }`}
            >
              {t.label}
              {count > 0 && <span className="text-[10px] text-ivory/40">({count})</span>}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-ivory/40">
        {activeTab.key === "General"
          ? "These images show for every bottle size and type."
          : `These images show only when a shopper selects "${activeTab.label}".`}
      </p>

      {/*
        `key` forces a full remount when the tab changes. next-cloudinary's
        CldUploadWidget creates its underlying widget once and never updates
        its onSuccess callback on prop changes, so without this the widget
        keeps using whichever tab was active when it was first opened —
        every later upload (and every "removed" image, since it also
        replays a stale snapshot of the gallery) would land back on that
        original tab instead of the one currently selected.
      */}
      <ImageUploader key={activeTab.key} value={activeUrls} onChange={setActiveUrls} multiple folder={folder} />
    </div>
  );
}
