import { describe, expect, it } from "vitest";
import { parseSearchParam } from "./parseSearchParam";

describe("parseSearchParam", () => {
  it("returns the value when it's an integer in range", () => {
    expect(parseSearchParam("7", 1, 12, 1)).toBe(7);
  });

  it("accepts the range bounds", () => {
    expect(parseSearchParam("1", 1, 12, 5)).toBe(1);
    expect(parseSearchParam("12", 1, 12, 5)).toBe(12);
  });

  it.each([
    ["missing", undefined],
    ["empty", ""],
    ["not a number", "abc"],
    ["a decimal", "3.5"],
    ["below the range", "0"],
    ["above the range", "13"],
    ["repeated", ["3", "4"]],
  ])("falls back when the value is %s", (_, value) => {
    expect(parseSearchParam(value, 1, 12, 5)).toBe(5);
  });
});
