import "server-only";
import { asc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { categoriesTable } from "@/db/schema";
import { CATEGORIES_TAG } from "@/lib/cacheTags";

// Categories only change through the seed script, so they're cached for days
export async function getCategories() {
  "use cache";
  cacheTag(CATEGORIES_TAG);
  cacheLife("days");

  return db.select().from(categoriesTable).orderBy(asc(categoriesTable.name));
}
