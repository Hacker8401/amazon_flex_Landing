import { pgTable, serial, varchar, timestamp, text } from "drizzle-orm/pg-core";

/**
 * Leads table for Amazon Flex applications.
 * Stores all lead submissions from the landing page.
 */
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  vehicleType: varchar("vehicle_type", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;
