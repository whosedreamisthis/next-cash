import Link from "next/link";
import { format, parseISO } from "date-fns";
import { PencilIcon } from "lucide-react";
import TransactionTypeBadge from "@/components/TransactionTypeBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatCurrency";

export type TransactionRow = {
  id: number;
  description: string;
  amount: string;
  transactionDate: string;
  category: string;
  transactionType: "income" | "expense";
};

export default function TransactionsTable({
  transactions,
  singleMonth = false,
  showEdit = false,
  className,
}: {
  transactions: TransactionRow[];
  // When every row is from one month, phones show only the day
  singleMonth?: boolean;
  showEdit?: boolean;
  className?: string;
}) {
  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="hidden sm:table-cell">Type</TableHead>
          <TableHead className="hidden md:table-cell">Category</TableHead>
          <TableHead>Amount</TableHead>
          {showEdit && <TableHead />}
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => {
          const date = parseISO(transaction.transactionDate);

          return (
            <TableRow key={transaction.id}>
              <TableCell>
                <span className="sm:hidden">
                  {format(date, singleMonth ? "do" : "do MMM")}
                </span>
                <span className="hidden sm:inline">
                  {format(date, "do MMM yyyy")}
                </span>
              </TableCell>
              {/* Wraps long descriptions instead of widening the table */}
              <TableCell className="whitespace-normal sm:min-w-32">
                {transaction.description}
                {/* Below md the hidden columns sit under the description:
                    type on phones, category on phones and tablets */}
                <div className="mt-1 flex flex-wrap items-center gap-1.5 md:hidden">
                  <span className="sm:hidden">
                    <TransactionTypeBadge type={transaction.transactionType} />
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {transaction.category}
                  </span>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <TransactionTypeBadge type={transaction.transactionType} />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {transaction.category}
              </TableCell>
              <TableCell>
                {formatCurrency(Number(transaction.amount))}
              </TableCell>
              {showEdit && (
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
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
