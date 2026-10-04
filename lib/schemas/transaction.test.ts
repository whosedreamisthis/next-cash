import { addDays, format, subYears } from "date-fns";
import { describe, expect, it } from "vitest";
import { transactionFormSchema, transactionSchema } from "./transaction";

const today = format(new Date(), "yyyy-MM-dd");

const valid = {
  amount: 12.5,
  transactionDate: today,
  description: "Groceries",
  categoryId: 3,
};

// The first issue is the message the server actions show the user
function firstError(input: unknown) {
  const result = transactionSchema.safeParse(input);
  return result.success ? undefined : result.error.issues[0].message;
}

describe("transactionSchema", () => {
  it("accepts a valid transaction", () => {
    expect(transactionSchema.safeParse(valid).success).toBe(true);
  });

  it.each([
    ["is zero", 0, "Amount must be greater than 0"],
    ["is negative", -5, "Amount must be greater than 0"],
    ["is too large", 10_000_000_000, "Amount is too large"],
  ])("rejects an amount that %s", (_, amount, message) => {
    expect(firstError({ ...valid, amount })).toBe(message);
  });

  it.each([
    ["is too short", "ab", "Description must be at least 3 characters"],
    ["is too long", "a".repeat(301), "Description must be at most 300 characters"],
  ])("rejects a description that %s", (_, description, message) => {
    expect(firstError({ ...valid, description })).toBe(message);
  });

  it.each([0, -1, 1.5, 2_147_483_648])("rejects category id %s", (categoryId) => {
    expect(firstError({ ...valid, categoryId })).toBe("Please select a category");
  });

  it.each([
    ["in another format", "04/10/2026"],
    ["that doesn't exist", "2025-02-30"],
  ])("rejects a date %s", (_, transactionDate) => {
    expect(firstError({ ...valid, transactionDate })).toBe(
      "Transaction date must be a valid yyyy-MM-dd date",
    );
  });

  it("rejects a date in the future", () => {
    const transactionDate = format(addDays(new Date(), 3), "yyyy-MM-dd");
    expect(firstError({ ...valid, transactionDate })).toBe(
      "Transaction date cannot be in the future",
    );
  });

  it("rejects a date over 100 years ago", () => {
    const transactionDate = format(subYears(new Date(), 101), "yyyy-MM-dd");
    expect(firstError({ ...valid, transactionDate })).toBe(
      "Transaction date is too far in the past",
    );
  });
});

describe("transactionFormSchema", () => {
  it("coerces the form's string values", () => {
    const result = transactionFormSchema.parse({
      ...valid,
      transactionType: "expense",
      amount: "12.50",
      categoryId: "3",
      transactionDate: new Date(),
    });

    expect(result.amount).toBe(12.5);
    expect(result.categoryId).toBe(3);
  });

  it("rejects an unknown transaction type", () => {
    const result = transactionFormSchema.safeParse({
      ...valid,
      transactionType: "transfer",
      transactionDate: new Date(),
    });

    expect(result.success).toBe(false);
  });
});
