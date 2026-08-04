"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Sun, Moon, Sparkles, ChevronDown } from "lucide-react";

const OPTION_ICONS = [Sun, Moon, Sparkles];

const DEFAULT_SUBTITLE =
  "Finding a perfume that matches your personality matters. This guide helps you choose the one that's really you.";

export default function HowToChoose({
  subtitle = DEFAULT_SUBTITLE,
  image = "/find_perfect.png",
  showImage = true,
  option1Title = "For Every Day",
  option1Desc = "Light and fresh scents that you can wear from morning to evening. Very easy to wear and love.",
  option2Title = "For Special Occasions",
  option2Desc = "Rich and strong scents that make you stand out. A perfume that people will remember even after you leave.",
  option3Title = "Universal",
  option3Desc = "Balanced scents that smell great in any season, any mood, and suit almost everyone.",
  unsureTitle = "Still Unsure?",
  unsureText = "Just place your order, try it on your skin, and see for yourself why it's worth it.",
  unsureButton = "Order Now",
}) {
  const [activeIndex, setActiveIndex] = useState(1);

  const OPTIONS = [
    { title: option1Title, description: option1Desc, icon: OPTION_ICONS[0] },
    { title: option2Title, description: option2Desc, icon: OPTION_ICONS[1] },
    { title: option3Title, description: option3Desc, icon: OPTION_ICONS[2] },
  ];

  return (
    <section id="how-to-choose" className="relative scroll-mt-20 overflow-hidden bg-[#0b0a0a] py-16 sm:py-24">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60">
        <div className="absolute left-[8%] top-0 h-[400px] w-[450px] rounded-full bg-gold-500/10 blur-[130px]" />
        <div className="absolute right-[10%] bottom-0 h-[400px] w-[450px] rounded-full bg-gold-300/10 blur-[130px]" />
        <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/5 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-wrap px-6 md:px-12">
        <Reveal className="mb-12 sm:mb-16 text-center">
          <p className="eyebrow justify-center">
            <span className="gold-line" /> How To Choose <span className="gold-line" />
          </p>
          <h2 className="section-heading mt-4">
            Find the{" "}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400">
              Perfect Scent
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base sm:text-lg text-ivory/50 font-light leading-relaxed">
            {subtitle}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* Left: Scent Image */}
          {showImage && (
            <div className="lg:col-span-4 flex justify-center lg:justify-start">
              <Reveal className="group relative aspect-[4/5] w-full max-w-[240px] overflow-hidden rounded-full border border-gold-400/20 bg-ink-gradient shadow-2xl sm:max-w-[300px]">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-ink via-transparent to-transparent opacity-50" />

                <Image
                  src={image}
                  alt="Amairah Perfumes fragrance"
                  fill
                  sizes="(max-width: 1024px) 80vw, 30vw"
                  className="object-cover scale-100 transition-transform duration-700 ease-out group-hover:scale-105"
                />

                <div className="pointer-events-none absolute inset-3 z-20 rounded-full border border-gold-400/10" />
              </Reveal>
            </div>
          )}

          {/* Center: Interactive Options */}
          <div className={showImage ? "lg:col-span-5" : "lg:col-span-8"}>
            <Reveal className="space-y-3">
              {OPTIONS.map((option, i) => {
                const isActive = activeIndex === i;
                const Icon = option.icon;
                return (
                  <button
                    key={option.title}
                    onClick={() => setActiveIndex(i)}
                    aria-expanded={isActive}
                    className={`group/opt block w-full rounded-2xl border px-4 py-3.5 text-left transition-all duration-300 sm:px-5 sm:py-4 ${
                      isActive
                        ? "border-gold-400/40 bg-gold-400/5 shadow-[0_15px_40px_-24px_rgba(202,161,75,0.2)]"
                        : "border-ink-line bg-ink-soft/30 hover:border-gold-400/20 hover:bg-ink-soft/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 sm:h-12 sm:w-12 ${
                          isActive
                            ? "border-gold-300/60 bg-gold-400/10 text-gold-200"
                            : "border-ink-line text-ivory/40 group-hover/opt:text-gold-300/70"
                        }`}
                      >
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <span
                          className={`font-display text-base sm:text-xl lg:text-2xl transition-colors duration-300 ${
                            isActive ? "text-gold-200" : "text-ivory/70"
                          }`}
                        >
                          {option.title}
                        </span>

                        {isActive && (
                          <p className="mt-2 max-w-sm text-sm leading-relaxed text-ivory/55 font-light animate-fadeUp sm:text-base lg:text-lg">
                            {option.description}
                          </p>
                        )}
                      </div>

                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-gold-300/60 transition-transform duration-300 ${
                          isActive ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </Reveal>
          </div>

          {/* Right: Consultation Card */}
          <div className={`flex justify-center lg:justify-end ${showImage ? "lg:col-span-3" : "lg:col-span-4"}`}>
            <Reveal delay={120} className="w-full max-w-[260px] sm:max-w-[280px]">
              <div className="relative overflow-hidden rounded-t-[90px] rounded-b-2xl border border-gold-400/20 bg-gradient-to-b from-gold-400/10 via-ink-soft/40 to-ink-soft/80 px-6 py-8 text-center shadow-[0_15px_40px_-24px_rgba(202,161,75,0.2)] backdrop-blur-sm sm:rounded-t-[140px] sm:py-10">
                <div className="pointer-events-none absolute -top-8 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full border border-gold-400/10 sm:-top-10 sm:h-32 sm:w-32" />

                <span className="relative mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-200 sm:h-12 sm:w-12">
                  <Sparkles className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </span>

                <h4 className="relative mt-4 font-display text-xl font-light text-gold-100 sm:mt-5 sm:text-2xl">
                  {unsureTitle}
                </h4>
                <p className="relative mt-3 text-sm leading-relaxed text-ivory/55 font-light sm:text-base">
                  {unsureText}
                </p>

                <Link
                  href="/shop"
                  className="relative mt-6 block w-full rounded-full border border-gold-400/40 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold-200 transition-all hover:border-gold-300 hover:bg-gold-400/5 sm:mt-7"
                >
                  {unsureButton}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
