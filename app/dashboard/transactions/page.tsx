import Link from "next/link";
import { format } from "date-fns";
import MonthYearFilter from "@/components/MonthYearFilter";
import TransactionsBreadcrumbs from "@/components/TransactionsBreadcrumbs";
import TransactionsTable from "@/components/TransactionsTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTransactionsByMonth } from "@/data/getTransactionsByMonth";
import { getUserId } from "@/lib/auth";
import { parseSearchParam } from "@/lib/parseSearchParam";

export default async function TransactionsPage({
  searchParams,
}: PageProps<"/dashboard/transactions">) {
  const userId = await getUserId();

  // Falls back to the current month/year when a param is missing or invalid
  const params = await searchParams;
  const today = new Date();
  const month = parseSearchParam(params.month, 1, 12, today.getMonth() + 1);
  const year = parseSearchParam(
    params.year,
    1900,
    today.getFullYear(),
    today.getFullYear(),
  );

  const transactions = await getTransactionsByMonth({ userId, year, month });

  return (
    <div className="px-4 py-6 sm:px-10 sm:py-10">
      <TransactionsBreadcrumbs />
      <Card className="mt-4">
        {/* Stacks the title above the filter on small screens */}
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>
            {format(new Date(year, month - 1, 1), "MMM yyyy")} Transactions
          </CardTitle>
          <MonthYearFilter month={month} year={year} />
        </CardHeader>
        <CardContent>
          <Button
            nativeButton={false}
            render={<Link href="/dashboard/transactions/new" />}
          >
            New Transaction
          </Button>
          {transactions.length === 0 ? (
            <p className="mt-6 py-10 text-center text-muted-foreground">
              There are no transactions for this month
            </p>
          ) : (
            <TransactionsTable
              className="mt-4"
              transactions={transactions}
              singleMonth
              showEdit
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
