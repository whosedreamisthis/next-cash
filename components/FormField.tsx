"use client";

import {
  Controller,
  type Control,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

type FormFieldProps<T extends FieldValues, N extends FieldPath<T>> = {
  control: Control<T>;
  name: N;
  label: string;
  className?: string;
  children: (
    field: ControllerRenderProps<T, N>,
    invalid: boolean,
  ) => React.ReactNode;
};

export default function FormField<
  T extends FieldValues,
  N extends FieldPath<T>,
>({ control, name, label, className, children }: FormFieldProps<T, N>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          {children(field, fieldState.invalid)}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
