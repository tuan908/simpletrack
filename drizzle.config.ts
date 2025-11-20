import { env } from "@/core/config/env";
import type { Config } from "drizzle-kit";

const { DATABASE_URL } = env();

const config: Config = {
  schema: "./src/infra/db/schema/*",
  out: "./src/infra/db/migrations",
  dialect: "postgresql",
  dbCredentials: { url: DATABASE_URL },
};
export default config;
