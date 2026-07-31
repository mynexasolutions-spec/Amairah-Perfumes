import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";

export default function PolicyLayout({ title, updated, icon: Icon = FileText, children }) {
  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-hidden bg-[#0b0a0a] pb-24 pt-14 sm:pt-20">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50">
          <div className="absolute left-[10%] top-0 h-[350px] w-[400px] rounded-full bg-gold-500/10 blur-[130px]" />
          <div className="absolute right-[8%] bottom-0 h-[350px] w-[400px] rounded-full bg-gold-300/10 blur-[130px]" />
          <div className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-gold-400/5 blur-[140px]" />
        </div>

        <div className="relative mx-auto max-w-2xl px-5 md:px-8">
          <div className="text-center">
            <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-200 shadow-[0_15px_40px_-24px_rgba(202,161,75,0.4)]">
              <Icon className="h-6 w-6" strokeWidth={1.5} />
            </span>
            <p className="eyebrow justify-center">
              <span className="gold-line" /> Legal <span className="gold-line" />
            </p>
            <h1 className="section-heading mt-4">{title}</h1>
            <span className="mt-4 inline-flex items-center rounded-full border border-gold-400/20 bg-ink-soft/60 px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-ivory/45">
              Last updated {updated}
            </span>
          </div>

          <div className="group relative mt-12 overflow-hidden rounded-[2rem] border border-ink-line bg-gradient-to-b from-ink-soft/50 to-ink-soft/10 p-8 shadow-xl backdrop-blur-sm transition-colors duration-500 hover:border-gold-400/20 sm:p-10">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-300/60 to-transparent"
            />
            <div className="space-y-5 text-base leading-relaxed text-ivory/65 [&_h2]:mt-9 [&_h2:first-child]:mt-0">
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
