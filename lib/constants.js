// Fallback brand constants (used if DB settings unavailable)
const BRAND_DEFAULTS = {
  name: "Amairah Perfumes",
  tagline: "Perfumes & Attar, Poured With Intention",
  email: "amairahperfumes@gmail.com",
  whatsappNumber: "917801087892",
  whatsappDisplay: "+91 78010 87892",
  instagram: "https://www.instagram.com/amairahperfumes?igsh=aXN3bGZkNGRvMWhr",
  facebook: "https://www.facebook.com/share/17AQCM2Ky8/",
  youtube: "https://youtube.com/@amairahperfume?si=eam58mXbBCLRtCHm",
};

export const BRAND = BRAND_DEFAULTS;

// Helper to convert DB settings to BRAND object
export function settingsToBrand(dbSettings) {
  if (!dbSettings) return BRAND;
  return {
    name: dbSettings.brand_name?.value || BRAND_DEFAULTS.name,
    tagline: dbSettings.tagline?.value || BRAND_DEFAULTS.tagline,
    email: dbSettings.email?.value || BRAND_DEFAULTS.email,
    whatsappNumber: dbSettings.whatsapp_number?.value || BRAND_DEFAULTS.whatsappNumber,
    whatsappDisplay: dbSettings.whatsapp_display?.value || BRAND_DEFAULTS.whatsappDisplay,
    instagram: dbSettings.instagram_url?.value || BRAND_DEFAULTS.instagram,
    facebook: dbSettings.facebook_url?.value || BRAND_DEFAULTS.facebook,
    youtube: dbSettings.youtube_url?.value || BRAND_DEFAULTS.youtube,
  };
}

export function whatsappLink(message, brandInfo = BRAND) {
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${brandInfo.whatsappNumber}${text}`;
}

export const GENDERS = ["Unisex", "Him", "Her"];

export const SHIPPING_DEFAULTS = {
  flat_rate: 79,
  free_threshold: 1499,
  cod_charge: 40,
};

// Used when a product variant hasn't had weight_grams filled in yet, and as
// the default parcel dimensions offered (editable) in the admin's India
// Post booking panel — a small padded box big enough for a perfume bottle.
export const DEFAULT_PACKAGE = {
  itemWeightGrams: 150,
  packagingOverheadGrams: 50,
  lengthCm: 12,
  breadthCm: 9,
  heightCm: 6,
};

export const QUANTITY_DISCOUNT_DEFAULTS = {
  enabled: true,
  tiers: [
    { min_quantity: 1, discount: 0 },
    { min_quantity: 2, discount: 40 },
    { min_quantity: 3, discount: 70 },
    { min_quantity: 4, discount: 100 },
    { min_quantity: 5, discount: 120 },
  ],
};

// Given the total item quantity in a cart, returns the flat rupee discount
// that applies — the highest tier whose min_quantity the cart qualifies for.
// Shared between the server (order totals) and client (cart/checkout display)
// so both always agree on the same number.
export function calculateQuantityDiscount(totalQuantity, quantityDiscount) {
  if (!quantityDiscount?.enabled || !quantityDiscount?.tiers?.length || totalQuantity <= 0) {
    return 0;
  }
  const sorted = [...quantityDiscount.tiers].sort((a, b) => a.min_quantity - b.min_quantity);
  let discount = 0;
  for (const tier of sorted) {
    if (totalQuantity >= tier.min_quantity) discount = tier.discount;
  }
  return discount;
}
