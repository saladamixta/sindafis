import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { verifySessionToken } from "./auth";
import { COOKIE_NAME } from "@shared/const";
import { parse as parseCookies } from "cookie";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    const cookieHeader = opts.req.headers.cookie;
    const cookies = cookieHeader ? parseCookies(cookieHeader) : {};
    const sessionToken = cookies[COOKIE_NAME];
    const session = await verifySessionToken(sessionToken);

    if (session?.openId) {
      const db = await getDb();
      if (db) {
        const result = await db.select().from(users).where(eq(users.openId, session.openId)).limit(1);
        user = result[0] ?? null;
      }
    }
  } catch {
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
