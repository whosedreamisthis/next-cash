import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categoriesTable } from "@/db/schema";

export async function categoryExists(id: number) {
  const [category] = await db
    .select({ id: categoriesTable.id })
    .from(categoriesTable)
    .where(eq(categoriesTable.id, id));

  return Boolean(category);
}
