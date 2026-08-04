"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import Reveal from "@/components/Reveal";

const VISIBLE_COUNT = 3;

function getVisible(startIndex, items) {
  return Array.from(
    { length: Math.min(VISIBLE_COUNT, items.length) },
    (_, i) => items[(startIndex + i) % items.length]
  );
}

import Image from "next/image";

export default function TestimonialSection({ testimonials = [] }) {
  if (!testimonials || testimonials.length === 0) return null;

  const items = testimonials;
  const [startIndex, setStartIndex] = useState(0);

  const goTo = (target) => setStartIndex(target);
  const handleNext = () => goTo((startIndex + 1) % items.length);
  const handlePrev = () => goTo((startIndex - 1 + items.length) % items.length);

  useEffect(() => {
    if (items.length <= VISIBLE_COUNT) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [startIndex, items.length]);

  const visible = getVisible(startIndex, items);

  return (
    <section className="py-24 relative">
      <div className="mx-auto max-w-wrap px-6 md:px-12 relative">
        <div className="pointer-events-none absolute -left-24 top-10 h-96 w-96 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-20 h-80 w-80 rounded-full bg-gold-300/10 blur-3xl" />

        <Reveal className="text-center max-w-2xl mx-auto mb-16 relative z-10">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-300 mb-3 block">
            Loved by Discerning Fragrance Lovers
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory">
            Stories From Our Community
          </h2>
          <div className="w-16 h-[1px] bg-gold-400/40 mx-auto mt-4" />
        </Reveal>

        <Reveal delay={100} className="relative z-10">
          <div key={startIndex} className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideInRight">
            {visible.map((t, i) => {
              const name = t.customer_name || t.name || "";
              const text = t.review_text || t.text || "";
              const title = t.title || "Verified Buyer";
              return (
                <div
                  key={`${name}-${i}`}
                  className={`group flex h-full flex-col rounded-3xl border border-gold-400/15 bg-gradient-to-br from-ink-soft/80 via-ink/60 to-ink-soft/40 p-8 shadow-xl backdrop-blur-sm transition-all duration-500 hover:border-gold-400/30 hover:-translate-y-1 ${
                    i === 0 ? "" : "hidden md:flex"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star
                          key={si}
                          className={`w-4 h-4 ${si < t.rating ? "fill-gold-300 text-gold-300" : "fill-none text-ivory/20"}`}
                        />
                      ))}
                    </div>
                    <Quote className="h-7 w-7 text-gold-400/20" strokeWidth={1.5} />
                  </div>

                  <p className="mt-5 flex-1 text-base sm:text-lg leading-relaxed text-ivory/70 font-light italic">
                    &ldquo;{text}&rdquo;
                  </p>

                  <div className="mt-6 flex items-center gap-3 border-t border-ink-line pt-5">
                    {t.image_url ? (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gold-400/20 bg-ink">
                        <Image src={t.image_url} alt={name} fill sizes="48px" className="object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold-400/25 bg-gold-400/10 font-display text-base font-semibold text-gold-200 animate-fadeIn">
                        {name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-display text-base text-ivory font-medium truncate">{name}</p>
                      <p className="text-sm text-ivory/40 truncate">
                        {title} {t.location ? `· ${t.location}` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {items.length > VISIBLE_COUNT && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={handlePrev}
                aria-label="Previous testimonials"
                className="w-11 h-11 rounded-full border border-gold-400/20 bg-ink-soft/80 text-gold-300 hover:text-gold-200 hover:border-gold-300/40 flex items-center justify-center transition-all backdrop-blur-sm hover:-translate-x-1"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-1.5">
                {items.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goTo(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === startIndex ? "w-8 bg-gold-300" : "w-2.5 bg-ink-line hover:bg-gold-400/30"
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                aria-label="Next testimonials"
                className="w-11 h-11 rounded-full border border-gold-400/20 bg-ink-soft/80 text-gold-300 hover:text-gold-200 hover:border-gold-300/40 flex items-center justify-center transition-all backdrop-blur-sm hover:translate-x-1"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
