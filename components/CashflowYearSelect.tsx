"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const YEARS_SHOWN = 10;

export default function CashflowYearSelect({ year }: { year: number }) {
  const router = useRouter();

  const currentYear = new Date().getFullYear();
  // Also reach back far enough to include a year that came from the URL
  const yearCount = Math.max(YEARS_SHOWN, currentYear - year + 1);
  const years = Array.from({ length: yearCount }, (_, i) => {
    const value = currentYear - i;
    return { value, label: String(value) };
  });

  return (
    <Select
      items={years}
      value={year}
      onValueChange={(value) =>
        value && router.push(`/dashboard?year=${value}`)
      }
    >
      <SelectTrigger aria-label="Cashflow year">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map((y) => (
          <SelectItem key={y.value} value={y.value}>
            {y.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
