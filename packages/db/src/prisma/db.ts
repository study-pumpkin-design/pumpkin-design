import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client";
import type { Moderator } from "./generated/client";

const connectionString = process.env["DATABASE_URL"];

if (connectionString == null) {
  throw new Error("DATABASE_URL is not configured");
}

const adapter = new PrismaPg({ connectionString });

export const db = new PrismaClient({ adapter });

export type typeMap = {
  admin: Moderator;
};
