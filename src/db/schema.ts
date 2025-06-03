import { pgTable, timestamp, varchar, uuid } from "drizzle-orm/pg-core"


export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    email: varchar("email", { length: 256 }).unique().notNull(),
    hashedPassword: varchar("hashed_password", { length: 256 })
      .notNull()
      .default("unset"),
  })
  
  export type NewUser = typeof users.$inferInsert