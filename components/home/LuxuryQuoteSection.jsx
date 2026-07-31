import Image from "next/image";
import Reveal from "@/components/Reveal";

export default function LuxuryQuoteSection({
  line1 = "Starts Gentle",
  line2 = "Grows Bold",
  line3 = "Lasts Forever",
  label1 = "Top Notes",
  label2 = "Heart Notes",
  label3 = "Base Notes",
  image = "/luxury_ad_banner.png",
  showImage = true,
}) {
  return (
    <section className="relative w-full overflow-hidden border-y border-ink-line bg-[#0b0a0a]">
      <div className="grid min-h-[560px] grid-cols-1 items-stretch lg:min-h-[640px] lg:grid-cols-12">

        {/* Left: Full-bleed Image */}
        {showImage && (
          <div className="relative min-h-[300px] sm:min-h-[380px] lg:col-span-7 lg:min-h-0">
            <Image
              src={image}
              alt="Amairah Perfumes Muse"
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="scale-100 object-cover object-center transition-transform duration-[1400ms] ease-out hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-ink" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-90 lg:opacity-70" />
          </div>
        )}

        {/* Right: Text Content */}
        <div
          className={`relative flex flex-col items-center justify-center bg-ink px-6 py-12 text-center sm:px-8 sm:py-16 lg:px-16 lg:py-20 ${
            showImage ? "lg:col-span-5" : "lg:col-span-12"
          }`}
        >

          {/* Ambient glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(202,161,75,0.05),transparent_70%)]" />
          <div className="pointer-events-none absolute right-[-10%] top-[10%] h-[300px] w-[300px] rounded-full bg-gold-400/5 blur-[110px]" />

          <Reveal className="relative z-10 mx-auto flex max-w-md flex-col items-center">

            <p className="eyebrow justify-center">
              <span className="gold-line" /> The Fragrance Journey <span className="gold-line" />
            </p>

            <div className="mt-6 space-y-6 font-display sm:mt-10 sm:space-y-9">
              <div>
                <p className="text-2xl font-semibold leading-tight tracking-wide text-gold-100 sm:text-3xl md:text-4xl">
                  {line1}
                </p>
                <span className="mt-2 block font-sans text-[10px] uppercase tracking-[0.28em] text-ivory/40 sm:text-[11px]">
                  {label1}
                </span>
              </div>

              <div className="mx-auto h-px w-10 bg-gradient-to-r from-transparent via-gold-300/50 to-transparent" />

              <div>
                <p className="text-2xl font-semibold leading-tight tracking-wide text-gold-200 sm:text-3xl md:text-4xl">
                  {line2}
                </p>
                <span className="mt-2 block font-sans text-[10px] uppercase tracking-[0.28em] text-ivory/40 sm:text-[11px]">
                  {label2}
                </span>
              </div>

              <div className="mx-auto h-px w-10 bg-gradient-to-r from-transparent via-gold-300/50 to-transparent" />

              <div>
                <p className="bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400 bg-clip-text text-2xl font-bold leading-tight tracking-wide text-transparent sm:text-3xl md:text-4xl">
                  {line3}
                </p>
                <span className="mt-2 block font-sans text-[10px] uppercase tracking-[0.28em] text-gold-300/60 sm:text-[11px]">
                  {label3}
                </span>
              </div>
            </div>

          </Reveal>

        </div>

      </div>
    </section>
  );
}
