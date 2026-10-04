const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  // $2,500 rather than $2,500.00, but still $12.50
  trailingZeroDisplay: "stripIfInteger",
});

export function formatCurrency(amount: number) {
  return currencyFormatter.format(amount);
}
