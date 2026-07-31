"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import Reveal from "@/components/Reveal";

export default function ChooseYourFragrance({ groups }) {
  const visibleGroups = (groups || []).filter((g) => g.products.length > 0);
  const [openIndex, setOpenIndex] = useState(0);

  if (visibleGroups.length === 0) return null;

  return (
    <section className="mx-auto max-w-wrap px-6 py-20 md:px-12">
      <Reveal className="mb-12 text-center">
        <p className="eyebrow justify-center">
          <span className="gold-line" /> The Amairah Edit <span className="gold-line" />
        </p>
        <h2 className="section-heading mt-4">Choose Your Fragrance</h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-ivory/50">
          Every scent we make falls into one of three moods — pick the one that fits your day.
        </p>
      </Reveal>

      <div className="space-y-3">
        {visibleGroups.map((group, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={group.title} className="overflow-hidden rounded-2xl border border-ink-line bg-ink-soft/40">
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-ink-soft/60"
              >
                <span className="flex items-center gap-4">
                  <span className="font-display text-sm text-gold-300">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-lg text-ivory md:text-xl">{group.title}</span>
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-gold-300 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="border-t border-ink-line px-6 pb-8 pt-6">
                  <ProductGrid products={group.products} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
