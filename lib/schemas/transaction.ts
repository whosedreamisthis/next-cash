import { addDays, format, isValid, parse, subYears } from "date-fns";
import { z } from "zod";

export const TRANSACTION_TYPES = ["income", "expense"] as const;

// Largest value the numeric(12, 2) amount column can hold
const MAX_AMOUNT = 9_999_999_999.99;
// Largest Postgres integer, the type of the category id column
const MAX_ID = 2_147_483_647;

// Checked on every validation, not once at module load
const isNotTooOld = (date: Date) => date >= subYears(new Date(), 100);
const isNotInFuture = (date: Date) => date <= addDays(new Date(), 1);

export const transactionFormSchema = z.object({
  transactionType: z.enum(TRANSACTION_TYPES),
  categoryId: z.coerce
    .number()
    .int("Please select a category")
    .positive("Please select a category")
    .max(MAX_ID, "Please select a category"),
  transactionDate: z.coerce
    .date()
    .refine(isNotTooOld, "Transaction date is too far in the past")
    .refine(isNotInFuture, "Transaction date cannot be in the future"),
  amount: z.coerce
    .number()
    // Smaller amounts would be rounded to 0.00 by the database
    .min(0.01, "Amount must be greater than 0")
    .max(MAX_AMOUNT, "Amount is too large"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(300, "Description must be at most 300 characters"),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;

// The type is only used to filter categories in the form; the server
// derives it from the category itself. The date arrives as the exact
// "yyyy-MM-dd" string that gets stored, so that string is what's validated.
export const transactionSchema = transactionFormSchema
  .omit({ transactionType: true, transactionDate: true })
  .extend({
    transactionDate: z
      .string()
      .refine((value) => {
        const date = parse(value, "yyyy-MM-dd", new Date());
        // The round trip rejects other formats and dates like 2025-02-30
        return isValid(date) && format(date, "yyyy-MM-dd") === value;
      }, "Transaction date must be a valid yyyy-MM-dd date")
      .refine(
        (value) => isNotTooOld(parse(value, "yyyy-MM-dd", new Date())),
        "Transaction date is too far in the past",
      )
      .refine(
        (value) => isNotInFuture(parse(value, "yyyy-MM-dd", new Date())),
        "Transaction date cannot be in the future",
      ),
  });
