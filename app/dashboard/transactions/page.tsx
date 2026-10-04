import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { format, parseISO } from "date-fns";
import { PencilIcon } from "lucide-react";
import MonthYearFilter from "@/components/MonthYearFilter";
import TransactionsBreadcrumbs from "@/components/TransactionsBreadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTransactionsByMonth } from "@/data/getTransactionsByMonth";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  // $2,500 rather than $2,500.00, but still $12.50
  trailingZeroDisplay: "stripIfInteger",
});

function TransactionTypeBadge({ type }: { type: "income" | "expense" }) {
  return (
    <Badge
      className={
        type === "income"
          ? "bg-lime-500 capitalize"
          : "bg-orange-500 capitalize"
      }
    >
      {type}
    </Badge>
  );
}

// Falls back to the current month/year when the param is missing or invalid
function parseParam(
  value: string | string[] | undefined,
  min: number,
  max: number,
  fallback: number,
) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max
    ? parsed
    : fallback;
}

export default async function TransactionsPage({
  searchParams,
}: PageProps<"/dashboard/transactions">) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const params = await searchParams;
  const today = new Date();
  const month = parseParam(params.month, 1, 12, today.getMonth() + 1);
  const year = parseParam(
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
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Category
                  </TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {/* Phones show only the day; the month is in the title */}
                      <span className="sm:hidden">
                        {format(parseISO(transaction.transactionDate), "do")}
                      </span>
                      <span className="hidden sm:inline">
                        {format(
                          parseISO(transaction.transactionDate),
                          "do MMM yyyy",
                        )}
                      </span>
                    </TableCell>
                    {/* Wraps long descriptions instead of widening the table */}
                    <TableCell className="whitespace-normal sm:min-w-32">
                      {transaction.description}
                      {/* Below md the hidden columns sit under the description:
                          type on phones, category on phones and tablets */}
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 md:hidden">
                        <span className="sm:hidden">
                          <TransactionTypeBadge
                            type={transaction.transactionType}
                          />
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {transaction.category}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <TransactionTypeBadge
                        type={transaction.transactionType}
                      />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {transaction.category}
                    </TableCell>
                    <TableCell>
                      {currencyFormatter.format(Number(transaction.amount))}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        aria-label="Edit transaction"
                        nativeButton={false}
                        render={
                          <Link
                            href={`/dashboard/transactions/${transaction.id}`}
                          />
                        }
                      >
                        <PencilIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
