import NewTransactionBreadcrumbs from "@/components/NewTransactionBreadcrumbs";
import NewTransactionCard from "@/components/NewTransactionCard";
import { getCategories } from "@/data/getCategories";

export default async function NewTransactionPage() {
  const categories = await getCategories();

  return (
    <div className="py-10 px-10">
      <NewTransactionBreadcrumbs />
      <NewTransactionCard categories={categories} />
    </div>
  );
}
