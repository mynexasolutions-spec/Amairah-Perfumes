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

export const BUNDLE_DEFAULTS = {
  enabled: false,
  bottle_count: 4,
  fixed_price: null,
  title: "Build Your Own Bundle",
  subtitle: "Pick any 4 bottles and create your own set.",
  banner_image_url: null,
};

// Bundle items are added to the cart at their own catalog price, tagged
// with a shared bundleGroupId. If a group's total quantity matches the
// configured bottle_count exactly, its total collapses to fixed_price —
// this returns the rupee discount that represents, summed across any
// complete bundle groups in the cart. Shared between server (order totals)
// and client (cart/checkout display) so both always agree.
export function calculateBundleDiscount(items, bundleSettings) {
  if (!bundleSettings?.enabled || !bundleSettings?.fixed_price || !items?.length) return 0;

  const groups = {};
  for (const item of items) {
    if (!item.bundleGroupId) continue;
    if (!groups[item.bundleGroupId]) groups[item.bundleGroupId] = [];
    groups[item.bundleGroupId].push(item);
  }

  let discount = 0;
  for (const groupItems of Object.values(groups)) {
    const totalQty = groupItems.reduce((sum, i) => sum + i.quantity, 0);
    if (totalQty !== bundleSettings.bottle_count) continue;
    const naturalSum = groupItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    discount += Math.max(0, naturalSum - bundleSettings.fixed_price);
  }
  return discount;
}

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
