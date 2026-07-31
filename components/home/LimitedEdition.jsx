import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function LimitedEdition({
  subtitle = "These are small, special batches. Only a few bottles are made, and once they're gone, we never make them again.",
  headingLine1 = "Rare Scents,",
  headingLine2 = "Made Only Once",
  buttonText = "Shop Limited Edition",
  image = "/3bottles_perfumes.png",
  showImage = true,
}) {
  return (
    <section className="relative w-full overflow-hidden border-t border-ink-line bg-[#0b0a0a] py-16 sm:py-24">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60">
        <div className="absolute left-[6%] top-0 h-[400px] w-[450px] rounded-full bg-gold-500/10 blur-[130px]" />
        <div className="absolute right-[8%] bottom-0 h-[400px] w-[450px] rounded-full bg-gold-300/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-wrap px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Bottle Showcase (6 cols) */}
          {showImage && (
            <div className="lg:col-span-6 relative flex flex-col items-center justify-center min-h-[340px] sm:min-h-[440px]">

              {/* Ambient Background Glow */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[520px] h-[280px] sm:h-[380px] rounded-full bg-[radial-gradient(circle,rgba(202,161,75,0.12),transparent_70%)] blur-[45px] pointer-events-none z-0" />

              <div className="relative z-10 aspect-square w-full">
                <Image
                  src={image}
                  alt="Amairah Perfumes limited edition bottles"
                  fill
                  sizes="(max-width: 1024px) 95vw, 45vw"
                  className="object-contain"
                />
              </div>

            </div>
          )}

          {/* Right Column: Information Copy */}
          <div className={`flex flex-col justify-center ${showImage ? "lg:col-span-6" : "lg:col-span-12 items-center text-center"}`}>
            <Reveal>
              <p className="eyebrow">
                <span className="gold-line" /> Limited Edition
              </p>

              <h2 className="mb-6 mt-4 font-display text-3xl font-medium leading-[1.1] text-ivory sm:text-4xl md:text-5xl lg:text-6xl">
                {headingLine1} <br />
                <span className="bg-gradient-to-r from-gold-100 to-gold-400 bg-clip-text font-semibold text-transparent">
                  {headingLine2}
                </span>
              </h2>

              <p className="mb-8 max-w-md text-base font-light leading-relaxed text-ivory/60 sm:text-lg lg:text-xl">
                {subtitle}
              </p>

              <Link
                href="/shop"
                className="btn-gold w-fit px-8 py-4 text-sm font-medium transition-transform hover:scale-[1.02]"
              >
                {buttonText}
              </Link>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
}
