import { mysqlTable, serial, varchar, text, boolean, timestamp, int, double } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

export const customers = mysqlTable('Customer', {
  id: varchar('id', { length: 191 }).primaryKey(),
  phone: varchar('phone', { length: 191 }).notNull().unique(),
  name: varchar('name', { length: 191 }),
  email: varchar('email', { length: 191 }).unique(),
  role: varchar('role', { length: 191 }).default('user'),
  photo: varchar('photo', { length: 191 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  otp: varchar('otp', { length: 6 }),
  otpExpires: timestamp('otp_expires'),
  isPhoneVerified: boolean('is_phone_verified').default(false),
});

export const addresses = mysqlTable('Address', {
  id: serial('id').primaryKey(),
  street: varchar('street', { length: 191 }).notNull(),
  city: varchar('city', { length: 191 }).notNull(),
  state: varchar('state', { length: 191 }).notNull(),
  pincode: varchar('pincode', { length: 191 }).notNull(),
  country: varchar('country', { length: 191 }).default('India'),
  phone: varchar('phone', { length: 191 }).notNull(),
  customerId: varchar('customer_id', { length: 191 }).notNull(),
});

export const orders = mysqlTable('Order', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('createdAt').defaultNow(),
  amount: double('amount').notNull(),
  status: varchar('status', { length: 191 }).default('PENDING'),
  paymentMethod: varchar('paymentMethod', { length: 191 }).default('PREPAID'),
  shiprocketOrderId: int('shiprocketOrderId'),
  shipmentId: int('shipmentId'),
  awbCode: varchar('awbCode', { length: 191 }),
  customerId: varchar('customer_id', { length: 191 }).notNull(),
});

export const orderItems = mysqlTable('OrderItem', {
  id: serial('id').primaryKey(),
  orderId: int('orderId').notNull(),
  name: varchar('name', { length: 191 }).notNull(),
  sku: varchar('sku', { length: 191 }).notNull(),
  quantity: int('quantity').notNull(),
  price: double('price').notNull(),
});

// Relations
export const customersRelations = relations(customers, ({ many }) => ({
  addresses: many(addresses),
  orders: many(orders),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  customer: one(customers, {
    fields: [addresses.customerId],
    references: [customers.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));
