import Link from "next/link";
import TransactionsTable, {
  type TransactionRow,
} from "@/components/TransactionsTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecentTransactionsCard({
  transactions,
}: {
  transactions: TransactionRow[];
}) {
  return (
    <Card>
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <CardTitle>Recent Transactions</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/dashboard/transactions" />}
          >
            View All
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="/dashboard/transactions/new" />}
          >
            Create New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">
            You don&apos;t have any transactions yet
          </p>
        ) : (
          <TransactionsTable transactions={transactions} />
        )}
      </CardContent>
    </Card>
  );
}
