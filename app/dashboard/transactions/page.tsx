import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { format, parseISO } from "date-fns";
import { PencilIcon } from "lucide-react";
import MonthYearFilter from "@/components/MonthYearFilter";
import TransactionsBreadcrumbs from "@/components/TransactionsBreadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTransactionsByMonth } from "@/data/getTransactionsByMonth";

const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

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
    <div className="py-10 px-10">
      <TransactionsBreadcrumbs />
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>
            {format(new Date(year, month - 1, 1), "MMM yyyy")} Transactions
          </CardTitle>
          <CardAction>
            <MonthYearFilter month={month} year={year} />
          </CardAction>
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
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {format(
                        parseISO(transaction.transactionDate),
                        "do MMM yyyy",
                      )}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          transaction.transactionType === "income"
                            ? "bg-lime-500 capitalize"
                            : "bg-orange-500 capitalize"
                        }
                      >
                        {transaction.transactionType}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.category}</TableCell>
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
