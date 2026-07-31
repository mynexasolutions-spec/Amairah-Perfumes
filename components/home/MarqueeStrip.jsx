import { Sparkles } from "lucide-react";

const DEFAULT_ITEMS =
  "*Extrait-Grade Concentration\nHand-Poured in Small Batches\n100% Cruelty-Free\n*Pan-India Shipping\nCash on Delivery Available\n*Alcohol-Free Attars";

function parseItems(raw) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => ({
      text: line.startsWith("*") ? line.slice(1).trim() : line,
      highlight: line.startsWith("*"),
    }));
}

export default function MarqueeStrip({ items = DEFAULT_ITEMS }) {
  const parsed = parseItems(items);
  const loop = [...parsed, ...parsed, ...parsed];

  return (
    <div className="relative overflow-hidden border-y border-gold-400/10 bg-[#0a0908]/90 py-5 sm:py-6 backdrop-blur-md">
      {/* Shimmering top/bottom hairlines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gold-gradient bg-[length:200%_200%] animate-shimmer" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gold-gradient bg-[length:200%_200%] animate-shimmer" />

      {/* Subtle centered glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/[0.06] blur-[80px]" />

      {/* Left Fade Mask */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-[#0b0a0a] to-transparent z-10" />

      {/* Right Fade Mask */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-[#0b0a0a] to-transparent z-10" />

      <div className="relative flex w-max animate-marquee gap-8 sm:gap-12 whitespace-nowrap hover:[animation-play-state:paused] cursor-pointer">
        {loop.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 sm:gap-5 text-[11px] sm:text-sm font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] transition-transform duration-300 hover:scale-105"
          >
            {item.highlight ? (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400 font-bold drop-shadow-[0_2px_8px_rgba(212,175,55,0.25)]">
                {item.text}
              </span>
            ) : (
              <span className="text-ivory/90">
                {item.text}
              </span>
            )}
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-300 animate-pulse shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}

