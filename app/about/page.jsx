import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import BottleGlyph from "@/components/BottleGlyph";
import TestimonialSection from "@/components/about/TestimonialSection";
import StatCounter from "@/components/about/StatCounter";
import { getFeaturedProducts } from "@/actions/products";
import { whatsappLink } from "@/lib/constants";
import {
  Leaf,
  Clock,
  FlaskConical,
  Sparkles,
  Quote,
  Compass,
  Award,
  ShieldCheck,
  Flame,
  ChevronDown,
} from "lucide-react";

export const metadata = { title: "Our Story - Amairah Perfumes" };

const VALUES = [
  { 
    icon: Flame, 
    title: "Long-Lasting Scents", 
    text: "We use high-concentration fragrance oils. This makes sure our perfumes smell deep, rich, and last on your skin all day long." 
  },
  { 
    icon: Leaf, 
    title: "Alcohol-Free Oils", 
    text: "Our traditional attars are made of pure oil. They contain no alcohol, making them very gentle and safe for sensitive skin." 
  },
  { 
    icon: Clock, 
    title: "Matured Patiently", 
    text: "We let our perfume mixtures rest for weeks before bottling. This naturally blends the ingredients to make the scent smooth and balanced." 
  },
  { 
    icon: ShieldCheck, 
    title: "100% Cruelty-Free", 
    text: "We never test our ingredients or products on animals. We believe in being kind, clean, and honest about how we make our perfumes." 
  },
];

const PROCESS = [
  {
    icon: Compass,
    title: "Sourcing Ingredients",
    text: "We source and buy the best natural flowers, herbs, and oils from across India to make unique scents."
  },
  {
    icon: FlaskConical,
    title: "Hand Blending",
    text: "Our experts mix each perfume by hand in small batches. This keeps the quality and scent perfect in every bottle."
  },
  {
    icon: Clock,
    title: "Letting it Rest",
    text: "We let the mixture rest in dark rooms for weeks. This makes the base smell deeper and blends the notes smoothly together."
  },
  {
    icon: Award,
    title: "Quality Check",
    text: "We check every single bottle, fill and label it by hand, and test it ourselves before shipping it to you."
  },
];

const STATS = [
  { icon: FlaskConical, value: "15+", label: "Original Blends" },
  { icon: Clock, value: "24h+", label: "Avg. Longevity" },
  { icon: ShieldCheck, value: "100%", label: "Cruelty Free" },
  { icon: Leaf, value: "0%", label: "Synthetic Alcohol" },
];

export default async function AboutPage() {
  const featuredProducts = await getFeaturedProducts(4);
  const storyImage = featuredProducts.find((p) => p.image)?.image || null;

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#0b0a0a] text-ivory overflow-hidden pb-28 pt-20">
        
        {/* Decorative background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gold-500/5 blur-[120px]" />
          <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gold-400/5 blur-[150px]" />
          <div className="absolute bottom-[15%] left-[20%] w-[500px] h-[500px] rounded-full bg-gold-600/5 blur-[130px]" />
        </div>

        {/* Hero Section */}
        <section className="relative pt-12 pb-20 md:py-28">
          {/* Decorative bottle image */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.12]">
            <div className="relative h-[75%] w-[75%] max-w-xl">
              <Image src="/perfume_bottle.png" alt="" fill className="object-contain" />
            </div>
          </div>

          <div className="relative mx-auto max-w-wrap px-6 md:px-12 text-center">
            <Reveal>
              <span className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-gold-400/20 bg-ink-soft/80 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-200 backdrop-blur-md mb-6">
                <Sparkles className="w-3.5 h-3.5 text-gold-300 animate-pulse" />
                Premium Fragrances
              </span>
              <h1 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] text-ivory font-light">
                Scents That Stay <br />
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-300 to-gold-500">
                  With You Forever
                </span>
              </h1>
              <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
              <p className="mt-8 text-base sm:text-lg md:text-xl text-ivory/60 max-w-3xl mx-auto leading-relaxed font-light">
                Amairah Perfumes was started to create better scents. We were tired of cheap, alcohol-heavy sprays that fade away in minutes. So we went back to traditional, slow blending. We make rich, oil-based perfumes that last long and suit your style.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
                <Link href="/shop" className="btn-gold px-8 py-4 text-sm font-medium hover:scale-[1.02] transition-transform">
                  Shop Perfumes
                </Link>
                <a
                  href={whatsappLink("Hi Amairah Perfumes, I would love to explore your bespoke fragrances.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline px-8 py-4 text-sm font-medium hover:bg-gold-400/5 transition-all"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </Reveal>
          </div>

          {/* Scroll Cue */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block">
            <button aria-label="Scroll to explore" className="animate-bounce text-ivory/30 hover:text-gold-300 transition-colors">
              <ChevronDown className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </section>

        {/* Story Section */}
        <section className="relative py-14 sm:py-20 border-y border-ink-line bg-ink-soft/30 backdrop-blur-sm">
          <div className="mx-auto max-w-wrap px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              
              {/* Image side */}
              <div className="order-1 lg:order-2 lg:col-span-5 flex justify-center lg:justify-end">
                <Reveal className="relative group w-full max-w-[320px] aspect-[4/5] rounded-[160px] overflow-hidden border border-gold-400/20 bg-ink-gradient shadow-2xl transition-all duration-500 hover:border-gold-300/40">
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80 z-10" />
                  <div className="absolute inset-0 bg-gold-gradient opacity-[0.03] mix-blend-overlay group-hover:opacity-10 transition-opacity duration-500" />
                  
                  {storyImage ? (
                    <Image
                      src={storyImage}
                      alt="Amairah Perfumes Artisanal Creation"
                      fill
                      sizes="(max-width: 1024px) 80vw, 30vw"
                      className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <BottleGlyph className="h-1/2 w-auto text-gold-300/40 animate-floatSlow" />
                    </div>
                  )}

                  {/* Decorative Frame */}
                  <div className="absolute inset-3 rounded-[150px] border border-gold-400/10 pointer-events-none z-20" />
                </Reveal>
              </div>

              {/* Text side */}
              <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col justify-center">
                <Reveal delay={100}>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-300 mb-4 block">
                    Our Promise
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-tight text-ivory font-light">
                    Made Slowly. <br />
                    <span className="font-medium text-gold-200">Tested By Us First.</span>
                  </h2>
                  <p className="mt-6 text-base sm:text-lg text-ivory/70 leading-relaxed font-light">
                    Every perfume we make goes through a strict quality check. We work with traditional distillers across India to source pure flower oils and natural ingredients.
                  </p>
                  <p className="mt-4 text-base sm:text-lg text-ivory/70 leading-relaxed font-light">
                    Before selling any batch, our team wears the scent daily to test how long it lasts and how it smells. We only sell what we absolutely love ourselves.
                  </p>

                  <div className="group mt-8 p-6 sm:p-8 rounded-2xl bg-[#120f0d]/90 border-l-4 border-l-gold-400 border-y border-r border-gold-400/10 relative overflow-hidden backdrop-blur-md shadow-lg transition-all duration-500 hover:border-gold-400/25 hover:shadow-[0_0_40px_rgba(212,163,89,0.08)]">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500">
                      <Quote className="w-16 h-16 sm:w-24 sm:h-24 text-gold-300" />
                    </div>
                    <p className="font-display text-xl sm:text-2xl italic text-gold-100 leading-relaxed relative z-10">
                      &ldquo;A good perfume is not just mixed chemicals. It is a work of art that opens up beautifully on your skin and leaves a lasting impression.&rdquo;
                    </p>
                    <div className="mt-5 flex items-center gap-3 relative z-10">
                      <div className="h-[1px] w-8 bg-gold-400/50" />
                      <span className="text-[11px] uppercase tracking-widest text-gold-300 font-semibold">Founder, Amairah Perfumes</span>
                    </div>
                  </div>
                </Reveal>
              </div>

            </div>
          </div>
        </section>

        {/* Process Timeline Section */}
        <section className="py-16 sm:py-24 relative">
          <div className="mx-auto max-w-wrap px-6 md:px-12">
            <Reveal className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-300 mb-3 block">
                Traditional Process
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory">
                How We Make It
              </h2>
              <div className="w-16 h-[1px] bg-gold-400/40 mx-auto mt-4" />
            </Reveal>

            {/* Horizontal timeline connector (desktop only) */}
            <div className="hidden lg:block absolute top-1/3 left-[5%] right-[5%] h-[1px] bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {PROCESS.map((step, i) => (
                <Reveal key={step.title} delay={i * 100}>
                  <div className="relative group h-full overflow-hidden rounded-3xl border border-gold-400/10 bg-[#120f0d]/80 p-8 transition-all duration-500 hover:border-gold-400/30 hover:bg-[#120f0d] hover:-translate-y-2 flex flex-col justify-between shadow-xl backdrop-blur-sm">
                    {/* Large watermark numeral */}
                    <span className="pointer-events-none absolute right-4 top-2 font-display text-5xl sm:text-6xl font-semibold leading-none text-transparent bg-clip-text bg-gradient-to-b from-gold-300/15 to-gold-300/0 transition-transform duration-500 group-hover:scale-110 group-hover:from-gold-300/25">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="relative">
                      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-300 shadow-[0_0_20px_rgba(212,163,89,0.08)] transition-all duration-500 group-hover:scale-110 group-hover:border-gold-300/50 group-hover:text-gold-200 group-hover:shadow-[0_0_25px_rgba(212,163,89,0.2)]">
                        <step.icon className="w-6 h-6" strokeWidth={1.5} />
                      </div>
                      <h3 className="font-display text-xl text-ivory font-medium mb-3 group-hover:text-gold-200 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-base sm:text-lg leading-relaxed text-ivory/65 font-light">
                        {step.text}
                      </p>
                    </div>

                    {/* Hover glow line */}
                    <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-gold-400/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Showcase */}
        <section className="py-12 sm:py-16 relative">
          <div className="mx-auto max-w-wrap px-6 md:px-12">
            <Reveal>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 sm:gap-10 md:gap-4 rounded-[2rem] sm:rounded-[2.5rem] border border-gold-400/15 bg-ink-gradient shadow-2xl px-4 sm:px-8 py-10 sm:py-14 md:py-16 text-center relative overflow-hidden backdrop-blur-md">

                {/* Subtle radial backdrop for the stats container */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(202,161,75,0.06),transparent_70%)] pointer-events-none" />

                {STATS.map((stat, idx) => (
                  <div key={stat.label} className="relative group">
                    {idx > 0 && (
                      <div className="hidden md:block absolute left-0 top-1/4 bottom-1/4 w-[1px] bg-gold-400/10" />
                    )}
                    <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-300/70 shadow-[0_0_20px_rgba(212,163,89,0.08)] transition-all duration-300 group-hover:scale-110 group-hover:border-gold-300/50 group-hover:text-gold-200 group-hover:shadow-[0_0_25px_rgba(212,163,89,0.2)]">
                      <stat.icon className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <p className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-gold-100 via-gold-200 to-gold-400 group-hover:scale-105 transition-transform duration-300">
                      <StatCounter value={stat.value} />
                    </p>
                    <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-ivory/40">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Testimonial Carousel Section */}
        <TestimonialSection />

        {/* Values Grid Section */}
        <section className="py-16 sm:py-24 relative">
          <div className="mx-auto max-w-wrap px-6 md:px-12">
            <Reveal className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-300 mb-3 block">
                Our Promise
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory">
                What We Stand For
              </h2>
              <div className="w-16 h-[1px] bg-gold-400/40 mx-auto mt-4" />
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {VALUES.map((v, i) => (
                <Reveal key={v.title} delay={i * 100}>
                  <div className="group relative overflow-hidden rounded-[2rem] border border-gold-400/10 bg-[#120f0d]/80 p-8 sm:p-12 transition-all duration-500 hover:border-gold-400/30 hover:bg-[#120f0d] hover:-translate-y-1.5 hover:shadow-[0_0_40px_rgba(212,163,89,0.08)] flex flex-col sm:flex-row gap-7 items-start shadow-xl backdrop-blur-sm">
                    {/* Giant watermark icon */}
                    <v.icon className="pointer-events-none absolute bottom-4 right-4 h-24 w-24 text-gold-300/[0.04] transition-transform duration-700 group-hover:scale-110 group-hover:text-gold-300/[0.07]" strokeWidth={1} />

                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-300 shadow-[0_0_20px_rgba(212,163,89,0.08)] transition-all duration-500 group-hover:scale-110 group-hover:border-gold-300/50 group-hover:text-gold-200 group-hover:shadow-[0_0_25px_rgba(212,163,89,0.2)]">
                      <v.icon className="w-7 h-7" strokeWidth={1.5} />
                    </div>
                    <div className="relative">
                      <span className="mb-2 block font-display text-sm text-gold-400/50 tracking-widest">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl text-ivory font-semibold mb-3 group-hover:text-gold-200 transition-colors">
                        {v.title}
                      </h3>
                      <p className="text-base sm:text-lg leading-relaxed text-ivory/70 font-light">
                        {v.text}
                      </p>
                    </div>

                    {/* Hover glow line */}
                    <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-gold-400/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner Section */}
        <section className="relative py-8">
          <div className="mx-auto max-w-wrap px-6 md:px-12">
            <Reveal className="relative flex flex-col items-center justify-center overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-ink-gradient border border-gold-400/20 px-6 sm:px-8 py-14 sm:py-20 md:py-24 text-center shadow-2xl">

              {/* Shimmering top sheen */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gold-gradient bg-[length:200%_200%] animate-shimmer" />

              {/* Background Graphics */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(202,161,75,0.06),transparent_60%)] pointer-events-none" />
              <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-gold-400/5 blur-[100px] pointer-events-none" />
              <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-gold-300/5 blur-[100px] pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 shadow-[0_0_30px_rgba(212,163,89,0.12)]">
                  <BottleGlyph className="w-9 h-9 text-gold-300/70 animate-floatSlow" />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-300 mb-3 block">
                  Find Your Scent
                </span>
                <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-light text-ivory mb-6 leading-tight">
                  Ready to Find Your <br />
                  <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 to-gold-400">
                    Signature Scent?
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-ivory/60 mb-10 max-w-lg leading-relaxed font-light">
                  Explore our range of long-lasting perfumes, or talk to us on WhatsApp to help you choose the perfect scent.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link href="/shop" className="btn-gold px-9 py-4 text-sm font-semibold hover:scale-[1.03] transition-transform shadow-[0_4px_20px_rgba(212,163,89,0.15)] hover:shadow-[0_4px_25px_rgba(212,163,89,0.3)]">
                    Shop Perfumes
                  </Link>
                  <a
                    href={whatsappLink("Hi Amairah Perfumes, I would love to find my signature scent.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline px-9 py-4 text-sm font-semibold hover:bg-gold-400/10 hover:border-gold-300 transition-all"
                  >
                    Message on WhatsApp
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
