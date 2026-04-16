import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Notícias
export const news = mysqlTable("news", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  coverImage: text("coverImage"),
  published: timestamp("published"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  createdBy: int("createdBy").references(() => users.id),
});

export type News = typeof news.$inferSelect;
export type InsertNews = typeof news.$inferInsert;

// Convênios e Parceiros
export const partnerships = mysqlTable("partnerships", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  logo: text("logo"),
  website: varchar("website", { length: 255 }),
  category: varchar("category", { length: 100 }),
  order: int("order").default(0),
  active: timestamp("active"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Partnership = typeof partnerships.$inferSelect;
export type InsertPartnership = typeof partnerships.$inferInsert;

// Documentos de Transparência
export const transparencyDocuments = mysqlTable("transparencyDocuments", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileName: varchar("fileName", { length: 255 }),
  year: int("year"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TransparencyDocument = typeof transparencyDocuments.$inferSelect;
export type InsertTransparencyDocument = typeof transparencyDocuments.$inferInsert;

// Filiações
export const memberships = mysqlTable("memberships", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  cpf: varchar("cpf", { length: 20 }),
  professionalRegistration: varchar("professionalRegistration", { length: 100 }),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "active", "inactive"]).default("pending"),
  // Campos de carteirinha digital
  membershipCode: varchar("membershipCode", { length: 50 }).unique(), // Código único (ex: SINDAFIS-2026-00001)
  qrCodeUrl: text("qrCodeUrl"), // URL da imagem do QR Code
  approvedAt: timestamp("approvedAt"), // Data de aprovação
  expiresAt: timestamp("expiresAt"), // Data de expiração (opcional)
  photoUrl: text("photoUrl"), // Foto do filiado (opcional)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Membership = typeof memberships.$inferSelect;
export type InsertMembership = typeof memberships.$inferInsert;

// Validações de Carteirinha (histórico de validações)
export const membershipValidations = mysqlTable("membershipValidations", {
  id: int("id").autoincrement().primaryKey(),
  membershipId: int("membershipId").notNull().references(() => memberships.id),
  membershipCode: varchar("membershipCode", { length: 50 }).notNull(),
  validatedAt: timestamp("validatedAt").defaultNow().notNull(),
  validatedBy: varchar("validatedBy", { length: 255 }), // Nome da empresa/parceiro
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
});

export type MembershipValidation = typeof membershipValidations.$inferSelect;
export type InsertMembershipValidation = typeof membershipValidations.$inferInsert;
