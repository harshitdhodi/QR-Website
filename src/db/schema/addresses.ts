import { mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { customers } from './customers';

export const addresses = mysqlTable('Address', {
  id: varchar('id', { length: 36 }).primaryKey(),
  street: varchar('street', { length: 191 }).notNull(),
  city: varchar('city', { length: 191 }).notNull(),
  state: varchar('state', { length: 191 }).notNull(),
  pincode: varchar('pincode', { length: 191 }).notNull(),
  country: varchar('country', { length: 191 }).default('India'),
  phone: varchar('phone', { length: 191 }).notNull(),
  customerId: varchar('customer_id', { length: 191 }).notNull(),
});

export const addressesRelations = relations(addresses, ({ one }) => ({
  customer: one(customers, {
    fields: [addresses.customerId],
    references: [customers.id],
  }),
}));