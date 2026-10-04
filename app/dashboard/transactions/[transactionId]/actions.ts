"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { transactionsTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { transactionSchema } from "@/lib/schemas/transaction";
import { categoryExists } from "@/data/categoryExists";

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

  // Save the validated values, not the raw input
  const { amount, description, categoryId, transactionDate } = validation.data;

  if (!(await categoryExists(categoryId))) {
    return {
      error: true,
      message: "Category not found",
    };
  }

  // Matching on userId too means users can only update their own transactions
  const [transaction] = await db
    .update(transactionsTable)
    .set({
      amount: amount.toFixed(2),
      description,
      categoryId,
      transactionDate,
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

export const deleteTransaction = async (id: number) => {
  const { userId } = await auth();

  if (!userId) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  if (!Number.isInteger(id) || id < 1 || id > 2_147_483_647) {
    return {
      error: true,
      message: "Transaction not found",
    };
  }

  // Matching on userId too means users can only delete their own transactions
  const [transaction] = await db
    .delete(transactionsTable)
    .where(
      and(eq(transactionsTable.id, id), eq(transactionsTable.userId, userId)),
    )
    .returning({ id: transactionsTable.id });

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
