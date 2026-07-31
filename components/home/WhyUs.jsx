import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Droplet, Leaf, Clock, HeartHandshake, Award, ArrowRight } from "lucide-react";

const POINTS = [
  { icon: Droplet, title: "Extrait de Parfum", short: "This scent lasts a very long time on your skin." },
  { icon: Leaf, title: "Alcohol-Free Attars", short: "Made with pure oil. Safe for all skin types." },
  { icon: Clock, title: "Made By Hand", short: "We make every bottle by hand, with care." },
  { icon: HeartHandshake, title: "Cruelty-Free", short: "We never test on animals. Only clean ingredients." },
];

export default function WhyUs() {
  return (
    <section className="relative overflow-hidden border-y border-ink-line bg-gradient-to-b from-[#0b0a0a] to-[#120f0c] py-16 sm:py-24">

      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60">
        <div className="absolute right-[-8%] top-[10%] h-[450px] w-[450px] rounded-full bg-gold-400/10 blur-[130px]" />
        <div className="absolute left-[-5%] bottom-0 h-[400px] w-[400px] rounded-full bg-gold-500/10 blur-[130px]" />
        <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-300/5 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-wrap px-6 md:px-12">
        <Reveal className="mx-auto mb-10 max-w-xl text-center sm:mb-16">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold-400/20 bg-ink-soft/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-200 backdrop-blur-md">
            <Award className="h-3.5 w-3.5 text-gold-300" />
            The Amairah Difference
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory">
            Why{" "}
            <span className="bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400 bg-clip-text font-semibold text-transparent">
              Choose Us
            </span>
          </h2>
          <div className="mx-auto mt-4 h-px w-16 bg-gold-400/40" />
        </Reveal>


        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {POINTS.map((point, i) => (
            <Reveal key={point.title} delay={i * 100}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-ink-line bg-gradient-to-b from-ink-soft/50 to-ink-soft/10 p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-400/30 hover:shadow-[0_25px_60px_-24px_rgba(202,161,75,0.3)] sm:p-8">
                {/* Hover glow wash */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_0%,rgba(202,161,75,0.08),transparent_70%)]" />

                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-gold-300 to-transparent transition-transform duration-500 group-hover:scale-x-100"
                />

                <span
                  aria-hidden
                  className="absolute right-2 top-2 select-none font-display text-5xl font-semibold leading-none text-ivory/[0.05] transition-colors duration-500 group-hover:text-gold-300/10 sm:text-6xl lg:text-7xl"
                >
                  0{i + 1}
                </span>

                <div className="relative mx-auto mb-5 h-14 w-14 sm:mb-6 sm:h-16 sm:w-16">
                  {/* Rotating gold ring */}
                  <div
                    className="absolute -inset-2 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 animate-spin"
                    style={{
                      animationDuration: "5s",
                      background: "conic-gradient(from 0deg, transparent 0%, rgba(212,163,89,0.7) 20%, transparent 40%)",
                    }}
                  />
                  <div className="relative flex h-full w-full items-center justify-center rounded-2xl border border-gold-400/15 bg-[#0b0a0a] bg-gradient-to-br from-gold-400/10 to-transparent text-gold-300 transition-all duration-300 group-hover:scale-105 group-hover:border-gold-400/40 group-hover:text-gold-200 group-hover:shadow-gold">
                    <point.icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.5} />
                  </div>
                </div>

                <h3 className="relative mb-2 font-display text-lg font-medium text-ivory sm:mb-2.5 sm:text-xl lg:text-2xl">{point.title}</h3>
                <p className="relative text-sm font-light leading-relaxed text-ivory/55 sm:text-base lg:text-lg">{point.short}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-10 text-center sm:mt-16">
          <Link
            href="/shop"
            className="btn-gold group inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium transition-transform hover:scale-[1.02] sm:px-8 sm:py-4"
          >
            Shop the Collection
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
