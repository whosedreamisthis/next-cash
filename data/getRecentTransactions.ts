import "server-only";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categoriesTable, transactionsTable } from "@/db/schema";

export async function getRecentTransactions({
  userId,
  limit = 5,
}: {
  userId: string;
  limit?: number;
}) {
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
      .where(eq(transactionsTable.userId, userId))
      .orderBy(
        desc(transactionsTable.transactionDate),
        desc(transactionsTable.id),
      )
      .limit(limit)
  );
}
