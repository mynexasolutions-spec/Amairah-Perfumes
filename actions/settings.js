"use server";

import { unstable_cache, revalidateTag } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

// Default settings (fallback if table doesn't exist, and to backfill any
// keys that don't have a row in the DB yet).
const DEFAULT_SETTINGS = {
  brand_name: { value: "Amairah Perfumes", category: "brand", description: "Brand name" },
  tagline: { value: "Perfumes & Attar, Poured With Intention", category: "brand", description: "Brand tagline" },
  email: { value: "amairahperfumes@gmail.com", category: "contact", description: "Business email" },
  whatsapp_number: { value: "917801087892", category: "contact", description: "WhatsApp number (with country code, no spaces)" },
  whatsapp_display: { value: "+91 78010 87892", category: "contact", description: "WhatsApp display format" },
  instagram_url: { value: "https://www.instagram.com/amairahperfumes?igsh=aXN3bGZkNGRvMWhr", category: "social", description: "Instagram profile URL" },
  facebook_url: { value: "https://www.facebook.com/share/17AQCM2Ky8/", category: "social", description: "Facebook profile URL" },
  youtube_url: { value: "https://youtube.com/@amairahperfume?si=eam58mXbBCLRtCHm", category: "social", description: "YouTube channel URL" },
  cod_enabled: { value: "true", category: "payment", description: "Allow Cash on Delivery at checkout" },
  online_payment_enabled: { value: "true", category: "payment", description: "Allow online payment (Razorpay) at checkout" },

  home_hero_badge_text: { value: "Amairah Perfumes", category: "home_hero", description: "Hero — badge text above the title" },
  home_hero_rating_value: { value: "4.9", category: "home_hero", description: "Hero — star rating (e.g. 4.9)" },
  home_hero_reviews_text: { value: "500+ Reviews", category: "home_hero", description: "Hero — reviews text shown next to the rating" },
  home_hero_shipped_text: { value: "10k+ Bottles Shipped Pan-India", category: "home_hero", description: "Hero — bottles shipped stat" },
  home_hero_enabled: { value: "true", category: "home_hero", description: "Show the hero banner on the homepage" },

  home_choose_subtitle: {
    value: "Finding a perfume that matches your personality matters. This guide helps you choose the one that's really you.",
    category: "home_sections",
    description: "Find the Perfect Scent — subtitle",
  },
  home_choose_image: { value: "/find_perfect.png", category: "home_sections", description: "Find the Perfect Scent — image" },
  home_choose_enabled: { value: "true", category: "home_sections", description: "Show the Find the Perfect Scent section on the homepage" },

  home_choose_option1_title: { value: "For Every Day", category: "home_sections", description: "Find the Perfect Scent — option 1 title" },
  home_choose_option1_desc: {
    value: "Light and fresh scents that you can wear from morning to evening. Very easy to wear and love.",
    category: "home_sections",
    description: "Find the Perfect Scent — option 1 description",
  },
  home_choose_option2_title: { value: "For Special Occasions", category: "home_sections", description: "Find the Perfect Scent — option 2 title" },
  home_choose_option2_desc: {
    value: "Rich and strong scents that make you stand out. A perfume that people will remember even after you leave.",
    category: "home_sections",
    description: "Find the Perfect Scent — option 2 description",
  },
  home_choose_option3_title: { value: "Universal", category: "home_sections", description: "Find the Perfect Scent — option 3 title" },
  home_choose_option3_desc: {
    value: "Balanced scents that smell great in any season, any mood, and suit almost everyone.",
    category: "home_sections",
    description: "Find the Perfect Scent — option 3 description",
  },

  home_choose_unsure_title: { value: "Still Unsure?", category: "home_sections", description: "Find the Perfect Scent — consultation card heading" },
  home_choose_unsure_text: {
    value: "Just place your order, try it on your skin, and see for yourself why it's worth it.",
    category: "home_sections",
    description: "Find the Perfect Scent — consultation card text",
  },
  home_choose_unsure_button: { value: "Order Now", category: "home_sections", description: "Find the Perfect Scent — consultation card button text" },

  home_journey_line1: { value: "Starts Gentle", category: "home_sections", description: "The Fragrance Journey — line 1" },
  home_journey_line2: { value: "Grows Bold", category: "home_sections", description: "The Fragrance Journey — line 2" },
  home_journey_line3: { value: "Lasts Forever", category: "home_sections", description: "The Fragrance Journey — line 3" },
  home_journey_label1: { value: "Top Notes", category: "home_sections", description: "The Fragrance Journey — label under line 1" },
  home_journey_label2: { value: "Heart Notes", category: "home_sections", description: "The Fragrance Journey — label under line 2" },
  home_journey_label3: { value: "Base Notes", category: "home_sections", description: "The Fragrance Journey — label under line 3" },
  home_journey_image: { value: "/luxury_ad_banner.png", category: "home_sections", description: "The Fragrance Journey — image" },
  home_journey_enabled: { value: "true", category: "home_sections", description: "Show the Fragrance Journey section on the homepage" },

  home_limited_subtitle: {
    value: "These are small, special batches. Only a few bottles are made, and once they're gone, we never make them again.",
    category: "home_sections",
    description: "Limited Edition — subtitle",
  },
  home_limited_heading_line1: { value: "Rare Scents,", category: "home_sections", description: "Limited Edition — heading line 1" },
  home_limited_heading_line2: { value: "Made Only Once", category: "home_sections", description: "Limited Edition — heading line 2 (highlighted in gold)" },
  home_limited_button_text: { value: "Shop Limited Edition", category: "home_sections", description: "Limited Edition — button text" },
  home_limited_image: { value: "/3bottles_perfumes.png", category: "home_sections", description: "Limited Edition — image" },
  home_limited_enabled: { value: "true", category: "home_sections", description: "Show the Limited Edition section on the homepage" },

  home_testimonials_subtitle: {
    value: "Real experiences from real customers, in their own words.",
    category: "home_sections",
    description: "What Our Customers Say — subtitle",
  },
  home_testimonials_enabled: { value: "true", category: "home_sections", description: "Show the Testimonials section on the homepage" },

  home_faq_subtitle: {
    value: "Everything you need to know before you order.",
    category: "home_sections",
    description: "Questions You Might Have — subtitle",
  },
  home_faq_image: { value: "/FaqPerfume.png", category: "home_sections", description: "Questions You Might Have — image" },
  home_faq_enabled: { value: "true", category: "home_sections", description: "Show the FAQ section on the homepage" },

  home_faq_q1: { value: "What is the difference between attar and perfume?", category: "home_sections", description: "FAQ 1 — question" },
  home_faq_a1: {
    value: "Attar is pure oil and has no alcohol. It sits close to your skin and lasts up to 24 hours. Perfume has alcohol, sprays easily, and spreads in the air quickly. We sell both.",
    category: "home_sections",
    description: "FAQ 1 — answer",
  },
  home_faq_q2: { value: "How long does one bottle last?", category: "home_sections", description: "FAQ 2 — question" },
  home_faq_a2: {
    value: "Attars are very strong. A small 6ml bottle lasts for 60 to 90 uses since you only need a few drops. Our spray perfumes last for 400 to 600 sprays.",
    category: "home_sections",
    description: "FAQ 2 — answer",
  },
  home_faq_q3: { value: "Do you ship across India?", category: "home_sections", description: "FAQ 3 — question" },
  home_faq_a3: {
    value: "Yes, we ship all over India. We pack your order in 1 to 2 days. Delivery usually takes 3 to 6 days depending on your city.",
    category: "home_sections",
    description: "FAQ 3 — answer",
  },
  home_faq_q4: { value: "Can I return my order?", category: "home_sections", description: "FAQ 4 — question" },
  home_faq_a4: {
    value: "For hygiene reasons, we cannot accept returns on opened bottles. If your bottle arrives broken or damaged, we will replace it for free. Just message us on WhatsApp with a photo.",
    category: "home_sections",
    description: "FAQ 4 — answer",
  },

  home_marquee_items: {
    value:
      "*Extrait-Grade Concentration\nHand-Poured in Small Batches\n100% Cruelty-Free\n*Pan-India Shipping\nCash on Delivery Available\n*Alcohol-Free Attars",
    category: "home_sections",
    description: "Marquee Strip — one item per line, start a line with * to highlight it in gold",
  },
  home_marquee_enabled: { value: "true", category: "home_sections", description: "Show the Marquee Strip on the homepage" },
};

const getSiteSettingsCached = unstable_cache(
  async () => {
    try {
      // Uses the service-role client (not createPublicClient) because the
      // "site_settings public read" RLS policy isn't reliably present on
      // every environment — this table has no sensitive data, so bypassing
      // RLS for this read-only, unstable_cache'd fetch is safe.
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value, category, description")
        .order("category", { ascending: true });

      if (error) {
        console.warn("Site settings table not found or error reading, using defaults:", error.message);
        return DEFAULT_SETTINGS;
      }

      const settings = {};
      (data || []).forEach((item) => {
        settings[item.key] = {
          value: item.value,
          category: item.category,
          description: item.description,
        };
      });

      // Backfill any keys that don't have a DB row yet (e.g. newly added
      // settings on an existing install) so they still show up with a
      // sensible default until an admin explicitly saves them.
      Object.entries(DEFAULT_SETTINGS).forEach(([key, meta]) => {
        if (!settings[key]) settings[key] = meta;
      });

      return settings;
    } catch (err) {
      console.error("Error fetching site settings:", err?.message || err);
      return DEFAULT_SETTINGS;
    }
  },
  ["site-settings"],
  { revalidate: 120, tags: ["site-settings"] }
);

export async function getSiteSettings() {
  return getSiteSettingsCached();
}

export async function isCodEnabled() {
  const settings = await getSiteSettings();
  return settings.cod_enabled?.value !== "false";
}

export async function isOnlinePaymentEnabled() {
  const settings = await getSiteSettings();
  return settings.online_payment_enabled?.value !== "false";
}

export async function updateSiteSetting(key, value) {
  try {
    const supabase = createAdminClient();
    const meta = DEFAULT_SETTINGS[key];
    const payload = { key, value, updated_at: new Date().toISOString() };
    if (meta) {
      payload.category = meta.category;
      payload.description = meta.description;
    }

    const { error } = await supabase.from("site_settings").upsert(payload, { onConflict: "key" });

    if (error) throw error;
    revalidateTag("site-settings");
    return { success: true };
  } catch (err) {
    console.error("Update site setting error:", err);
    return { success: false, error: err.message };
  }
}
