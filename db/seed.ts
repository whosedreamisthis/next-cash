// Seeds the categories table. Safe to re-run: only missing categories are added.
//   npm run db:seed        -> development branch (.env)
//   npm run db:seed:prod   -> production branch (.env.prod)
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { categoriesTable } from "./schema";

const isProd = process.argv.includes("--prod");
const envFile = isProd ? ".env.prod" : ".env";

const { error } = config({ path: envFile, override: true, quiet: true });
if (error) {
  throw new Error(`${envFile} not found`);
}

const categories: (typeof categoriesTable.$inferInsert)[] = [
  { name: "Salary", type: "income" },
  {name:"Rental Income", type:"income"},
  {name:"Business Income", type:"income"},
  {name:"Investments",type:"income"},

  { name: "Freelance", type: "income" },
  { name: "Groceries", type: "expense" },
  { name: "Rent", type: "expense" },
  { name: "Utilities", type: "expense" },
  { name: "Transport", type: "expense" },
];

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);

  const existing = await db.select().from(categoriesTable);
  const missing = categories.filter(
    (category) =>
      !existing.some(
        (row) => row.name === category.name && row.type === category.type,
      ),
  );

  if (missing.length > 0) {
    await db.insert(categoriesTable).values(missing);
  }

  console.log(
    `Seeded ${isProd ? "production" : "development"}: added ${missing.length}, ` +
      `${categories.length - missing.length} already present`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
