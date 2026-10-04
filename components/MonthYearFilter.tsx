"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const months = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: format(new Date(2000, i, 1), "MMM"),
}));

const YEARS_SHOWN = 10;

export default function MonthYearFilter({
  month: initialMonth,
  year: initialYear,
}: {
  month: number;
  year: number;
}) {
  const router = useRouter();
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);

  const currentYear = new Date().getFullYear();
  // Also reach back far enough to include a year that came from the URL
  const yearCount = Math.max(YEARS_SHOWN, currentYear - initialYear + 1);
  const years = Array.from({ length: yearCount }, (_, i) => {
    const value = currentYear - i;
    return { value, label: String(value) };
  });

  return (
    <div className="flex gap-1">
      <Select
        items={months}
        value={month}
        onValueChange={(value) => value && setMonth(value)}
      >
        <SelectTrigger aria-label="Month">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {months.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        items={years}
        value={year}
        onValueChange={(value) => value && setYear(value)}
      >
        <SelectTrigger aria-label="Year">
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
      <Button
        onClick={() =>
          router.push(`/dashboard/transactions?month=${month}&year=${year}`)
        }
      >
        Go
      </Button>
    </div>
  );
}
