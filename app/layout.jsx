import { Plus_Jakarta_Sans, Jost } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import CartDrawer from "@/components/CartDrawer";
import { BRAND } from "@/lib/constants";
import { getQuantityDiscountSettings } from "@/actions/admin/quantityDiscount";
import { getBundleSettings } from "@/actions/bundle";
import Script from "next/script";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: `${BRAND.name} — Perfumes & Attar`,
    template: `%s — ${BRAND.name}`,
  },
  description:
    "Hand-poured attars and fine fragrances crafted in small batches — extrait-grade oils, alcohol-free options, made to last.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default async function RootLayout({ children }) {
  const [quantityDiscount, bundleSettings] = await Promise.all([getQuantityDiscountSettings(), getBundleSettings()]);

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3B35X4N265"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-3B35X4N265');
          `}
        </Script>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1360650602156932');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1360650602156932&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body suppressHydrationWarning>
        <ToastProvider>
          <CartProvider>
            {children}
            <CartDrawer quantityDiscount={quantityDiscount} bundleSettings={bundleSettings} />
            <FloatingWhatsApp />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
