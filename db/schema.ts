import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const readerOpinions = sqliteTable('reader_opinions', {
  id: text('id').primaryKey(),
  task: text('task').notNull(),
  price: integer('price').notNull(),
  createdAt: integer('created_at').notNull(),
});
