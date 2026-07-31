"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import StarRating from "@/components/StarRating";
import { Quote, User, ChevronLeft, ChevronRight } from "lucide-react";

const DEFAULT_TESTIMONIALS = [
  {
    customer_name: "Ayesha K.",
    location: "Lucknow",
    review_text: "The Oudh Mustaqeem attar lasted through a full wedding function without a single reapplication. Deep, warm, not overpowering.",
    rating: 5,
    image_url: null,
  },
  {
    customer_name: "Rohit Malhotra",
    location: "Delhi",
    review_text: "The first attar I've tried that doesn't fade to an alcohol smell within an hour. Genuinely extrait-grade.",
    rating: 5,
    image_url: null,
  },
  {
    customer_name: "Sana Sheikh",
    location: "Hyderabad",
    review_text: "Ordered the 6ml rose attar to try, ended up gifting the 12ml to my mother the same week.",
    rating: 5,
    image_url: null,
  },
  {
    customer_name: "Devendra S.",
    location: "Jaipur",
    review_text: "Truly alcohol-free. It stays mild on the skin and lasts all day. Amairah has the best collection.",
    rating: 5,
    image_url: null,
  },
  {
    customer_name: "Priya Patel",
    location: "Ahmedabad",
    review_text: "The packaging is so premium, and the smell of Rose & Oud is extremely rich. Got so many compliments.",
    rating: 5,
    image_url: null,
  },
  {
    customer_name: "Kabir Verma",
    location: "Mumbai",
    review_text: "Extrait-grade oils are the real deal. You only need a tiny drop and it stays fresh for hours.",
    rating: 5,
    image_url: null,
  },
];

export default function Testimonials({
  testimonials = [],
  subtitle = "Real experiences from real customers, in their own words.",
}) {
  const items = testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;
  const containerRef = useRef(null);

  const scrollByCard = (direction) => {
    const container = containerRef.current;
    if (!container) return;
    const card = container.firstElementChild;
    const cardWidth = card ? card.clientWidth + 24 : 389; // card width + 24px gap
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    if (direction === "next") {
      if (container.scrollLeft >= maxScrollLeft - 10) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    } else {
      if (container.scrollLeft <= 10) {
        container.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
      } else {
        container.scrollBy({ left: -cardWidth, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => scrollByCard("next"), 4000);
    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <section className="relative overflow-hidden bg-[#0a0908] py-16 sm:py-24">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60">
        <div className="absolute left-[8%] top-0 h-[400px] w-[450px] rounded-full bg-gold-500/10 blur-[130px]" />
        <div className="absolute right-[6%] bottom-0 h-[400px] w-[450px] rounded-full bg-gold-300/10 blur-[130px]" />
        <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/5 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-wrap px-6 md:px-12">
        <Reveal className="mx-auto mb-10 max-w-xl text-center sm:mb-16">
          <p className="eyebrow justify-center">
            <span className="gold-line" /> Customer Voices <span className="gold-line" />
          </p>
          <h2 className="section-heading mt-4 font-light text-ivory">
            What Our{" "}
            <span className="bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400 bg-clip-text font-semibold text-transparent">
              Customers Say
            </span>
          </h2>
          <p className="mt-3 text-base font-light leading-relaxed text-ivory/50 sm:mt-4 sm:text-lg lg:text-xl">
            {subtitle}
          </p>
        </Reveal>

        {/* Horizontal Swiper (Single Row Scroll) */}
        <div className="relative">
          <div ref={containerRef} className="no-scrollbar relative z-0 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pt-3 pb-6">
            {items.map((item, i) => (
                <div key={i} className="w-[85vw] shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc((100%-48px)/3)]">
                  <div className="group relative flex h-full min-h-[260px] flex-col justify-between overflow-hidden rounded-[2rem] border border-ink-line bg-gradient-to-b from-ink-soft/50 to-ink-soft/10 p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-400/30 hover:shadow-[0_25px_60px_-24px_rgba(202,161,75,0.3)] sm:min-h-[300px] sm:p-8 lg:p-9">
                    {/* Hover glow wash */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(202,161,75,0.08),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-gold-300 to-transparent transition-transform duration-500 group-hover:scale-x-100"
                    />

                    <Quote
                      className="absolute right-5 top-5 h-8 w-8 text-gold-400/[0.1] transition-all duration-500 group-hover:scale-110 group-hover:text-gold-300/25 sm:right-6 sm:top-6 sm:h-11 sm:w-11"
                      strokeWidth={1.5}
                    />

                    <div className="relative">
                      <StarRating rating={item.rating} size={14} />
                      <p className="mt-4 text-sm font-light italic leading-relaxed text-ivory/70 sm:mt-5 sm:text-lg lg:text-xl">
                        &ldquo;{item.review_text}&rdquo;
                      </p>
                    </div>

                    <div className="relative mt-6 flex items-center gap-3 border-t border-gold-400/10 pt-4 sm:mt-8 sm:gap-4 sm:pt-5">
                      <div className="relative h-11 w-11 shrink-0 sm:h-14 sm:w-14">
                        <div
                          className="absolute -inset-1.5 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 animate-spin"
                          style={{
                            animationDuration: "5s",
                            background: "conic-gradient(from 0deg, transparent 0%, rgba(212,163,89,0.7) 20%, transparent 40%)",
                          }}
                        />
                        <div className="relative h-full w-full overflow-hidden rounded-full border border-gold-400/20 bg-ink transition-all duration-300 group-hover:border-gold-400/40">
                          {item.image_url ? (
                            <Image src={item.image_url} alt={item.customer_name} fill sizes="56px" className="object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gold-400/5">
                              <User className="h-1/2 w-auto text-gold-300/40" strokeWidth={1.5} />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-display text-sm font-semibold text-ivory transition-colors duration-300 group-hover:text-gold-200 sm:text-lg">
                          {item.customer_name}
                        </p>
                        {item.location && (
                          <p className="mt-0.5 text-[10px] uppercase tracking-widest text-ivory/40 sm:text-xs">
                            {item.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
            ))}
          </div>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => scrollByCard("prev")}
                aria-label="Previous testimonial"
                className="absolute left-0 top-1/2 z-10 hidden h-11 w-11 -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-gold-400/20 bg-ink-soft/90 text-gold-300 backdrop-blur-md transition-all duration-300 hover:border-gold-300/40 hover:bg-gold-400/10 hover:scale-105 sm:flex"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard("next")}
                aria-label="Next testimonial"
                className="absolute right-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 translate-x-4 items-center justify-center rounded-full border border-gold-400/20 bg-ink-soft/90 text-gold-300 backdrop-blur-md transition-all duration-300 hover:border-gold-300/40 hover:bg-gold-400/10 hover:scale-105 sm:flex"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
