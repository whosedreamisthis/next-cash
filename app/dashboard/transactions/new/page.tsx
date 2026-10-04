import NewTransactionBreadcrumbs from "@/components/NewTransactionBreadcrumbs";
import NewTransactionForm from "@/components/NewTransactionForm";
import { getCategories } from "@/data/getCategories";

export default async function NewTransactionPage() {
  const categories = await getCategories();

  return (
    <div className="py-10 px-10">
      <NewTransactionBreadcrumbs />
      <NewTransactionForm categories={categories} />
    </div>
  );
}
