"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format, isValid, parse } from "date-fns";
import FormField from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TRANSACTION_TYPES,
  transactionFormSchema,
  type TransactionFormValues,
} from "@/lib/schemas/transaction";

const transactionTypes = TRANSACTION_TYPES.map((type) => ({
  value: type,
  label: type.charAt(0).toUpperCase() + type.slice(1),
}));

// TODO: replace with the real categories
const categories = [
  { value: 1, label: "Category 1" },
  { value: 2, label: "Category 2" },
  { value: 3, label: "Category 3" },
  { value: 4, label: "Category 4" },
];

export default function TransactionForm() {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      transactionDate: new Date(),
      amount: 0,
      categoryId: 0,
      description: "",
      transactionType: "income",
    },
  });

  const handleSubmit = async (data: TransactionFormValues) => {
    // TODO: save the transaction
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup className="grid grid-cols-2 gap-y-5 gap-x-4">
        <FormField
          control={form.control}
          name="transactionType"
          label="Transaction Type"
        >
          {(field, invalid) => (
            <Select
              name={field.name}
              items={transactionTypes}
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                id={field.name}
                className="w-full"
                onBlur={field.onBlur}
                aria-invalid={invalid}
              >
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                {transactionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>
        <FormField control={form.control} name="categoryId" label="Category">
          {(field, invalid) => (
            <Select
              name={field.name}
              items={categories}
              value={field.value || null}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                id={field.name}
                className="w-full"
                onBlur={field.onBlur}
                aria-invalid={invalid}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>
        <FormField
          control={form.control}
          name="transactionDate"
          label="Transaction Date"
        >
          {(field, invalid) => (
            <Input
              {...field}
              id={field.name}
              type="date"
              max={format(new Date(), "yyyy-MM-dd")}
              value={
                isValid(field.value) ? format(field.value, "yyyy-MM-dd") : ""
              }
              onChange={(e) =>
                field.onChange(parse(e.target.value, "yyyy-MM-dd", new Date()))
              }
              aria-invalid={invalid}
            />
          )}
        </FormField>
        <FormField control={form.control} name="amount" label="Amount">
          {(field, invalid) => (
            <Input
              {...field}
              id={field.name}
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              aria-invalid={invalid}
            />
          )}
        </FormField>
        <FormField
          control={form.control}
          name="description"
          label="Description"
          className="col-span-2"
        >
          {(field, invalid) => (
            <Input
              {...field}
              id={field.name}
              placeholder="e.g. Groceries"
              autoComplete="off"
              aria-invalid={invalid}
            />
          )}
        </FormField>
      </FieldGroup>
      <Button type="submit" className="mt-5 w-full">
        Submit
      </Button>
    </form>
  );
}
