import { format } from "date-fns";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const returning = vi.fn();
  const where = vi.fn(() => ({ returning }));
  const set = vi.fn(() => ({ where }));
  return {
    auth: vi.fn(),
    updateTag: vi.fn(),
    categoryExists: vi.fn(),
    update: vi.fn(() => ({ set })),
    delete: vi.fn(() => ({ where })),
    set,
    returning,
  };
});

vi.mock("@clerk/nextjs/server", () => ({ auth: mocks.auth }));
vi.mock("next/cache", () => ({ updateTag: mocks.updateTag }));
vi.mock("@/data/categoryExists", () => ({
  categoryExists: mocks.categoryExists,
}));
vi.mock("@/db", () => ({
  db: { update: mocks.update, delete: mocks.delete },
}));

import { deleteTransaction, updateTransaction } from "./actions";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.auth.mockResolvedValue({ userId: "user_1" });
  mocks.categoryExists.mockResolvedValue(true);
  mocks.returning.mockResolvedValue([{ id: 42 }]);
});

describe("updateTransaction", () => {
  const input = {
    id: 42,
    amount: 99,
    transactionDate: format(new Date(), "yyyy-MM-dd"),
    description: "Rent",
    categoryId: 7,
  };

  it("rejects a signed-out user", async () => {
    mocks.auth.mockResolvedValue({ userId: null });

    expect(await updateTransaction(input)).toEqual({
      error: true,
      message: "Unauthorized",
    });
    expect(mocks.update).not.toHaveBeenCalled();
  });

  it("returns the first validation error", async () => {
    expect(await updateTransaction({ ...input, description: "x" })).toEqual({
      error: true,
      message: "Description must be at least 3 characters",
    });
    expect(mocks.update).not.toHaveBeenCalled();
  });

  it("rejects a category that doesn't exist", async () => {
    mocks.categoryExists.mockResolvedValue(false);

    expect(await updateTransaction(input)).toEqual({
      error: true,
      message: "Category not found",
    });
    expect(mocks.update).not.toHaveBeenCalled();
  });

  it("saves the validated values", async () => {
    expect(await updateTransaction(input)).toEqual({ id: 42 });
    expect(mocks.set).toHaveBeenCalledWith({
      amount: "99.00",
      description: "Rent",
      categoryId: 7,
      transactionDate: input.transactionDate,
    });
    expect(mocks.updateTag).toHaveBeenCalledWith("transactions:user_1");
  });

  // Also what another user's transaction looks like, since the update
  // matches on the user id
  it("reports a transaction that wasn't found", async () => {
    mocks.returning.mockResolvedValue([]);

    expect(await updateTransaction(input)).toEqual({
      error: true,
      message: "Transaction not found",
    });
    expect(mocks.updateTag).not.toHaveBeenCalled();
  });
});

describe("deleteTransaction", () => {
  it("rejects a signed-out user", async () => {
    mocks.auth.mockResolvedValue({ userId: null });

    expect(await deleteTransaction(42)).toEqual({
      error: true,
      message: "Unauthorized",
    });
    expect(mocks.delete).not.toHaveBeenCalled();
  });

  it.each([0, -1, 1.5, 2_147_483_648])(
    "rejects invalid id %s without querying",
    async (id) => {
      expect(await deleteTransaction(id)).toEqual({
        error: true,
        message: "Transaction not found",
      });
      expect(mocks.delete).not.toHaveBeenCalled();
    },
  );

  it("deletes the transaction and clears the cache", async () => {
    expect(await deleteTransaction(42)).toEqual({ id: 42 });
    expect(mocks.updateTag).toHaveBeenCalledWith("transactions:user_1");
  });

  it("reports a transaction that wasn't found", async () => {
    mocks.returning.mockResolvedValue([]);

    expect(await deleteTransaction(42)).toEqual({
      error: true,
      message: "Transaction not found",
    });
    expect(mocks.updateTag).not.toHaveBeenCalled();
  });
});
