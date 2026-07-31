import { Sparkles, ShieldCheck, Droplet, Truck } from "lucide-react";
import BottleGlyph from "@/components/BottleGlyph";

const POINTS = [
  { icon: Droplet, text: "Extrait-grade concentration, up to 24 hrs wear" },
  { icon: ShieldCheck, text: "100% cruelty-free, alcohol-free attars" },
  { icon: Truck, text: "Pan-India shipping, cash on delivery available" },
];

export default function AuthShowcase() {
  return (
    <div className="relative hidden h-full flex-col justify-center overflow-hidden bg-gradient-to-b from-[#120f0d] to-[#080707] px-16 py-16 lg:flex border-r border-gold-400/10">
      <div className="pointer-events-none absolute -left-24 top-10 h-96 w-96 rounded-full bg-gold-500/5 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-96 w-96 rounded-full bg-gold-400/5 blur-[150px] animate-pulse" style={{ animationDuration: '12s' }} />
      <BottleGlyph className="pointer-events-none absolute -right-20 top-1/2 h-[30rem] w-auto -translate-y-1/2 opacity-[0.05]" />

      <div className="relative max-w-md">
        <span className="eyebrow inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-gold-300">
          <Sparkles className="h-3.5 w-3.5" /> Amairah Perfumes
        </span>
        <h2 className="mt-6 font-display text-4xl leading-tight text-ivory xl:text-5xl font-light">
          Fragrance Worth <br />
          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400">Coming Back To</span>
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-ivory/50 font-light max-w-sm">
          Create an account to track orders, save favorites, and check out faster every time.
        </p>

        <div className="mt-12 space-y-5">
          {POINTS.map((p) => (
            <div key={p.text} className="flex items-center gap-4 group">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gold-400/10 text-gold-300 ring-1 ring-gold-400/20 group-hover:scale-105 transition-transform duration-300">
                <p.icon className="h-4.5 w-4.5" strokeWidth={1.5} />
              </span>
              <span className="text-sm text-ivory/70 font-light">{p.text}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 border-l border-gold-400/40 pl-6 relative">
          <p className="font-display text-lg xl:text-xl italic leading-relaxed text-ivory/80 font-light">
            "The first attar I've tried that doesn't fade within an hour. Genuinely extrait-grade."
          </p>
        </div>
      </div>
    </div>
  );
}
