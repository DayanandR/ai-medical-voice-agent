// config/schema.tsx - Complete schema with paymentsTable
import {
  integer,
  json,
  jsonb,
  pgTable,
  text,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer().default(5), // ✅ Add default for free tier
  // subscription fields
  phone: varchar({ length: 15 }),
  subscriptionStatus: varchar({ length: 50 }).default("free"),
  subscriptionPlan: varchar({ length: 50 }).default("free"), // ✅ Add default
  subscriptionExpiresAt: timestamp(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

export const subscriptionsTable = pgTable("subscriptions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().references(() => usersTable.id),
  userEmail: varchar().references(() => usersTable.email),
  planType: varchar({ length: 50 }).notNull(),
  amount: integer().notNull(),
  status: varchar({ length: 50 }).default("pending"),
  paymentMethod: varchar({ length: 50 }).default("upi"),
  paymentProof: text(),
  transactionNote: varchar({ length: 255 }),
  createdAt: timestamp().defaultNow(),
  expiresAt: timestamp(),
  activatedAt: timestamp(),
});

// ✅ ADD THIS: PaymentsTable for UPI QR code system
// config/schema.tsx - Add userEmail to paymentsTable
export const paymentsTable = pgTable("payments", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  paymentId: varchar({ length: 100 }).notNull().unique(),
  phone: varchar({ length: 15 }).notNull(),
  userEmail: varchar({ length: 255 }).notNull(), // ✅ Add this field
  planId: varchar({ length: 50 }).notNull(),
  planName: varchar({ length: 100 }),
  amount: integer().notNull(),
  paymentProofPath: text(),
  transactionNote: varchar({ length: 255 }),
  status: varchar({ length: 50 }).default("pending"),
  createdAt: timestamp().defaultNow(),
  verifiedAt: timestamp(),
  verifiedBy: varchar({ length: 100 }),
  rejectionReason: text(),
  notes: text(),
  upiTransactionId: varchar({ length: 100 }),
  paymentApp: varchar({ length: 50 }),
});

export const sessionChatTable = pgTable("sessionchattable", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sessionId: varchar().notNull(),
  notes: text(),
  selectedDoctor: jsonb("selectedDoctor"),
  report: json(),
  conversation: json(),
  createdBy: varchar().references(() => usersTable.email),
  createdOn: timestamp(),
});

// ✅ OPTIONAL: Payment audit log for tracking all payment events
export const paymentAuditTable = pgTable("payment_audit", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  paymentId: integer().references(() => paymentsTable.id),
  event: varchar({ length: 100 }).notNull(),
  oldStatus: varchar({ length: 50 }),
  newStatus: varchar({ length: 50 }),
  eventData: jsonb(),
  createdAt: timestamp().defaultNow(),
  adminUser: varchar({ length: 100 }),
  ipAddress: varchar({ length: 45 }),
  userAgent: text(),
});
