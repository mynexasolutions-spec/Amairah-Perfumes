"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X, Check, SlidersHorizontal } from "lucide-react";
import { GENDERS } from "@/lib/constants";
import SortSelect from "./SortSelect";

export default function ShopFilters({ categories }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeCategory = searchParams.get("category") || "";
  const activeGender = searchParams.get("gender") || "";

  const setParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const activeCount = [activeCategory, activeGender].filter(Boolean).length;
  const hasFilters = activeCount > 0;

  const filterGroups = (
    <div className="space-y-7">
      <div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300/80">Category</p>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setParam("category", "")}
            className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm transition-colors ${
              !activeCategory ? "bg-gold-400/15 text-gold-200" : "text-ivory/60 hover:bg-ink-soft"
            }`}
          >
            All Fragrances
            {!activeCategory && <Check className="h-3.5 w-3.5 text-gold-300" />}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setParam("category", cat.id)}
              className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm transition-colors ${
                activeCategory === cat.id ? "bg-gold-400/15 text-gold-200" : "text-ivory/60 hover:bg-ink-soft"
              }`}
            >
              {cat.name}
              {activeCategory === cat.id && <Check className="h-3.5 w-3.5 text-gold-300" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300/80">For</p>
        <div className="flex flex-wrap gap-2">
          {GENDERS.map((g) => (
            <button
              key={g}
              onClick={() => setParam("gender", activeGender === g ? "" : g)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-all duration-200 ${
                activeGender === g
                  ? "border-gold-300 bg-gold-400/15 text-gold-200 shadow-gold"
                  : "border-gold-400/10 text-ivory/60 hover:border-gold-400/40 hover:text-ivory"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile trigger — opens the filter drawer */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-gold-400/10 bg-gradient-to-b from-ink-soft/80 to-ink-soft/30 px-5 py-4 shadow-xl backdrop-blur-md md:hidden"
      >
        <span className="flex items-center gap-2.5 font-display text-base text-ivory">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-300">
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
          </span>
          Filters
          {hasFilters && (
            <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gold-400/15 px-1.5 text-xs font-semibold text-gold-200">
              {activeCount}
            </span>
          )}
        </span>
        <span className="text-sm font-medium text-gold-300">Open</span>
      </button>

      {/* Desktop sidebar — always visible */}
      <div className="hidden rounded-[2rem] border border-gold-400/10 bg-gradient-to-b from-ink-soft/80 to-ink-soft/30 p-6 shadow-xl backdrop-blur-md md:block">
        <div className="mb-6 flex items-center justify-between border-b border-gold-400/10 pb-4">
          <span className="flex items-center gap-2.5 font-display text-base text-ivory">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-300">
              <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
            </span>
            Filters
          </span>
          {hasFilters && (
            <button
              onClick={() => router.push(pathname)}
              className="flex items-center gap-1 text-sm font-medium text-ivory/50 transition-colors hover:text-red-400"
            >
              <X className="h-3.5 w-3.5" /> Clear
            </button>
          )}
        </div>
        {filterGroups}
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-md transition-opacity duration-500 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-[70] flex h-full w-full max-w-sm flex-col border-r border-gold-400/10 bg-gradient-to-b from-[#120f0d] via-[#0b0a0a] to-[#080707] shadow-2xl transition-transform duration-500 ease-out md:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gold-400/10 px-6 py-5">
          <span className="flex items-center gap-2.5 font-display text-lg text-ivory">
            <SlidersHorizontal className="h-5 w-5 text-gold-300" strokeWidth={1.5} />
            Filters
            {hasFilters && (
              <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gold-400/15 px-1.5 text-xs font-semibold text-gold-200">
                {activeCount}
              </span>
            )}
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close filters"
            className="group rounded-full border border-gold-400/10 bg-ink-soft/40 p-1.5 text-ivory/60 transition-all duration-300 hover:border-gold-400/30 hover:text-gold-300"
          >
            <X className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-gold-400/10">
          <div className="mb-7">
            <SortSelect />
          </div>
          {filterGroups}
        </div>

        <div className="space-y-3 border-t border-gold-400/10 bg-gradient-to-b from-[#080707] to-[#040303] px-6 py-5">
          {hasFilters && (
            <button
              onClick={() => router.push(pathname)}
              className="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-ivory/50 transition-colors hover:text-red-400"
            >
              <X className="h-3.5 w-3.5" /> Clear all filters
            </button>
          )}
          <button
            onClick={() => setDrawerOpen(false)}
            className="btn-gold block w-full py-3.5 text-center text-xs font-semibold uppercase tracking-widest"
          >
            Show Results
          </button>
        </div>
      </aside>
    </>
  );
}
