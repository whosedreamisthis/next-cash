import { notFound } from "next/navigation";
import { parseISO } from "date-fns";
import EditTransactionBreadcrumbs from "@/components/EditTransactionBreadcrumbs";
import EditTransactionForm from "@/components/EditTransactionForm";
import { getCategories } from "@/data/getCategories";
import { getTransaction } from "@/data/getTransaction";
import { getUserId } from "@/lib/auth";

export default async function EditTransactionPage({
  params,
}: PageProps<"/dashboard/transactions/[transactionId]">) {
  const userId = await getUserId();

  const { transactionId } = await params;
  const id = Number(transactionId);
  // Postgres integer ids are positive and fit in 32 bits
  if (!Number.isInteger(id) || id < 1 || id > 2_147_483_647) {
    notFound();
  }

  const [categories, transaction] = await Promise.all([
    getCategories(),
    getTransaction({ id, userId }),
  ]);

  if (!transaction) {
    notFound();
  }

  const transactionDate = parseISO(transaction.transactionDate);

  return (
    <div className="px-4 py-6 sm:px-10 sm:py-10">
      <EditTransactionBreadcrumbs
        month={transactionDate.getMonth() + 1}
        year={transactionDate.getFullYear()}
      />
      <EditTransactionForm
        categories={categories}
        transactionId={transaction.id}
        defaultValues={{
          transactionType: transaction.transactionType,
          categoryId: transaction.categoryId,
          transactionDate,
          amount: Number(transaction.amount),
          description: transaction.description,
        }}
      />
    </div>
  );
}
