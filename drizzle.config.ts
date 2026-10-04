// Development: generates migrations and applies them to the Neon development
// branch configured in .env
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env", quiet: true });

const url = process.env.DATABASE_URL_UNPOOLED;
if (!url) {
  throw new Error("DATABASE_URL_UNPOOLED is not set in .env");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url },
});
