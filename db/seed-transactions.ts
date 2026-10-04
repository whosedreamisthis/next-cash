// Seeds sample transactions for one user over the last 12 months.
// Development only. Re-running adds another set, it doesn't replace the first.
//   npm run db:seed:transactions -- <clerk user id>
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { addDays, format, isAfter, startOfMonth, subMonths } from "date-fns";
import { categoriesTable, transactionsTable } from "./schema";

const { error } = config({ path: ".env", override: true, quiet: true });
if (error) {
  throw new Error(".env not found");
}

const userId = process.argv[2];
if (!userId?.startsWith("user_")) {
  throw new Error(
    "Pass the Clerk user id, e.g. npm run db:seed:transactions -- user_123",
  );
}

const MONTHS = 12;

// Seeded so every run produces the same data
let seed = 42;
function random() {
  seed = (seed * 1664525 + 1013904223) % 2 ** 32;
  return seed / 2 ** 32;
}
function between(min: number, max: number) {
  return Math.round((min + random() * (max - min)) * 100) / 100;
}
function pick<T>(items: T[]) {
  return items[Math.floor(random() * items.length)];
}

// [category name, chance per month, occurrences per month, amount range, descriptions]
const templates: [
  string,
  number,
  [number, number],
  [number, number],
  string[],
][] = [
  ["Salary", 1, [1, 1], [3200, 3200], ["Monthly salary"]],
  ["Rental Income", 1, [1, 1], [950, 950], ["Flat rent received"]],
  [
    "Freelance",
    0.5,
    [1, 2],
    [150, 900],
    ["Website project", "Logo design", "Consulting call"],
  ],
  [
    "Investments",
    0.35,
    [1, 1],
    [20, 250],
    ["Dividend payout", "Interest earned"],
  ],
  [
    "Business Income",
    0.25,
    [1, 1],
    [300, 1500],
    ["Online store sales", "Workshop tickets"],
  ],
  ["Rent", 1, [1, 1], [1400, 1400], ["Apartment rent"]],
  [
    "Utilities",
    1,
    [2, 3],
    [35, 140],
    ["Electricity bill", "Water bill", "Internet", "Phone bill"],
  ],
  [
    "Groceries",
    1,
    [3, 6],
    [25, 160],
    ["Supermarket shop", "Farmers market", "Weekly groceries", "Corner store"],
  ],
  [
    "Transport",
    1,
    [2, 4],
    [3, 70],
    ["Fuel", "Train ticket", "Bus pass", "Taxi", "Parking"],
  ],
];

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
  const categories = await db.select().from(categoriesTable);
  const today = new Date();
  const rows: (typeof transactionsTable.$inferInsert)[] = [];

  for (let m = 0; m < MONTHS; m++) {
    const monthStart = startOfMonth(subMonths(today, m));

    for (const [
      name,
      chance,
      [minCount, maxCount],
      [min, max],
      descriptions,
    ] of templates) {
      const category = categories.find((c) => c.name === name);
      if (!category || random() > chance) continue;

      const count = minCount + Math.floor(random() * (maxCount - minCount + 1));
      for (let i = 0; i < count; i++) {
        const date = addDays(monthStart, Math.floor(random() * 28));
        // Never create transactions in the future
        if (isAfter(date, today)) continue;

        rows.push({
          userId,
          categoryId: category.id,
          description: pick(descriptions),
          amount: between(min, max).toFixed(2),
          transactionDate: format(date, "yyyy-MM-dd"),
        });
      }
    }
  }

  await db.insert(transactionsTable).values(rows);
  console.log(
    `Seeded development: added ${rows.length} transactions for ${userId}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
