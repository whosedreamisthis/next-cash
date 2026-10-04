"use server";

import { db } from "@/db";
import { transactionsTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { transactionSchema } from "@/lib/schemas/transaction";
import { categoryExists } from "@/data/categoryExists";

export const createTransaction = async (data: {
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

  const [transaction] = await db
    .insert(transactionsTable)
    .values({
      userId,
      amount: amount.toFixed(2),
      description,
      categoryId,
      transactionDate,
    })
    .returning();

  return {
    id: transaction.id,
  };
};
