import { mysqlTable, varchar, boolean, timestamp } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { addresses } from './addresses';
import { orders } from './orders';

export const customers = mysqlTable('Customer', {
  id: varchar('id', { length: 191 }).primaryKey(),
  phone: varchar('phone', { length: 191 }).notNull().unique(),
  name: varchar('name', { length: 191 }),
  email: varchar('email', { length: 191 }).unique(),
  otp: varchar('otp', { length: 6 }), // For storing OTP
  otpExpires: timestamp('otp_expires'), // OTP expiration time
  isPhoneVerified: boolean('is_phone_verified').default(false), // Track verification
  role: varchar('role', { length: 191 }).default('user'),
  photo: varchar('photo', { length: 191 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const customersRelations = relations(customers, ({ many }) => ({
  addresses: many(addresses),
  orders: many(orders),
}));