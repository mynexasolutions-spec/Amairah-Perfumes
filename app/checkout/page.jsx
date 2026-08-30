import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import CheckoutForm from "./_components/CheckoutForm";
import { isRazorpayEnabled } from "@/actions/checkout";
import { getShippingSettings } from "@/actions/admin/shipping";
import { getQuantityDiscountSettings } from "@/actions/admin/quantityDiscount";
import { getBundleSettings } from "@/actions/bundle";
import { isCodEnabled, isOnlinePaymentEnabled } from "@/actions/settings";
import { ShieldCheck } from "lucide-react";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const [razorpayConfigured, shipping, quantityDiscount, bundleSettings, codEnabled, onlinePaymentEnabled] = await Promise.all([
    isRazorpayEnabled(),
    getShippingSettings(),
    getQuantityDiscountSettings(),
    getBundleSettings(),
    isCodEnabled(),
    isOnlinePaymentEnabled(),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-hidden bg-[#0b0a0a] pb-28 pt-20">
        {/* Decorative background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[5%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gold-500/5 blur-[120px]" />
          <div className="absolute top-[35%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gold-400/5 blur-[150px]" />
          <div className="absolute bottom-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-gold-600/5 blur-[130px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-12 border-b border-gold-400/10 pb-8 text-center sm:text-left">
            <span className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-gold-400/20 bg-ink-soft/80 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-200 backdrop-blur-md mb-6">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-300" />
              Safe &amp; Encrypted
            </span>
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-light leading-[1.05] text-ivory">
              Secure{" "}
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400">
                Checkout
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-ivory/60 font-light max-w-xl mx-auto sm:mx-0">
              Complete your details below to place your order — we'll confirm everything with you on WhatsApp.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <CheckoutForm
              codEnabled={codEnabled}
              razorpayEnabled={razorpayConfigured && onlinePaymentEnabled}
              shipping={shipping}
              quantityDiscount={quantityDiscount}
              bundleSettings={bundleSettings}
            />
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
