import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DeleteTransactionButton from "./DeleteTransactionButton";

const mocks = vi.hoisted(() => ({
  deleteTransaction: vi.fn(),
  push: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("@/app/dashboard/transactions/[transactionId]/actions", () => ({
  deleteTransaction: mocks.deleteTransaction,
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push }),
}));
vi.mock("sonner", () => ({
  toast: { success: mocks.toastSuccess, error: mocks.toastError },
}));

async function confirmDelete() {
  render(
    <DeleteTransactionButton
      transactionId={42}
      transactionDate={new Date(2026, 9, 4)}
    />,
  );

  await userEvent.click(
    screen.getByRole("button", { name: "Delete transaction" }),
  );
  await userEvent.click(await screen.findByRole("button", { name: "Delete" }));
}

describe("DeleteTransactionButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("asks for confirmation before deleting", async () => {
    render(
      <DeleteTransactionButton
        transactionId={42}
        transactionDate={new Date(2026, 9, 4)}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Delete transaction" }),
    );

    expect(
      await screen.findByText("Delete this transaction?"),
    ).toBeInTheDocument();
    expect(mocks.deleteTransaction).not.toHaveBeenCalled();
  });

  it("deletes and returns to the transaction's month", async () => {
    mocks.deleteTransaction.mockResolvedValue({ id: 42 });

    await confirmDelete();

    await waitFor(() =>
      expect(mocks.push).toHaveBeenCalledWith(
        "/dashboard/transactions?month=10&year=2026",
      ),
    );
    expect(mocks.deleteTransaction).toHaveBeenCalledWith(42);
    expect(mocks.toastSuccess).toHaveBeenCalled();
  });

  it("shows the error and stays on the page when deleting fails", async () => {
    mocks.deleteTransaction.mockResolvedValue({
      error: true,
      message: "Transaction not found",
    });

    await confirmDelete();

    await waitFor(() =>
      expect(mocks.toastError).toHaveBeenCalledWith(
        "ERROR",
        expect.objectContaining({ description: "Transaction not found" }),
      ),
    );
    expect(mocks.push).not.toHaveBeenCalled();
  });
});
