"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { transactionsTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { transactionSchema } from "@/lib/schemas/transaction";

export const updateTransaction = async (data: {
  id: number;
  amount: number;
  transactionDate: string;
  description: string;
  categoryId: number;
}) => {
  const { userId } = await auth();

  if (!userId) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  const validation = transactionSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0].message,
    };
  }

  // Matching on userId too means users can only update their own transactions
  const [transaction] = await db
    .update(transactionsTable)
    .set({
      amount: data.amount.toString(),
      description: data.description,
      categoryId: data.categoryId,
      transactionDate: data.transactionDate,
    })
    .where(
      and(
        eq(transactionsTable.id, data.id),
        eq(transactionsTable.userId, userId),
      ),
    )
    .returning();

  if (!transaction) {
    return {
      error: true,
      message: "Transaction not found",
    };
  }

  return {
    id: transaction.id,
  };
};
