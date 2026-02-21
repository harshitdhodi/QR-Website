import { mysqlTable, int, varchar, double } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { orders } from './orders';

export const orderItems = mysqlTable('OrderItem', {
  id: varchar('id', { length: 36 }).primaryKey(),
  orderId: varchar('orderId', { length: 36 }).notNull(),
  name: varchar('name', { length: 191 }).notNull(),
  sku: varchar('sku', { length: 191 }).notNull(),
  quantity: int('quantity').notNull(),
  price: double('price').notNull(),
});

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));