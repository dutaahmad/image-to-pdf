import { type Config } from "drizzle-kit";

export default {
    schema: "./src/server/db-schema.ts",
    driver: "pg",
    dbCredentials: {
        connectionString: process.env.DATABASE_URL!,
    },
    tablesFilter: ["tatanation-pdf-toolkit_*"],
} satisfies Config;
