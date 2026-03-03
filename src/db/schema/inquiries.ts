import { mysqlTable, int, varchar, text, timestamp } from 'drizzle-orm/mysql-core';

export const inquiries = mysqlTable('inquiries', {
    id: int('id').primaryKey().autoincrement(),
    firstName: varchar('first_name', { length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 50 }),
    message: text('message').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});
