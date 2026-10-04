import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import TransactionForm from "@/components/TransactionForm";
import type { Category } from "@/types/Category";

export default function NewTransactionCard({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <Card className="mt-4 w-[80vw]">
      <CardHeader>
        <CardTitle>New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionForm categories={categories} />
      </CardContent>
    </Card>
  );
}
