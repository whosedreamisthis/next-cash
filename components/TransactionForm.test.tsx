import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Category } from "@/types/Category";
import TransactionForm from "./TransactionForm";

const categories: Category[] = [
  { id: 1, name: "Salary", type: "income" },
  { id: 2, name: "Freelance", type: "income" },
  { id: 3, name: "Groceries", type: "expense" },
];

const defaultValues = {
  transactionType: "expense" as const,
  categoryId: 3,
  transactionDate: new Date(2026, 9, 1),
  amount: 84.2,
  description: "Weekly shop",
};

describe("TransactionForm", () => {
  it("pre-fills the fields from the default values", () => {
    render(
      <TransactionForm
        categories={categories}
        onSubmit={vi.fn()}
        defaultValues={defaultValues}
      />,
    );

    expect(screen.getByLabelText("Description")).toHaveValue("Weekly shop");
    expect(screen.getByLabelText("Amount")).toHaveValue(84.2);
    expect(screen.getByLabelText("Transaction Date")).toHaveValue(
      "2026-10-01",
    );
  });

  it("submits the values", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <TransactionForm
        categories={categories}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
      />,
    );

    const description = screen.getByLabelText("Description");
    await userEvent.clear(description);
    await userEvent.type(description, "Big shop");
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect(onSubmit.mock.calls[0][0]).toEqual({
      ...defaultValues,
      description: "Big shop",
    });
  });

  it("shows validation errors and doesn't submit an empty form", async () => {
    const onSubmit = vi.fn();
    render(<TransactionForm categories={categories} onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(
      await screen.findByText("Please select a category"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Amount must be greater than 0"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Description must be at least 3 characters"),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
