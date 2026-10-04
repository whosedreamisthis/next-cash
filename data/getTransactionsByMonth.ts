import "server-only";
import { and, desc, eq, gte, lt } from "drizzle-orm";
import { addMonths, format } from "date-fns";
import { db } from "@/db";
import { categoriesTable, transactionsTable } from "@/db/schema";

export async function getTransactionsByMonth({
  userId,
  year,
  month,
}: {
  userId: string;
  year: number;
  // 1-12
  month: number;
}) {
  const start = new Date(year, month - 1, 1);
  const end = addMonths(start, 1);

  return (
    db
      .select({
        id: transactionsTable.id,
        description: transactionsTable.description,
        amount: transactionsTable.amount,
        transactionDate: transactionsTable.transactionDate,
        category: categoriesTable.name,
        transactionType: categoriesTable.type,
      })
      .from(transactionsTable)
      // The transaction type comes from its category
      .innerJoin(
        categoriesTable,
        eq(transactionsTable.categoryId, categoriesTable.id),
      )
      .where(
        and(
          eq(transactionsTable.userId, userId),
          gte(transactionsTable.transactionDate, format(start, "yyyy-MM-dd")),
          lt(transactionsTable.transactionDate, format(end, "yyyy-MM-dd")),
        ),
      )
      .orderBy(
        desc(transactionsTable.transactionDate),
        desc(transactionsTable.id),
      )
  );
}
