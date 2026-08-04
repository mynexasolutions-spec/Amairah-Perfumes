"use server";

// Amairah Perfumes - Products Actions (Strict Async Exports Only)
import { createClient } from "@/lib/supabase/server";

const LISTING_SELECT = `
  id, name, slug, badge, gender, average_rating, review_count,
  featured_image_url, category_id, is_featured, short_description,
  product_images ( image_url, sort_order, variant_name ),
  product_variants ( id, variant_name, bottle_type, price, original_price, stock_quantity, is_active )
`;

const MOCK_PRODUCTS = [
  {
    id: "mock-1",
    name: "Oudh Mustaqeem",
    slug: "oudh-mustaqeem",
    badge: "Bestseller",
    concentration: "Attar",
    gender: "Unisex",
    rating: 4.9,
    reviewCount: 48,
    categoryId: "cat-attar",
    image: null,
    price: 799,
    oldPrice: 999,
    variantId: "v1",
    variantName: "6ml Concentrated Oil",
    inStock: true,
  },
  {
    id: "mock-2",
    name: "Royal Amber Extrait",
    slug: "royal-amber-extrait",
    badge: "Extrait Load",
    concentration: "Extrait de Parfum",
    gender: "Unisex",
    rating: 4.8,
    reviewCount: 32,
    categoryId: "cat-extrait",
    image: null,
    price: 1499,
    oldPrice: 1899,
    variantId: "v2",
    variantName: "50ml Spray",
    inStock: true,
  },
  {
    id: "mock-3",
    name: "Noor Rose Velvet",
    slug: "noor-rose-velvet",
    badge: "Artisanal",
    concentration: "Attar",
    gender: "Her",
    rating: 4.7,
    reviewCount: 29,
    categoryId: "cat-attar",
    image: null,
    price: 699,
    oldPrice: 899,
    variantId: "v3",
    variantName: "6ml Pure Oil",
    inStock: true,
  },
  {
    id: "mock-4",
    name: "Santal Imperial",
    slug: "santal-imperial",
    badge: "Signature",
    concentration: "Eau de Parfum",
    gender: "Him",
    rating: 4.9,
    reviewCount: 54,
    categoryId: "cat-edp",
    image: null,
    price: 1299,
    oldPrice: 1599,
    variantId: "v4",
    variantName: "50ml Luxury Spray",
    inStock: true,
  },
  {
    id: "mock-5",
    name: "Musk Silk",
    slug: "musk-silk",
    badge: "Velvet Soft",
    concentration: "Attar",
    gender: "Unisex",
    rating: 4.6,
    reviewCount: 19,
    categoryId: "cat-attar",
    image: null,
    price: 599,
    oldPrice: 799,
    variantId: "v5",
    variantName: "6ml Pure Oil",
    inStock: true,
  },
  {
    id: "mock-6",
    name: "Velvet Saffron",
    slug: "velvet-saffron",
    badge: "Limited Edition",
    concentration: "Extrait de Parfum",
    gender: "Unisex",
    rating: 5.0,
    reviewCount: 15,
    categoryId: "cat-extrait",
    image: null,
    price: 1799,
    oldPrice: 2199,
    variantId: "v6",
    variantName: "50ml Spray",
    inStock: true,
  },
];

function withDisplayPrice(product) {
  const activeVariants = (product.product_variants || []).filter((v) => v.is_active);
  // Glass is the default bottle shown storefront-wide (listing cards,
  // quick-add) — Plastic is only ever an explicit alternate on the product
  // page, so it must never surface here even when it's the cheaper option.
  const glassVariants = activeVariants.filter((v) => (v.bottle_type || "glass") === "glass");
  const cheapest = (glassVariants.length > 0 ? glassVariants : activeVariants).sort((a, b) => a.price - b.price)[0];
  const image =
    product.featured_image_url ||
    [...(product.product_images || [])].sort((a, b) => a.sort_order - b.sort_order)[0]?.image_url ||
    null;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    badge: product.badge,
    shortDescription: product.short_description,
    gender: product.gender,
    rating: product.average_rating,
    reviewCount: product.review_count,
    categoryId: product.category_id,
    image,
    price: cheapest?.price ?? null,
    oldPrice: cheapest?.original_price ?? null,
    variantId: cheapest?.id ?? null,
    // Always Glass here (see filter above), so label it explicitly to match
    // the product page's cart item naming.
    variantName: cheapest ? `${cheapest.variant_name} (Glass Bottle)` : null,
    inStock: activeVariants.some((v) => v.stock_quantity > 0),
  };
}

export async function getProducts(filters = {}) {
  try {
    const supabase = await createClient();
    let query = supabase.from("products").select(LISTING_SELECT).eq("is_active", true);

    if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
    if (filters.gender) query = query.eq("gender", filters.gender);
    if (filters.badgeContains) query = query.ilike("badge", `%${filters.badgeContains}%`);
    if (filters.search) {
      const term = `%${filters.search}%`;
      query = query.or(`name.ilike.${term},description.ilike.${term},short_description.ilike.${term},notes_top.ilike.${term},notes_middle.ilike.${term},notes_base.ilike.${term}`);
    }

    query = query.order("created_at", { ascending: false });
    if (filters.limit) query = query.limit(filters.limit);

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      let products = data.map(withDisplayPrice);

      if (filters.minPrice != null) products = products.filter((p) => (p.price ?? 0) >= filters.minPrice);
      if (filters.maxPrice != null) products = products.filter((p) => (p.price ?? 0) <= filters.maxPrice);

      if (filters.sort === "price_asc") products.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      if (filters.sort === "price_desc") products.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      if (filters.sort === "rating") products.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

      return products;
    }
  } catch (err) {
    console.error("Fetch products error:", err);
  }

  return [];
}

export async function getFeaturedProducts(limit = 4) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select(LISTING_SELECT)
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (data && data.length > 0) return data.map(withDisplayPrice);
  } catch (err) {
    console.error("Fetch featured products error:", err);
  }

  return [];
}

export async function getRelatedProducts(categoryId, excludeId, limit = 4) {
  try {
    const supabase = await createClient();
    let data = null;

    if (categoryId) {
      const res = await supabase
        .from("products")
        .select(LISTING_SELECT)
        .eq("is_active", true)
        .eq("category_id", categoryId)
        .neq("id", excludeId)
        .limit(limit);
      data = res.data;
    }

    // No category, or nothing else in that category — widen to any other
    // real product instead of falling back to demo data.
    if (!data || data.length === 0) {
      const res = await supabase
        .from("products")
        .select(LISTING_SELECT)
        .eq("is_active", true)
        .neq("id", excludeId)
        .order("created_at", { ascending: false })
        .limit(limit);
      data = res.data;
    }

    if (data && data.length > 0) return data.map(withDisplayPrice);
  } catch (err) {
    console.error("Fetch related products error:", err);
  }

  return [];
}

export async function getProductBySlug(slug) {
  try {
    const supabase = await createClient();
    const { data: product } = await supabase
      .from("products")
      .select(`
        id, name, slug, category_id, is_active, badge, gender,
        average_rating, review_count, short_description, description,
        notes_top, notes_middle, notes_base, featured_image_url,
        product_images ( id, image_url, sort_order, variant_name ),
        product_variants ( id, variant_name, bottle_type, price, original_price, stock_quantity, is_active ),
        product_faqs ( id, question, answer, display_order )
      `)
      .eq("slug", slug)
      .maybeSingle();

    if (product && product.is_active) {
      const [categoryResult, reviewsResult, userResult] = await Promise.all([
        product.category_id
          ? supabase.from("categories").select("name").eq("id", product.category_id).maybeSingle()
          : Promise.resolve({ data: null }),
        supabase
          .from("reviews")
          .select("id, rating, review_text, created_at, profiles ( full_name )")
          .eq("product_id", product.id)
          .eq("is_approved", true)
          .order("created_at", { ascending: false }),
        supabase.auth.getUser(),
      ]);

      const categoryName = categoryResult.data?.name || null;
      const reviews = reviewsResult.data;

      // A logged-in user's own review for this product (approved or still
      // pending) — used to show it back to them instead of a blank form.
      let myReview = null;
      const user = userResult.data?.user;
      if (user) {
        const { data } = await supabase
          .from("reviews")
          .select("id, rating, review_text, is_approved")
          .eq("product_id", product.id)
          .eq("user_id", user.id)
          .maybeSingle();
        myReview = data || null;
      }

      const images = (product.product_images || []).slice().sort((a, b) => a.sort_order - b.sort_order);
      if (images.length === 0 && product.featured_image_url) {
        images.push({ id: "featured", image_url: product.featured_image_url });
      }

      const faqs = (product.product_faqs || []).slice().sort((a, b) => a.display_order - b.display_order);
      const variants = (product.product_variants || [])
        .filter((v) => v.is_active)
        .sort((a, b) => a.price - b.price);

      // The signed-in user's own review is already shown separately via
      // `myReview` (as "Your Review"), so drop it here to avoid a duplicate.
      const otherReviews = (reviews || []).filter((r) => r.id !== myReview?.id);

      return {
        ...product,
        categoryName,
        images,
        faqs,
        variants,
        reviews: otherReviews,
        myReview,
      };
    }
  } catch (err) {
    console.error("Fetch product by slug error:", err);
  }

  return null;
}
