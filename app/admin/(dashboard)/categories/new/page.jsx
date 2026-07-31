import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CategoryForm from "../_components/CategoryForm";

export const metadata = { title: "New Category" };

export default function NewCategoryPage() {
  return (
    <div>
      <Link
        href="/admin/categories"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-ivory/40 transition-colors hover:text-gold-300"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Categories
      </Link>
      <h1 className="mb-6 font-display text-3xl font-light text-ivory">
        New <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400">Category</span>
      </h1>
      <CategoryForm />
    </div>
  );
}
