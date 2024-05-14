import { sql } from "drizzle-orm";
import {
    boolean,
    jsonb,
    pgTableCreator,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

import { PDFSourceIDs, ImageSourceIDs } from "@/lib/types";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
    (name) => `tatanation-pdf-toolkit_${name}`
);

export const images = createTable("images", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 256 }),
    url: varchar("url", { length: 1000 }),
    createdAt: timestamp("created_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    updatedAt: timestamp("updatedAt"),
});

export const pdf_documents = createTable("pdf_documents", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 256 }),
    url: varchar("url", { length: 1000 }),
    is_source: boolean("is_source").notNull().default(false),
    source_data: jsonb("source_data").$type<PDFSourceIDs | ImageSourceIDs>(),
    createdAt: timestamp("created_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    updatedAt: timestamp("updatedAt"),
});
