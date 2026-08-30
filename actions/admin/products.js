"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { validateVariants } from "@/lib/productValidation";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getAllProductsAdmin() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, slug, is_active, is_featured, featured_image_url, categories ( name ), product_variants ( price, stock_quantity )")
    .eq("show_in_shop", true)
    .order("created_at", { ascending: false });

  return (data || []).map((p) => ({
    ...p,
    categoryName: p.categories?.name,
    minPrice: p.product_variants?.length ? Math.min(...p.product_variants.map((v) => v.price)) : null,
    totalStock: (p.product_variants || []).reduce((sum, v) => sum + v.stock_quantity, 0),
  }));
}

export async function getProductForEdit(id) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("products")
    .select(`
      *,
      product_images ( id, image_url, sort_order, variant_name ),
      product_variants ( id, variant_name, bottle_type, price, original_price, stock_quantity, weight_grams, is_active ),
      product_faqs ( id, question, answer, display_order )
    `)
    .eq("id", id)
    .maybeSingle();

  return data;
}

async function syncChildren(supabase, productId, { images, variants, faqs }) {
  await supabase.from("product_images").delete().eq("product_id", productId);
  if (images?.length) {
    await supabase.from("product_images").insert(
      images.map((img, i) => ({
        product_id: productId,
        image_url: img.url,
        variant_name: img.size || null,
        sort_order: i,
      }))
    );
  }

  await supabase.from("product_variants").delete().eq("product_id", productId);
  if (variants?.length) {
    await supabase.from("product_variants").insert(
      variants.map((v) => ({
        product_id: productId,
        variant_name: v.variant_name,
        bottle_type: v.bottle_type === "plastic" ? "plastic" : "glass",
        price: Number(v.price),
        original_price: v.original_price ? Number(v.original_price) : null,
        stock_quantity: Number(v.stock_quantity || 0),
        weight_grams: v.weight_grams ? Number(v.weight_grams) : null,
        is_active: true,
      }))
    );
  }

  await supabase.from("product_faqs").delete().eq("product_id", productId);
  if (faqs?.length) {
    await supabase.from("product_faqs").insert(
      faqs.map((f, i) => ({ product_id: productId, question: f.question, answer: f.answer, display_order: i }))
    );
  }
}

function parseProductFields(formData) {
  return {
    name: formData.get("name"),
    category_id: formData.get("category_id") || null,
    short_description: formData.get("short_description") || null,
    description: formData.get("description") || null,
    gender: formData.get("gender") || null,
    notes_top: formData.get("notes_top") || null,
    notes_middle: formData.get("notes_middle") || null,
    notes_base: formData.get("notes_base") || null,
    badge: formData.get("badge") || null,
    featured_image_url: formData.get("featured_image_url") || null,
    seo_title: formData.get("seo_title") || null,
    seo_description: formData.get("seo_description") || null,
    is_active: formData.get("is_active") === "on",
    is_featured: formData.get("is_featured") === "on",
  };
}

function parseJsonField(formData, key) {
  try {
    return JSON.parse(formData.get(key) || "[]");
  } catch {
    return [];
  }
}

export async function createProduct(_prevState, formData) {
  const supabase = createAdminClient();
  const fields = parseProductFields(formData);
  if (!fields.name) return { error: "Product name is required." };

  const variants = parseJsonField(formData, "variants");
  const variantsError = validateVariants(variants);
  if (variantsError) return { error: variantsError };

  const { data: product, error } = await supabase
    .from("products")
    .insert({ ...fields, slug: slugify(fields.name) })
    .select("id")
    .single();

  if (error || !product) return { error: error?.message || "Failed to create product." };

  await syncChildren(supabase, product.id, {
    images: parseJsonField(formData, "images"),
    variants,
    faqs: parseJsonField(formData, "faqs"),
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function updateProduct(_prevState, formData) {
  const supabase = createAdminClient();
  const id = formData.get("id");
  const fields = parseProductFields(formData);
  if (!id || !fields.name) return { error: "Product name is required." };

  const variants = parseJsonField(formData, "variants");
  const variantsError = validateVariants(variants);
  if (variantsError) return { error: variantsError };

  const { error } = await supabase
    .from("products")
    .update({ ...fields, slug: slugify(fields.name), updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  await syncChildren(supabase, id, {
    images: parseJsonField(formData, "images"),
    variants,
    faqs: parseJsonField(formData, "faqs"),
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function deleteProduct(id) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}
