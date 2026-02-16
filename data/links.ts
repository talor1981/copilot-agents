import db from "@/db";
import { links } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function createLink(data: {
  shortCode: string;
  originalUrl: string;
  userId: string;
}) {
  const [link] = await db
    .insert(links)
    .values(data)
    .returning();
  
  return link;
}

export async function getLinksByUserId(userId: string) {
  return db.query.links.findMany({
    where: eq(links.userId, userId),
    orderBy: (links, { desc }) => [desc(links.createdAt)],
  });
}

export async function getLinkByShortCode(shortCode: string) {
  return db.query.links.findFirst({
    where: eq(links.shortCode, shortCode),
  });
}

export async function deleteLink(linkId: string, userId: string) {
  await db
    .delete(links)
    .where(
      and(
        eq(links.id, linkId),
        eq(links.userId, userId)
      )
    );
}
