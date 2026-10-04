"use client";

import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import TransactionForm from "@/components/TransactionForm";
import type { Category } from "@/types/Category";
import type { TransactionFormValues } from "@/lib/schemas/transaction";
import { createTransaction } from "@/app/dashboard/transactions/new/actions";
import { format } from "date-fns";
import { toast } from "sonner";

export default function NewTransactionForm({
  categories,
}: {
  categories: Category[];
}) {
  const handleSubmit = async (data: TransactionFormValues) => {
    const result = await createTransaction({
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
        description: "New transaction created",
        richColors: true,
      });
    }
  };
  return (
    <Card className="mt-4 w-[80vw]">
      <CardHeader>
        <CardTitle>New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionForm categories={categories} onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  );
}
