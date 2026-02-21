import { mysqlTable, int, varchar, timestamp, double } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { customers } from './customers';
import { orderItems } from './order-items';

export const orders = mysqlTable('Order', {
  id: varchar('id', { length: 36 }).primaryKey(), // Fixed order
  createdAt: timestamp('createdAt').defaultNow(),
  amount: double('amount').notNull(),
  status: varchar('status', { length: 191 }).default('PENDING'),
  paymentMethod: varchar('paymentMethod', { length: 191 }).default('PREPAID'),
  shiprocketOrderId: int('shiprocketOrderId'),
  shipmentId: int('shipmentId'),
  awbCode: varchar('awbCode', { length: 191 }),
  customerId: varchar('customer_id', { length: 191 }).notNull(),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  items: many(orderItems),
}));