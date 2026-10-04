import { format } from "date-fns";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const returning = vi.fn();
  const values = vi.fn(() => ({ returning }));
  return {
    auth: vi.fn(),
    updateTag: vi.fn(),
    categoryExists: vi.fn(),
    insert: vi.fn(() => ({ values })),
    values,
    returning,
  };
});

vi.mock("@clerk/nextjs/server", () => ({ auth: mocks.auth }));
vi.mock("next/cache", () => ({ updateTag: mocks.updateTag }));
vi.mock("@/data/categoryExists", () => ({
  categoryExists: mocks.categoryExists,
}));
vi.mock("@/db", () => ({ db: { insert: mocks.insert } }));

import { createTransaction } from "./actions";

const input = {
  amount: 12.5,
  transactionDate: format(new Date(), "yyyy-MM-dd"),
  description: "Groceries",
  categoryId: 3,
};

describe("createTransaction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.auth.mockResolvedValue({ userId: "user_1" });
    mocks.categoryExists.mockResolvedValue(true);
    mocks.returning.mockResolvedValue([{ id: 42 }]);
  });

  it("rejects a signed-out user", async () => {
    mocks.auth.mockResolvedValue({ userId: null });

    expect(await createTransaction(input)).toEqual({
      error: true,
      message: "Unauthorized",
    });
    expect(mocks.insert).not.toHaveBeenCalled();
  });

  it("returns the first validation error", async () => {
    expect(await createTransaction({ ...input, amount: 0 })).toEqual({
      error: true,
      message: "Amount must be greater than 0",
    });
    expect(mocks.insert).not.toHaveBeenCalled();
  });

  it("rejects a category that doesn't exist", async () => {
    mocks.categoryExists.mockResolvedValue(false);

    expect(await createTransaction(input)).toEqual({
      error: true,
      message: "Category not found",
    });
    expect(mocks.insert).not.toHaveBeenCalled();
  });

  it("saves the transaction for the signed-in user", async () => {
    expect(await createTransaction(input)).toEqual({ id: 42 });
    expect(mocks.values).toHaveBeenCalledWith({
      userId: "user_1",
      amount: "12.50",
      description: "Groceries",
      categoryId: 3,
      transactionDate: input.transactionDate,
    });
  });

  it("clears the user's cached transactions", async () => {
    await createTransaction(input);

    expect(mocks.updateTag).toHaveBeenCalledWith("transactions:user_1");
  });
});
