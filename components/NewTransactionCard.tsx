import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import TransactionForm from "@/components/TransactionForm";

export default function NewTransactionCard() {
  return (
    <Card className="mt-4 w-[80vw]">
      <CardHeader>
        <CardTitle>New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionForm />
      </CardContent>
    </Card>
  );
}
