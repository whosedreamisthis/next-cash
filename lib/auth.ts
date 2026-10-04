import "server-only";
import { auth } from "@clerk/nextjs/server";
import { cacheLife } from "next/cache";
import { redirect } from "next/navigation";

// Returns the signed-in user's id, or sends them to sign in.
// "use cache: private" keeps the result in the browser only (never in a
// server cache), which lets the client reuse pages that depend on the user
// for the stale time instead of refetching them on every visit.
export async function getUserId() {
  "use cache: private";
  cacheLife({ stale: 300 });

  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return userId;
}
