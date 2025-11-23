import { createEnv } from "@t3-oss/env-nextjs";
import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: "./.env.local" });

export const env = () => {
  return createEnv({
    server: {
      DATABASE_URL: z.url(),
    },
    runtimeEnv: {
      DATABASE_URL: process.env.DATABASE_URL,
    },
  });
};
