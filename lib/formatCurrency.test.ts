import { describe, expect, it } from "vitest";
import { formatCurrency } from "./formatCurrency";

describe("formatCurrency", () => {
  it("drops the cents from whole amounts", () => {
    expect(formatCurrency(2500)).toBe("$2,500");
  });

  it("keeps the cents otherwise", () => {
    expect(formatCurrency(12.5)).toBe("$12.50");
  });

  it("formats negative amounts", () => {
    expect(formatCurrency(-40)).toBe("-$40");
  });
});
