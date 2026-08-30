"use server";

import { createPublicClient } from "@/lib/supabase/public";
import { BUNDLE_DEFAULTS } from "@/lib/constants";

export async function getBundleSettings() {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase.from("settings").select("bundle").eq("id", 1).maybeSingle();
    return data?.bundle || BUNDLE_DEFAULTS;
  } catch (err) {
    console.error("Fetch bundle settings error:", err);
    return BUNDLE_DEFAULTS;
  }
}

export async function getBundleEligibleProducts() {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("bundle_items")
      .select(
        `
        id, sort_order,
        products ( id, name, slug, short_description, featured_image_url, is_active, product_images ( image_url, sort_order ) ),
        product_variants ( id, variant_name, price, original_price, stock_quantity, is_active )
      `
      )
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (!data) return [];

    return data
      .filter((row) => row.products?.is_active && row.product_variants?.is_active)
      .map((row) => {
        const gallery = (row.products.product_images || [])
          .slice()
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((i) => i.image_url);
        return {
          bundleItemId: row.id,
          productId: row.products.id,
          variantId: row.product_variants.id,
          slug: row.products.slug,
          name: row.products.name,
          description: row.products.short_description || "",
          variantName: row.product_variants.variant_name,
          image: row.products.featured_image_url,
          images: [row.products.featured_image_url, ...gallery].filter(Boolean),
          price: row.product_variants.price,
          oldPrice: row.product_variants.original_price,
          inStock: row.product_variants.stock_quantity > 0,
        };
      });
  } catch (err) {
    console.error("Fetch bundle eligible products error:", err);
    return [];
  }
}
