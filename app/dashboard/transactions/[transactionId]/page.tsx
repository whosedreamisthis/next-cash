import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { parseISO } from "date-fns";
import EditTransactionBreadcrumbs from "@/components/EditTransactionBreadcrumbs";
import EditTransactionForm from "@/components/EditTransactionForm";
import { getCategories } from "@/data/getCategories";
import { getTransaction } from "@/data/getTransaction";

export default async function EditTransactionPage({
  params,
}: PageProps<"/dashboard/transactions/[transactionId]">) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

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

  return (
    <div className="py-10 px-10">
      <EditTransactionBreadcrumbs />
      <EditTransactionForm
        categories={categories}
        transactionId={transaction.id}
        defaultValues={{
          transactionType: transaction.transactionType,
          categoryId: transaction.categoryId,
          transactionDate: parseISO(transaction.transactionDate),
          amount: Number(transaction.amount),
          description: transaction.description,
        }}
      />
    </div>
  );
}
