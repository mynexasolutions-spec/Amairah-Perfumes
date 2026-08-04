import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import BottleGlyph from "@/components/BottleGlyph";
import TestimonialSection from "@/components/about/TestimonialSection";
import StatCounter from "@/components/about/StatCounter";
import { getFeaturedProducts } from "@/actions/products";
import { getActiveTestimonials } from "@/actions/site";
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
  Heart,
  MapPin,
  Check,
} from "lucide-react";

export const metadata = { title: "About Us - Amairah Perfumes" };

const STATS = [
  { icon: FlaskConical, value: "100%", label: "IFRA Compliant" },
  { icon: Clock, value: "10h+", label: "Max Longevity" },
  { icon: ShieldCheck, value: "100%", label: "Cruelty Free" },
];

export default async function AboutPage() {
  const [featuredProducts, testimonials] = await Promise.all([
    getFeaturedProducts(4),
    getActiveTestimonials(),
  ]);
  const storyImage = featuredProducts.find((p) => p.image)?.image || null;
  const safeTestimonials = JSON.parse(JSON.stringify(testimonials));

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
                About Amairah Perfumes
              </span>
              <h1 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] text-ivory font-light">
                Luxury Fragrances, <br />
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-300 to-gold-500">
                  Made Accessible
                </span>
              </h1>
              <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
              <p className="mt-8 text-base sm:text-lg md:text-xl text-ivory/60 max-w-3xl mx-auto leading-relaxed font-light">
                At Amairah Perfumes, we believe everyone deserves to experience the elegance of luxury-inspired fragrances without paying luxury prices. Our mission is to make premium-quality fragrances accessible to everyone while maintaining exceptional quality, craftsmanship, and performance.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
                <Link href="/shop" className="btn-gold px-8 py-4 text-sm font-medium hover:scale-[1.02] transition-transform">
                  Shop Our Collection
                </Link>
                <a
                  href={whatsappLink("Hi Amairah Perfumes, I would love to explore your luxury-inspired fragrances.")}
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
                    Our Story
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-tight text-ivory font-light">
                    Inspired by Luxury. <br />
                    <span className="font-medium text-gold-200">Crafted for Everyone.</span>
                  </h2>
                  <p className="mt-6 text-base sm:text-lg text-ivory/70 leading-relaxed font-light">
                    Whether you're searching for an everyday signature scent or a fragrance for life's special moments, our collection is thoughtfully crafted to suit every personality, style, and occasion. We combine premium ingredients with careful blending to deliver fragrances that people enjoy wearing every day.
                  </p>
                  
                  <div className="mt-8 flex items-start gap-4 p-5 rounded-2xl bg-ink-soft/40 border border-gold-400/10 backdrop-blur-md">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-400/10 text-gold-300">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-gold-200">Proudly Based in Kadapa</h4>
                      <p className="mt-1 text-sm text-ivory/60 leading-relaxed font-light">
                        Amairah Perfumes is proudly based in Kadapa, Andhra Pradesh, serving fragrance lovers across India with secure packaging, reliable shipping, and dedicated customer support.
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>

            </div>
          </div>
        </section>

        {/* Commitment to Quality Cards */}
        <section className="py-16 sm:py-24 relative">
          <div className="mx-auto max-w-wrap px-6 md:px-12">
            <Reveal className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-300 mb-3 block">
                Quality & Craft
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory">
                Our Commitment
              </h2>
              <div className="w-16 h-[1px] bg-gold-400/40 mx-auto mt-4" />
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Card 1: Commitment to Quality */}
              <Reveal delay={50}>
                <div className="h-full overflow-hidden rounded-3xl border border-gold-400/10 bg-[#120f0d]/80 p-8 transition-all duration-500 hover:border-gold-400/30 hover:bg-[#120f0d] hover:-translate-y-1.5 flex flex-col justify-between shadow-xl backdrop-blur-sm">
                  <div>
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-300 shadow-[0_0_20px_rgba(212,163,89,0.08)]">
                      <Award className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-display text-xl text-ivory font-medium mb-3">
                      Commitment to Quality
                    </h3>
                    <p className="text-base leading-relaxed text-ivory/65 font-light">
                      We use imported premium fragrance oils, IFRA-compliant fragrance ingredients, and IFRA-certified premix solvents for safe, consistent perfume blending. Quality is at the heart of every bottle we create.
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Card 2: Crafted for Lasting Performance */}
              <Reveal delay={100}>
                <div className="h-full overflow-hidden rounded-3xl border border-gold-400/10 bg-[#120f0d]/80 p-8 transition-all duration-500 hover:border-gold-400/30 hover:bg-[#120f0d] hover:-translate-y-1.5 flex flex-col justify-between shadow-xl backdrop-blur-sm">
                  <div>
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-300 shadow-[0_0_20px_rgba(212,163,89,0.08)]">
                      <Clock className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-display text-xl text-ivory font-medium mb-3">
                      Lasting Performance
                    </h3>
                    <p className="text-base leading-relaxed text-ivory/65 font-light">
                      Our fragrances provide a rich scent experience. Longevity varies by family and individual skin chemistry. Fresh fragrances last around 4–6 hours, while woody, sweet, amber, and oud fragrances typically last 8–10 hours.
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Card 3: Personally Tested */}
              <Reveal delay={150}>
                <div className="h-full overflow-hidden rounded-3xl border border-gold-400/10 bg-[#120f0d]/80 p-8 transition-all duration-500 hover:border-gold-400/30 hover:bg-[#120f0d] hover:-translate-y-1.5 flex flex-col justify-between shadow-xl backdrop-blur-sm">
                  <div>
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-300 shadow-[0_0_20px_rgba(212,163,89,0.08)]">
                      <FlaskConical className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-display text-xl text-ivory font-medium mb-3">
                      Personally Tested
                    </h3>
                    <p className="text-base leading-relaxed text-ivory/65 font-light">
                      Before launching any fragrance, we personally test multiple samples for scent quality, balance, and performance. Only fragrances that meet our standards become part of the Amairah collection. If we wouldn't wear it, we won't sell it.
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Card 4: Affordable Luxury */}
              <Reveal delay={200}>
                <div className="h-full overflow-hidden rounded-3xl border border-gold-400/10 bg-[#120f0d]/80 p-8 transition-all duration-500 hover:border-gold-400/30 hover:bg-[#120f0d] hover:-translate-y-1.5 flex flex-col justify-between shadow-xl backdrop-blur-sm">
                  <div>
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-300 shadow-[0_0_20px_rgba(212,163,89,0.08)]">
                      <Sparkles className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-display text-xl text-ivory font-medium mb-3">
                      Affordable Luxury
                    </h3>
                    <p className="text-base leading-relaxed text-ivory/65 font-light">
                      Luxury shouldn't come with an expensive price tag. From budget-friendly everyday fragrances to our exclusive Platinum Series, we offer collections that suit every preference and budget without compromising on quality.
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Card 5: Inspired by the World's Finest */}
              <Reveal delay={250}>
                <div className="h-full overflow-hidden rounded-3xl border border-gold-400/10 bg-[#120f0d]/80 p-8 transition-all duration-500 hover:border-gold-400/30 hover:bg-[#120f0d] hover:-translate-y-1.5 flex flex-col justify-between shadow-xl backdrop-blur-sm lg:col-span-2">
                  <div>
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-300 shadow-[0_0_20px_rgba(212,163,89,0.08)]">
                      <Compass className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-display text-xl text-ivory font-medium mb-3">
                      Inspired by the World's Finest Fragrances
                    </h3>
                    <p className="text-base leading-relaxed text-ivory/65 font-light">
                      Our fragrances are inspired by internationally admired scent profiles, allowing customers to enjoy premium fragrance experiences at an affordable price. Our goal is simple: to make luxury-inspired fragrances accessible to everyone.
                    </p>
                  </div>
                </div>
              </Reveal>

            </div>
          </div>
        </section>

        {/* Stats Showcase */}
        <section className="py-12 sm:py-16 relative">
          <div className="mx-auto max-w-wrap px-6 md:px-12">
            <Reveal>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-8 sm:gap-10 md:gap-4 rounded-[2rem] sm:rounded-[2.5rem] border border-gold-400/15 bg-ink-gradient shadow-2xl px-4 sm:px-8 py-10 sm:py-14 md:py-16 text-center relative overflow-hidden backdrop-blur-md">
                
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(202,161,75,0.06),transparent_70%)] pointer-events-none" />

                {STATS.map((stat, idx) => (
                  <div key={stat.label} className="relative group">
                    {idx > 0 && (
                      <div className="hidden sm:block absolute left-0 top-1/4 bottom-1/4 w-[1px] bg-gold-400/10" />
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

        {/* Why Choose Amairah Perfumes */}
        <section className="py-16 sm:py-24 relative bg-ink-soft/20 border-y border-ink-line">
          <div className="mx-auto max-w-wrap px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              
              <div className="lg:col-span-5">
                <Reveal>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-300 mb-4 block">
                    Our Advantages
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-tight text-ivory font-light">
                    Why Choose <br />
                    <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-200 to-gold-400">Amairah Perfumes</span>
                  </h2>
                  <p className="mt-6 text-base sm:text-lg text-ivory/60 leading-relaxed font-light">
                    We combine premium global standards with careful artisanal blending right here in India, ensuring every spray is an experience of premium luxury.
                  </p>
                </Reveal>
              </div>

              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Imported premium fragrance oils",
                    "IFRA-compliant ingredients",
                    "IFRA-certified premix solvents",
                    "Personally tested before launch",
                    "Affordable collections from budget to premium",
                    "Long-lasting fragrance performance",
                    "Fragrances for Men, Women & Unisex",
                    "100% Cruelty-Free",
                  ].map((feature, i) => (
                    <Reveal key={feature} delay={i * 50}>
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-[#120f0d]/60 border border-gold-400/5 hover:border-gold-400/20 transition-all duration-300">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-400/10 text-gold-300">
                          <Check className="w-4.5 h-4.5" strokeWidth={2.5} />
                        </div>
                        <span className="text-sm sm:text-base text-ivory/80 font-light">{feature}</span>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <TestimonialSection testimonials={safeTestimonials} />

        {/* Vision & Cruelty-Free */}
        <section className="py-16 sm:py-24 relative">
          <div className="mx-auto max-w-wrap px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Our Vision */}
              <Reveal>
                <div className="group relative overflow-hidden rounded-[2rem] border border-gold-400/10 bg-[#120f0d]/80 p-8 sm:p-12 transition-all duration-500 hover:border-gold-400/30 hover:bg-[#120f0d] hover:-translate-y-1.5 shadow-xl backdrop-blur-sm flex flex-col justify-between">
                  <Compass className="pointer-events-none absolute bottom-4 right-4 h-24 w-24 text-gold-300/[0.04]" strokeWidth={1} />
                  <div>
                    <span className="mb-2 block font-display text-sm text-gold-400/50 tracking-widest">01</span>
                    <h3 className="font-display text-xl sm:text-2xl text-ivory font-semibold mb-4">Our Vision</h3>
                    <p className="text-base sm:text-lg leading-relaxed text-ivory/70 font-light">
                      To make luxury-inspired fragrances accessible to everyone by combining premium quality, affordability, and exceptional customer satisfaction.
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Cruelty Free */}
              <Reveal delay={100}>
                <div className="group relative overflow-hidden rounded-[2rem] border border-gold-400/10 bg-[#120f0d]/80 p-8 sm:p-12 transition-all duration-500 hover:border-gold-400/30 hover:bg-[#120f0d] hover:-translate-y-1.5 shadow-xl backdrop-blur-sm flex flex-col justify-between">
                  <Heart className="pointer-events-none absolute bottom-4 right-4 h-24 w-24 text-gold-300/[0.04]" strokeWidth={1} />
                  <div>
                    <span className="mb-2 block font-display text-sm text-gold-400/50 tracking-widest">02</span>
                    <h3 className="font-display text-xl sm:text-2xl text-ivory font-semibold mb-4">Cruelty-Free Commitment</h3>
                    <p className="text-base sm:text-lg leading-relaxed text-ivory/70 font-light">
                      We are committed to responsible practices. Our fragrances are 100% cruelty-free and are never tested on animals.
                    </p>
                  </div>
                </div>
              </Reveal>

            </div>
          </div>
        </section>

        {/* Our Promise (Large Quote / Callout Section) */}
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
                  <Quote className="w-9 h-9 text-gold-300/70" />
                </div>
                
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-300 mb-3 block">
                  Our Promise
                </span>
                
                <p className="font-display text-2xl sm:text-3xl md:text-4xl italic text-gold-100 leading-relaxed mb-8 max-w-xl font-light">
                  &ldquo;Every bottle reflects our passion for quality, affordability, and helping you discover a fragrance you'll truly love.&rdquo;
                </p>

                <div className="h-[1px] w-12 bg-gold-400/50 mb-4" />
                <span className="text-sm uppercase tracking-widest text-gold-300 font-semibold">
                  Amairah Perfumes
                </span>
                <span className="text-xs text-ivory/40 mt-1 font-light tracking-wide">
                  Inspired by Luxury. Crafted for Everyone.
                </span>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                  <Link href="/shop" className="btn-gold px-9 py-4 text-sm font-semibold hover:scale-[1.03] transition-transform shadow-[0_4px_20px_rgba(212,163,89,0.15)] hover:shadow-[0_4px_25px_rgba(212,163,89,0.3)]">
                    Shop Perfumes
                  </Link>
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

