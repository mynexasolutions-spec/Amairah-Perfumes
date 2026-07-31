"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";

const OPTIONS = [
  { value: "", label: "Sort: Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function SortSelect({ className = "" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSort = searchParams.get("sort") || "";

  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const selectValue = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("sort", value);
    else params.delete("sort");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setOpen(false);
  };

  const activeLabel = OPTIONS.find((o) => o.value === activeSort)?.label || OPTIONS[0].label;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between gap-3 rounded-full border px-4 py-2.5 text-sm text-ivory transition-colors ${
          open ? "border-gold-300/50 bg-ink-soft" : "border-gold-400/15 bg-ink-soft hover:border-gold-400/30"
        }`}
      >
        {activeLabel}
        <ChevronDown className={`h-4 w-4 shrink-0 text-gold-300 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-full min-w-[220px] overflow-hidden rounded-2xl border border-gold-400/15 bg-gradient-to-b from-ink-soft/95 to-ink-soft/85 py-1.5 shadow-2xl backdrop-blur-md animate-fadeUp">
          {OPTIONS.map((option) => {
            const isActive = option.value === activeSort;
            return (
              <button
                key={option.value || "default"}
                type="button"
                onClick={() => selectValue(option.value)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                  isActive ? "bg-gold-400/15 text-gold-200" : "text-ivory/70 hover:bg-ink/60 hover:text-ivory"
                }`}
              >
                {option.label}
                {isActive && <Check className="h-3.5 w-3.5 shrink-0 text-gold-300" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
