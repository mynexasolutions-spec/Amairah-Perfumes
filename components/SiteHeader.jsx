import { getActiveCategories } from "@/actions/categories";
import { getActiveAnnouncement } from "@/actions/site";
import { createClient } from "@/lib/supabase/server";
import Header from "./Header";

export default async function SiteHeader() {
  const supabase = await createClient();
  const [categories, announcement, { data: { user } }] = await Promise.all([
    getActiveCategories(),
    getActiveAnnouncement(),
    supabase.auth.getUser(),
  ]);

  return <Header categories={categories} announcement={announcement} isLoggedIn={Boolean(user)} />;
}
