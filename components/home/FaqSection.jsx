import Image from "next/image";
import Reveal from "@/components/Reveal";
import { ChevronDown } from "lucide-react";

export default function FaqSection({
  subtitle = "Everything you need to know before you order.",
  image = "/FaqPerfume.png",
  showImage = true,
  q1 = "What is the difference between attar and perfume?",
  a1 = "Attar is pure oil and has no alcohol. It sits close to your skin and lasts up to 24 hours. Perfume has alcohol, sprays easily, and spreads in the air quickly. We sell both.",
  q2 = "How long does one bottle last?",
  a2 = "Attars are very strong. A small 6ml bottle lasts for 60 to 90 uses since you only need a few drops. Our spray perfumes last for 400 to 600 sprays.",
  q3 = "Do you ship across India?",
  a3 = "Yes, we ship all over India. We pack your order in 1 to 2 days. Delivery usually takes 3 to 6 days depending on your city.",
  q4 = "Can I return my order?",
  a4 = "For hygiene reasons, we cannot accept returns on opened bottles. If your bottle arrives broken or damaged, we will replace it for free. Just message us on WhatsApp with a photo.",
}) {
  const FAQS = [
    { q: q1, a: a1 },
    { q: q2, a: a2 },
    { q: q3, a: a3 },
    { q: q4, a: a4 },
  ];
  return (
    <section className="relative overflow-hidden bg-[#0c0a09] py-16 sm:py-24">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60">
        <div className="absolute left-[5%] top-0 h-[400px] w-[450px] rounded-full bg-gold-500/10 blur-[130px]" />
        <div className="absolute right-[8%] bottom-0 h-[400px] w-[450px] rounded-full bg-gold-300/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-wrap px-6 md:px-12">
        <Reveal className="mb-10 sm:mb-16">
          <p className="eyebrow">
            <span className="gold-line" /> Good to Know
          </p>
          <h2 className="section-heading mt-4 font-light text-ivory">
            Questions{" "}
            <span className="bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400 bg-clip-text font-semibold text-transparent">
              You Might Have
            </span>
          </h2>
          <p className="mt-3 max-w-md text-sm font-light leading-relaxed text-ivory/50 sm:mt-4 sm:text-base lg:text-lg">
            {subtitle}
          </p>
        </Reveal>

        <div className={`relative z-10 grid grid-cols-1 gap-10 ${showImage ? "md:grid-cols-[380px_1fr] md:items-start" : ""}`}>
          {/* Left: Visual */}
          {showImage && (
            <Reveal delay={80} className="flex justify-center md:block">
              <div className="relative aspect-square w-full max-w-[240px] sm:max-w-[300px] md:max-w-none">
                <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(202,161,75,0.35),transparent_65%)] blur-3xl" />
                <Image
                  src={image}
                  alt="Amairah Perfumes"
                  fill
                  sizes="(max-width: 768px) 300px, 380px"
                  className="relative object-contain"
                />
              </div>
            </Reveal>
          )}

          {/* FAQ Accordion List */}
          <div className="space-y-2.5 sm:space-y-4">
            {FAQS.map((item, i) => (
              <Reveal key={item.q} delay={i * 80}>
                <details className="group relative overflow-hidden rounded-2xl border border-gold-400/10 bg-ink-soft/30 px-3.5 transition-all duration-500 hover:border-gold-400/25 open:border-gold-400/30 open:bg-gold-400/[0.03] open:shadow-[0_20px_45px_-28px_rgba(202,161,75,0.3)] sm:px-6">
                  <span className="pointer-events-none absolute left-0 top-0 h-full w-[2px] bg-gold-400/0 transition-all duration-500 group-open:bg-gold-300" />

                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2.5 py-3.5 font-display text-sm font-medium text-ivory/80 transition-colors duration-300 group-hover:text-gold-200 sm:gap-4 sm:py-5 sm:text-lg lg:text-xl">
                    <span>{item.q}</span>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold-400/15 text-gold-300/80 transition-all duration-500 group-open:rotate-180 group-open:border-gold-400/40 group-open:bg-gold-400/10 sm:h-8 sm:w-8">
                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                    </span>
                  </summary>

                  <p className="pb-3.5 text-xs font-light leading-relaxed text-ivory/50 sm:pb-5 sm:text-base lg:text-lg">{item.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
