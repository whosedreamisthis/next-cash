import NewTransactionBreadcrumbs from "@/components/NewTransactionBreadcrumbs";
import NewTransactionForm from "@/components/NewTransactionForm";
import { getCategories } from "@/data/getCategories";

export default async function NewTransactionPage() {
  const categories = await getCategories();

  return (
    <div className="px-4 py-6 sm:px-10 sm:py-10">
      <NewTransactionBreadcrumbs />
      <NewTransactionForm categories={categories} />
    </div>
  );
}
