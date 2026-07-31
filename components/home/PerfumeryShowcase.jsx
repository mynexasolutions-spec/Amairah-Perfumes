"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import BottleGlyph from "@/components/BottleGlyph";
import { Sparkles } from "lucide-react";

export default function PerfumeryShowcase({ products }) {
  const circleProducts = (products || []).slice(0, 6);
  const [offset, setOffset] = useState(0);

  // Auto-rotate the circle items every 3 seconds
  // useEffect(() => {
  //   if (circleProducts.length <= 1) return;
  //   const interval = setInterval(() => {
  //     setOffset((prev) => (prev + 1) % circleProducts.length);
  //   }, 3000);
  //   return () => clearInterval(interval);
  // }, [circleProducts.length]);

  if (circleProducts.length === 0) return null;

  // Shift array elements based on offset to animate rotation
  const shiftedProducts = [
    ...circleProducts.slice(offset),
    ...circleProducts.slice(0, offset),
  ];

  // The center element always gets the spotlight styling
  const centerIndex = Math.floor((shiftedProducts.length - 1) / 2);

  return (
    <section className="bg-gradient-to-b from-[#0b0a0a] via-[#120f0d] to-[#0b0a0a] py-28 relative overflow-hidden border-t border-ink-line">

      {/* Dynamic ambient backgrounds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(202,161,75,0.06),transparent_65%)] blur-[80px]" />
        <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-gold-600/5 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-gold-400/5 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-wrap px-6 md:px-12 relative z-10">

        {/* Header Block */}
        <Reveal className="text-center max-w-xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-400/20 bg-ink-soft/80 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-200 backdrop-blur-md mb-4">
            <Sparkles className="w-3 h-3 text-gold-300 animate-pulse" />
            Curated Formulations
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-ivory tracking-wider uppercase">
            Perfumery
          </h2>
          <div className="w-16 h-[1px] bg-gold-400/40 mx-auto mt-4" />
        </Reveal>

        {/* Dynamic Sliding Circle Showcase */}
        <div className="relative flex flex-nowrap md:flex-wrap items-center justify-center gap-4 sm:gap-8 max-w-5xl mx-auto py-8 overflow-x-auto md:overflow-visible scrollbar-none">
          {shiftedProducts.map((p, i) => {
            const isCenter = i === centerIndex;

            return (
              <div
                key={p.id}
                className="transition-all duration-700 ease-in-out shrink-0"
              >
                <Link
                  href={`/shop/${p.slug}`}
                  title={p.name}
                  className={`group relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border bg-gradient-to-b from-ink-soft to-ink transition-all duration-700 hover:border-gold-300/40 hover:scale-105 ${isCenter
                      ? "h-32 w-32 sm:h-48 sm:w-48 border-gold-400/50 shadow-gold ring-4 ring-gold-400/10 scale-110"
                      : "h-20 w-20 sm:h-32 sm:w-32 border-ink-line opacity-60 hover:opacity-100 scale-90"
                    }`}
                >
                  {/* Decorative internal ring */}
                  <div className="absolute inset-1.5 rounded-full border border-gold-400/5 group-hover:border-gold-400/20 pointer-events-none transition-colors" />

                  {/* Backdrop Glow inside the circle */}
                  <div className={`absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 ${isCenter ? "opacity-[0.03]" : ""
                    }`} />

                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes={isCenter ? "192px" : "128px"}
                      className={`object-cover p-3 sm:p-5 transition-all duration-700 ease-out group-hover:scale-105 ${isCenter ? "" : "grayscale group-hover:grayscale-0"
                        }`}
                    />
                  ) : (
                    <BottleGlyph className={`h-1/2 w-auto transition-transform group-hover:scale-105 ${isCenter ? "opacity-80 text-gold-300" : "opacity-45 text-ivory/60"
                      }`} />
                  )}

                  {/* Overlay text on hover */}
                  <div className="absolute inset-0 bg-ink/90 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center p-3 text-center transition-opacity duration-300">
                    <span className="font-display text-xs text-gold-200 leading-tight font-medium truncate max-w-full">
                      {p.name}
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-ivory/40 mt-1">
                      View details
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Narrative Block */}
        <Reveal delay={220} className="mx-auto mt-20 max-w-2xl text-center">
          <h3 className="font-display text-2xl sm:text-3xl text-gold-200 font-semibold mb-4">
            For Those Who Love Quality
          </h3>
          <p className="text-sm sm:text-base leading-relaxed text-ivory/60 font-light">
            Every Amairah perfume is made with high-quality oils to make sure it lasts up to 24 hours. We mix each batch by hand with pure ingredients, giving you premium quality at honest prices.
          </p>
        </Reveal>

      </div>
    </section>
  );
}
