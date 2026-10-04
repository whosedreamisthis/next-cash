"use client";

import {
  Card,
  CardAction,
  CardTitle,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import DeleteTransactionButton from "@/components/DeleteTransactionButton";
import TransactionForm from "@/components/TransactionForm";
import type { Category } from "@/types/Category";
import type { TransactionFormValues } from "@/lib/schemas/transaction";
import { updateTransaction } from "@/app/dashboard/transactions/[transactionId]/actions";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function EditTransactionForm({
  categories,
  transactionId,
  defaultValues,
}: {
  categories: Category[];
  transactionId: number;
  defaultValues: TransactionFormValues;
}) {
  const router = useRouter();

  const handleSubmit = async (data: TransactionFormValues) => {
    const result = await updateTransaction({
      id: transactionId,
      amount: data.amount,
      transactionDate: format(data.transactionDate, "yyyy-MM-dd"),
      description: data.description,
      categoryId: data.categoryId,
    });

    if (result.error) {
      toast.error("ERROR", {
        description: result.message,
        richColors: true,
      });
    } else {
      toast.success("SUCCESS", {
        description: "Transaction updated",
        richColors: true,
      });

      router.push(
        `/dashboard/transactions?month=${data.transactionDate.getMonth() + 1}&year=${data.transactionDate.getFullYear()}`,
      );
    }
  };
  return (
    <Card className="mt-4 w-[80vw]">
      <CardHeader>
        <CardTitle>Edit Transaction</CardTitle>
        <CardAction>
          <DeleteTransactionButton
            transactionId={transactionId}
            transactionDate={defaultValues.transactionDate}
          />
        </CardAction>
      </CardHeader>
      <CardContent>
        <TransactionForm
          categories={categories}
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
        />
      </CardContent>
    </Card>
  );
}
