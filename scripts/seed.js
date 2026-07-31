// One-off demo data seeder. Run after applying schema.sql in the Supabase
// SQL Editor: `npm run seed`. Safe to re-run — skips categories/products
// that already exist (matched by slug).
const { createClient } = require("@supabase/supabase-js");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment.");
  console.error("Run with: node --env-file=.env scripts/seed.js");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

const CATEGORIES = [
  {
    name: "Attar",
    slug: "attar",
    description: "Alcohol-free, oil-based fragrance concentrates, hand-blended the traditional way.",
    sort_order: 0,
  },
  {
    name: "Extrait de Parfum",
    slug: "extrait-de-parfum",
    description: "Our richest, longest-lasting concentration.",
    sort_order: 1,
  },
  {
    name: "Eau de Parfum",
    slug: "eau-de-parfum",
    description: "Balanced concentration for everyday wear.",
    sort_order: 2,
  },
  {
    name: "Gift Sets",
    slug: "gift-sets",
    description: "Curated fragrance sets, ready to gift.",
    sort_order: 3,
  },
];

const PRODUCTS = [
  {
    name: "Oudh Mustaqeem Attar",
    concentration: "Attar",
    gender: "Unisex",
    categorySlug: "attar",
    badge: "Bestseller",
    short_description: "Deep, resinous oudh softened with rose and a whisper of saffron.",
    description:
      "Oudh Mustaqeem opens with a smoky, resinous oudh accord, softened almost immediately by Taif rose and a trace of saffron. As it settles, warm amber and musk carry the scent for hours without becoming heavy. Hand-poured in small batches and rested for three weeks before bottling.",
    notes_top: "Saffron, Bergamot",
    notes_middle: "Taif Rose, Oudh",
    notes_base: "Amber, White Musk",
    is_featured: true,
    variants: [
      { variant_name: "6ml", price: 899, original_price: 1099, stock_quantity: 40 },
      { variant_name: "12ml", price: 1599, original_price: 1899, stock_quantity: 25 },
    ],
    faqs: [
      { question: "Is this attar alcohol-free?", answer: "Yes — all Amairah attars are oil-based and contain no alcohol." },
    ],
  },
  {
    name: "Rose Ta'if Attar",
    concentration: "Attar",
    gender: "Her",
    categorySlug: "attar",
    badge: "New",
    short_description: "A true rose attar — bright, dewy, and unmistakably floral.",
    description:
      "Distilled with an emphasis on fresh-cut Ta'if roses, this attar stays close to skin with a soft, powdery drydown. A single dab on the wrist lasts a full day.",
    notes_top: "Rose Petals",
    notes_middle: "Geranium",
    notes_base: "Soft Musk",
    is_featured: true,
    variants: [
      { variant_name: "3ml", price: 549, original_price: null, stock_quantity: 50 },
      { variant_name: "6ml", price: 949, original_price: null, stock_quantity: 30 },
    ],
    faqs: [],
  },
  {
    name: "Amber Noir Extrait",
    concentration: "Extrait de Parfum",
    gender: "Him",
    categorySlug: "extrait-de-parfum",
    badge: "Signature",
    short_description: "Dark amber, tobacco leaf, and a dry woody finish.",
    description:
      "Amber Noir is built at extrait concentration for maximum richness — dark amber and tobacco leaf over a bed of dry cedar and vetiver. Projects close, lasts all day, and deepens beautifully on warm skin.",
    notes_top: "Black Pepper, Bergamot",
    notes_middle: "Tobacco Leaf, Amber",
    notes_base: "Cedar, Vetiver",
    is_featured: true,
    variants: [
      { variant_name: "25ml", price: 1799, original_price: 2199, stock_quantity: 20 },
      { variant_name: "50ml", price: 2999, original_price: 3599, stock_quantity: 12 },
    ],
    faqs: [
      { question: "How long does this last on skin?", answer: "Most wearers report 8-10 hours of wear from two sprays, thanks to the extrait concentration." },
    ],
  },
  {
    name: "Jasmine Silk EDP",
    concentration: "Eau de Parfum",
    gender: "Her",
    categorySlug: "eau-de-parfum",
    badge: null,
    short_description: "Creamy jasmine layered over soft sandalwood.",
    description:
      "A luminous jasmine bouquet — indolic but never overpowering — resting on creamy sandalwood and a touch of vanilla. Ideal for daytime wear that still carries some depth into the evening.",
    notes_top: "Mandarin, Pear",
    notes_middle: "Jasmine Sambac",
    notes_base: "Sandalwood, Vanilla",
    is_featured: false,
    variants: [
      { variant_name: "50ml", price: 1499, original_price: null, stock_quantity: 35 },
      { variant_name: "100ml", price: 2399, original_price: 2799, stock_quantity: 18 },
    ],
    faqs: [],
  },
  {
    name: "Vetiver Racines EDP",
    concentration: "Eau de Parfum",
    gender: "Him",
    categorySlug: "eau-de-parfum",
    badge: "Bestseller",
    short_description: "Earthy vetiver root with citrus lift and a clean musk finish.",
    description:
      "Vetiver Racines leads with raw, earthy vetiver root, brightened by grapefruit and lime, and finished with a clean white musk that keeps it wearable in any season.",
    notes_top: "Grapefruit, Lime",
    notes_middle: "Vetiver Root",
    notes_base: "White Musk, Oakmoss",
    is_featured: true,
    variants: [
      { variant_name: "50ml", price: 1699, original_price: null, stock_quantity: 28 },
      { variant_name: "100ml", price: 2599, original_price: 2999, stock_quantity: 15 },
    ],
    faqs: [],
  },
  {
    name: "Amairah Discovery Gift Set",
    concentration: "Extrait de Parfum",
    gender: "Unisex",
    categorySlug: "gift-sets",
    badge: "Limited",
    short_description: "Four signature attars in 3ml travel bottles, boxed for gifting.",
    description:
      "A curated introduction to Amairah — four of our most-loved attars in 3ml bottles, presented in a keepsake box. The easiest way to find a new signature scent, or to gift one.",
    notes_top: null,
    notes_middle: null,
    notes_base: null,
    is_featured: true,
    variants: [{ variant_name: "4 x 3ml Set", price: 1999, original_price: 2399, stock_quantity: 22 }],
    faqs: [
      { question: "Can I choose which four scents are included?", answer: "The Discovery Set ships with our current curator's picks. Message us on WhatsApp if you'd like to customize it." },
    ],
  },
];

async function upsertCategories() {
  const map = {};
  for (const cat of CATEGORIES) {
    const { data: existing } = await supabase.from("categories").select("id").eq("slug", cat.slug).maybeSingle();
    if (existing) {
      map[cat.slug] = existing.id;
      continue;
    }
    const { data, error } = await supabase.from("categories").insert(cat).select("id").single();
    if (error) throw error;
    map[cat.slug] = data.id;
    console.log(`Created category: ${cat.name}`);
  }
  return map;
}

async function upsertProducts(categoryMap) {
  for (const p of PRODUCTS) {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const { data: existing } = await supabase.from("products").select("id").eq("slug", slug).maybeSingle();
    if (existing) {
      console.log(`Skipped existing product: ${p.name}`);
      continue;
    }

    const { data: product, error } = await supabase
      .from("products")
      .insert({
        name: p.name,
        slug,
        category_id: categoryMap[p.categorySlug] || null,
        concentration: p.concentration,
        gender: p.gender,
        badge: p.badge,
        short_description: p.short_description,
        description: p.description,
        notes_top: p.notes_top,
        notes_middle: p.notes_middle,
        notes_base: p.notes_base,
        is_active: true,
        is_featured: p.is_featured,
      })
      .select("id")
      .single();

    if (error) throw error;

    await supabase.from("product_variants").insert(
      p.variants.map((v) => ({ product_id: product.id, ...v }))
    );
    if (p.faqs.length) {
      await supabase.from("product_faqs").insert(
        p.faqs.map((f, i) => ({ product_id: product.id, ...f, display_order: i }))
      );
    }

    console.log(`Created product: ${p.name}`);
  }
}

async function seedAnnouncement() {
  const { data } = await supabase.from("announcements").select("id").limit(1);
  if (data && data.length > 0) return;
  await supabase.from("announcements").insert({
    message: "Free shipping on prepaid orders above ₹1,499 — pan-India delivery",
    is_active: true,
  });
  console.log("Created a default announcement.");
}

async function main() {
  console.log("Seeding Amairah Perfumes demo data...");
  const categoryMap = await upsertCategories();
  await upsertProducts(categoryMap);
  await seedAnnouncement();
  console.log("Done.");
}

main().catch((err) => {
  console.error("Seed failed:", err.message || err);
  process.exit(1);
});
