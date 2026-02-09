import { pgTable, uuid, text, varchar, timestamp } from 'drizzle-orm/pg-core';

export const links = pgTable('links', {
  id: uuid('id').primaryKey().defaultRandom(),
  shortCode: varchar('short_code', { length: 10 }).notNull().unique(),
  originalUrl: text('original_url').notNull(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow().$onUpdate(() => new Date().toISOString()),
});
