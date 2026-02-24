import {
  mysqlTable,
  varchar,
  text,
  boolean,
  timestamp,
  int,
  double,
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// ─── Customers ────────────────────────────────────────────────────────────────
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

// ─── Addresses ────────────────────────────────────────────────────────────────
export const addresses = mysqlTable('Address', {
  id: varchar('id', { length: 191 }).primaryKey(),
  name: varchar('name', { length: 191 }),              // ✅ added: needed for billing_customer_name
  street: varchar('street', { length: 191 }).notNull(),
  city: varchar('city', { length: 191 }).notNull(),
  state: varchar('state', { length: 191 }).notNull(),
  pincode: varchar('pincode', { length: 191 }).notNull(),
  country: varchar('country', { length: 191 }).default('India'),
  phone: varchar('phone', { length: 191 }).notNull(),
  customerId: varchar('customer_id', { length: 191 }).notNull(),
});

// ─── Orders ───────────────────────────────────────────────────────────────────
export const orders = mysqlTable('Order', {
  id: varchar('id', { length: 191 }).primaryKey(),
  createdAt: timestamp('createdAt').defaultNow(),
  amount: double('amount').notNull(),
  status: varchar('status', { length: 191 }).default('PENDING'),
  paymentMethod: varchar('paymentMethod', { length: 191 }).default('PREPAID'),

  // ✅ fixed: changed from int to varchar — Shiprocket IDs can exceed int range
  shiprocketOrderId: varchar('shiprocketOrderId', { length: 50 }),
  shipmentId: varchar('shipmentId', { length: 50 }),

  awbCode: varchar('awbCode', { length: 191 }),
  customerId: varchar('customer_id', { length: 191 }).notNull(),

  // ✅ added: link to Address so billing details can be pulled for Shiprocket
  addressId: varchar('address_id', { length: 191 }).notNull(),
});

// ─── Order Items ──────────────────────────────────────────────────────────────
export const orderItems = mysqlTable('OrderItem', {
  id: varchar('id', { length: 191 }).primaryKey(),

  // ✅ fixed: was int — must be varchar to match Order.id (varchar)
  orderId: varchar('orderId', { length: 191 }).notNull(),

  name: varchar('name', { length: 191 }).notNull(),
  sku: varchar('sku', { length: 191 }).notNull(),
  quantity: int('quantity').notNull(),
  price: double('price').notNull(),
});

// ─── Relations ────────────────────────────────────────────────────────────────
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
  // ✅ added: relation to Address
  address: one(addresses, {
    fields: [orders.addressId],
    references: [addresses.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));