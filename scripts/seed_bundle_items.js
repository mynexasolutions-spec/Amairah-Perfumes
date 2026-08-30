// One-off: adds 5 sample bundle products (no image) directly, mirroring
// what actions/admin/bundle.js's addBundleItem() does — products +
// product_variants + bundle_items rows, show_in_shop: false.
// Run with: node --env-file=.env scripts/seed_bundle_items.js
const { createClient } = require("@supabase/supabase-js");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const SAMPLE_ITEMS = [
  { name: "Sample Oudh Mini", variant_name: "6ml", price: 249 },
  { name: "Sample Rose Attar", variant_name: "6ml", price: 249 },
  { name: "Sample Musk Silk", variant_name: "6ml", price: 249 },
  { name: "Sample Amber Bloom", variant_name: "6ml", price: 249 },
  { name: "Sample Saffron Nights", variant_name: "6ml", price: 249 },
];

async function main() {
  const { data: existingMax } = await supabase
    .from("bundle_items")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  let nextSortOrder = (existingMax?.sort_order ?? -1) + 1;

  for (const item of SAMPLE_ITEMS) {
    const slug = `${slugify(item.name)}-bundle-${Date.now().toString(36).slice(-5)}-${nextSortOrder}`;

    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({ name: item.name, slug, featured_image_url: null, is_active: true, show_in_shop: false })
      .select("id")
      .single();
    if (productError || !product) {
      console.error(`Failed to create product "${item.name}":`, productError?.message);
      continue;
    }

    const { data: variant, error: variantError } = await supabase
      .from("product_variants")
      .insert({ product_id: product.id, variant_name: item.variant_name, price: item.price, stock_quantity: 50, is_active: true })
      .select("id")
      .single();
    if (variantError || !variant) {
      console.error(`Failed to create variant for "${item.name}":`, variantError?.message);
      await supabase.from("products").delete().eq("id", product.id);
      continue;
    }

    const { error: bundleItemError } = await supabase
      .from("bundle_items")
      .insert({ product_id: product.id, variant_id: variant.id, sort_order: nextSortOrder });
    if (bundleItemError) {
      console.error(`Failed to link bundle item "${item.name}":`, bundleItemError.message);
      await supabase.from("products").delete().eq("id", product.id);
      continue;
    }

    console.log(`Added "${item.name}" (${item.variant_name}, ₹${item.price})`);
    nextSortOrder += 1;
  }

  console.log("Done.");
}

main();
