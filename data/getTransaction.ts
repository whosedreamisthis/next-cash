import "server-only";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { categoriesTable, transactionsTable } from "@/db/schema";

// Returns undefined when the transaction doesn't exist or belongs to another user
export async function getTransaction({
  id,
  userId,
}: {
  id: number;
  userId: string;
}) {
  const [transaction] = await db
    .select({
      id: transactionsTable.id,
      description: transactionsTable.description,
      amount: transactionsTable.amount,
      transactionDate: transactionsTable.transactionDate,
      categoryId: transactionsTable.categoryId,
      transactionType: categoriesTable.type,
    })
    .from(transactionsTable)
    .innerJoin(
      categoriesTable,
      eq(transactionsTable.categoryId, categoriesTable.id),
    )
    .where(
      and(eq(transactionsTable.id, id), eq(transactionsTable.userId, userId)),
    );

  return transaction;
}
