import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const Message = pgTable('messages', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  role: varchar('role', { length: 50 }).notNull(),
  content: varchar('content', { length: 10000 }).notNull(),
  timestamp: integer('timestamp').notNull(),
});

export const ChatCoverage = pgTable('chat_coverage', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  total: integer('total').notNull(),
  covered: integer('covered').notNull(),
  uncovered: integer('uncovered').notNull(),
  coveragePercentage: integer('coverage_percentage').notNull(),
});

export const Metadata = pgTable('metadata', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  key: varchar('key', { length: 255 }).notNull(),
  value: varchar('value', { length: 10000 }).notNull(),
});

export const ChatMemory = pgTable('chat_memory', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  contextSummary: varchar('context_summary', { length: 10000 }).notNull(),
  totalTokens: integer('total_tokens').notNull(),
  chatCoverageId: integer('chat_coverage_id')
    .references(() => ChatCoverage.id)
    .notNull(),
  metadataId: integer('metadata_id')
    .references(() => Metadata.id)
    .notNull(),
});
