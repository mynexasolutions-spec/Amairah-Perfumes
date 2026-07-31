"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import BottleGlyph from "@/components/BottleGlyph";

const PER_PAGE = 3;

function CategoryCircle({ cat }) {
  return (
    <Link href={`/shop?category=${cat.id}`} className="group flex w-full flex-col items-center gap-3 sm:w-36 sm:shrink-0 sm:gap-4 lg:w-44">
      <div className="relative aspect-square w-full max-w-[6.5rem] sm:h-32 sm:w-32 sm:max-w-none lg:h-40 lg:w-40">
        {/* Slow-rotating gold ring */}
        <div
          className="absolute -inset-1.5 rounded-full opacity-60 transition-opacity duration-500 group-hover:opacity-100 animate-spin"
          style={{
            animationDuration: "6s",
            background: "conic-gradient(from 0deg, transparent 0%, rgba(212,163,89,0.7) 15%, transparent 30%)",
          }}
        />
        {/* Static outer ring */}
        <div className="absolute -inset-1.5 rounded-full border border-gold-400/15" />

        <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-gold-400/20 bg-ink-soft shadow-[0_0_20px_rgba(212,163,89,0.08)] transition-all duration-300 group-hover:scale-105 group-hover:border-gold-300/50 group-hover:shadow-[0_0_35px_rgba(212,163,89,0.3)]">
          {cat.image_url ? (
            <Image
              src={cat.image_url}
              alt={cat.name}
              fill
              sizes="(max-width: 640px) 96px, (max-width: 1024px) 128px, 160px"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-ink-gradient">
              <BottleGlyph className="h-1/2 w-auto text-gold-300/30" />
            </div>
          )}
          <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-gold-400/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <p className="text-center text-xs font-semibold uppercase tracking-wide text-ivory/80 transition-colors group-hover:text-gold-200 sm:text-sm sm:tracking-widest">
          {cat.name}
        </p>
        <span className="h-px w-0 bg-gold-400/60 transition-all duration-300 group-hover:w-8" />
      </div>
    </Link>
  );
}

export default function CategoryCircles({ categories }) {
  const [page, setPage] = useState(0);
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, categories?.length]);

  const scrollByAmount = (direction) => {
    trackRef.current?.scrollBy({ left: direction * 340, behavior: "smooth" });
  };

  if (!categories || categories.length === 0) return null;

  const isOverflowing = canScrollLeft || canScrollRight;
  const totalPages = Math.ceil(categories.length / PER_PAGE);
  const visible = categories.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <section className="relative bg-[#0b0a0a] py-16 sm:py-24 overflow-hidden">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60">
        <div className="absolute left-[10%] top-0 h-[400px] w-[450px] rounded-full bg-gold-500/10 blur-[130px]" />
        <div className="absolute right-[5%] top-1/3 h-[400px] w-[450px] rounded-full bg-gold-300/10 blur-[130px]" />
        <div className="absolute left-1/3 bottom-0 h-[350px] w-[400px] rounded-full bg-gold-600/10 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/5 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-wrap px-6 md:px-12">
        <Reveal className="mb-12 sm:mb-16 text-center">
          <p className="eyebrow justify-center">
            <span className="gold-line" /> Explore Our Range <span className="gold-line" />
          </p>
          <h2 className="section-heading mt-4">
            Shop by{" "}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400">
              Category
            </span>
          </h2>
        </Reveal>

        {/* Mobile: fixed 3-up grid, paginated — every circle always shown whole, never cropped */}
        <div className="sm:hidden">
          <div className="grid grid-cols-3 gap-5">
            {visible.map((cat) => (
              <CategoryCircle key={cat.id} cat={cat} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                aria-label="Previous categories"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-400/20 bg-ink-soft/60 text-gold-300 transition-all disabled:opacity-25 hover:border-gold-300/40 hover:text-gold-200 active:scale-95"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-1.5">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      page === idx ? "w-5 bg-gold-300" : "w-1.5 bg-gold-400/25"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                aria-label="Next categories"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-400/20 bg-ink-soft/60 text-gold-300 transition-all disabled:opacity-25 hover:border-gold-300/40 hover:text-gold-200 active:scale-95"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Desktop/tablet: single row, horizontally scrollable when it overflows */}
        <div className="relative hidden sm:block">
          {isOverflowing && canScrollLeft && (
            <button
              onClick={() => scrollByAmount(-1)}
              aria-label="Scroll categories left"
              className="absolute left-0 top-16 z-20 flex h-11 w-11 -translate-x-5 -translate-y-1/2 items-center justify-center rounded-full border border-gold-400/25 bg-ink-soft/90 text-gold-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-gold-300/50 hover:text-gold-200 hover:shadow-[0_0_25px_rgba(212,163,89,0.25)] lg:top-20"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          <div
            ref={trackRef}
            className={`flex flex-nowrap gap-10 overflow-x-auto scroll-smooth px-2 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              isOverflowing ? "justify-start" : "justify-center"
            }`}
          >
            {categories.map((cat, i) => (
              <Reveal key={cat.id} delay={i * 80}>
                <CategoryCircle cat={cat} />
              </Reveal>
            ))}
          </div>

          {isOverflowing && canScrollRight && (
            <button
              onClick={() => scrollByAmount(1)}
              aria-label="Scroll categories right"
              className="absolute right-0 top-16 z-20 flex h-11 w-11 -translate-y-1/2 translate-x-5 items-center justify-center rounded-full border border-gold-400/25 bg-ink-soft/90 text-gold-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-gold-300/50 hover:text-gold-200 hover:shadow-[0_0_25px_rgba(212,163,89,0.25)] lg:top-20"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
