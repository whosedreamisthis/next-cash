import { addDays } from "date-fns";
import { z } from "zod";

export const TRANSACTION_TYPES = ["income", "expense"] as const;

export const transactionFormSchema = z.object({
  transactionType: z.enum(TRANSACTION_TYPES),
  categoryId: z.coerce.number().positive("Please select a category"),
  transactionDate: z.coerce
    .date()
    // Checked on every validation, not once at module load
    .refine(
      (date) => date <= addDays(new Date(), 1),
      "Transaction date cannot be in the future",
    ),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(300, "Description must be at most 300 characters"),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
