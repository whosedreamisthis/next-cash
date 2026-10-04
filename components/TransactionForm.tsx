"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
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
import type { Category } from "@/types/Category";

const transactionTypes = TRANSACTION_TYPES.map((type) => ({
  value: type,
  label: type.charAt(0).toUpperCase() + type.slice(1),
}));

interface TransactionFormProps {
  categories: Category[];
  onSubmit: (data: TransactionFormValues) => Promise<void>;
  // Pre-fills the form, e.g. when editing an existing transaction
  defaultValues?: TransactionFormValues;
}
export default function TransactionForm({
  categories,
  onSubmit,
  defaultValues,
}: TransactionFormProps) {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: defaultValues ?? {
      transactionDate: new Date(),
      amount: 0,
      categoryId: 0,
      description: "",
      transactionType: "income",
    },
  });
  const { isSubmitting } = form.formState;

  const transactionType = useWatch({
    control: form.control,
    name: "transactionType",
  });
  const categoryOptions = categories
    .filter((category) => category.type === transactionType)
    .map((category) => ({ value: category.id, label: category.name }));

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Disables every control inside while the submit is in flight */}
      <fieldset disabled={isSubmitting}>
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
                onValueChange={(value) => {
                  field.onChange(value);
                  // The selected category may belong to the other type
                  form.setValue("categoryId", 0);
                }}
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
                items={categoryOptions}
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
                  {categoryOptions.map((category) => (
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
                  field.onChange(
                    parse(e.target.value, "yyyy-MM-dd", new Date()),
                  )
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
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </fieldset>
    </form>
  );
}
