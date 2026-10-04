// Reads an integer search param, falling back when it's missing, not an
// integer, or outside min-max
export function parseSearchParam(
  value: string | string[] | undefined,
  min: number,
  max: number,
  fallback: number,
) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max
    ? parsed
    : fallback;
}
