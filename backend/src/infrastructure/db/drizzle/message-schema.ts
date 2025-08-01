import { bigint, integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';

export const messageSchema = pgTable('messages', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  role: varchar('role', { length: 50 }).notNull(),
  content: text('content').notNull(),
  timestamp: bigint('timestamp', { mode: 'number' }).notNull(),
  tokensUsed: integer('tokens_used').notNull(),
});
