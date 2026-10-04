// Tags for "use cache" entries, so server actions can clear them with updateTag

// Everything derived from one user's transactions
export function transactionsTag(userId: string) {
  return `transactions:${userId}`;
}

export const CATEGORIES_TAG = "categories";
