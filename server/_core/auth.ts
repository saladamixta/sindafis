import { SignJWT, jwtVerify } from "jose";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Request, Response } from "express";
import { getSessionCookieOptions } from "./cookies";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "sindafis2025";

function getSecret() {
  const secret = process.env.SESSION_SECRET ?? "sindafis-secret-key-change-in-production";
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(openId: string, name: string): Promise<string> {
  return new SignJWT({ openId, name, appId: "sindafis" })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(Math.floor((Date.now() + ONE_YEAR_MS) / 1000))
    .sign(getSecret());
}

export async function verifySessionToken(token: string | undefined | null) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    return payload as { openId: string; name: string; appId: string };
  } catch {
    return null;
  }
}

export function registerAuthRoutes(app: import("express").Express) {
  // Login page
  app.get("/admin/login", (_req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SINDAFIS - Login Administrativo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #F5F6F7; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { background: white; border-radius: 12px; padding: 40px; width: 100%; max-width: 400px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .logo { text-align: center; margin-bottom: 32px; }
    .logo h1 { color: #0B5D3B; font-size: 28px; font-weight: 700; }
    .logo p { color: #6B7280; font-size: 13px; margin-top: 4px; }
    label { display: block; font-size: 14px; font-weight: 500; color: #1F2937; margin-bottom: 6px; }
    input { width: 100%; padding: 10px 14px; border: 1px solid #E4E6E8; border-radius: 8px; font-size: 14px; outline: none; transition: border-color 0.2s; }
    input:focus { border-color: #0B5D3B; }
    .field { margin-bottom: 20px; }
    button { width: 100%; background: #0B5D3B; color: white; border: none; padding: 12px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
    button:hover { background: #06402A; }
    .error { background: #FEE2E2; color: #DC2626; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">
      <h1>SINDAFIS</h1>
      <p>Painel Administrativo</p>
    </div>
    ${_req.query.error ? '<div class="error">Usuário ou senha incorretos.</div>' : ''}
    <form method="POST" action="/api/auth/login">
      <div class="field">
        <label>Usuário</label>
        <input type="text" name="username" placeholder="Digite seu usuário" required autofocus />
      </div>
      <div class="field">
        <label>Senha</label>
        <input type="password" name="password" placeholder="Digite sua senha" required />
      </div>
      <button type="submit">Entrar</button>
    </form>
  </div>
</body>
</html>`);
  });

  // Login POST
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      res.redirect("/admin/login?error=1");
      return;
    }

    try {
      const db = await getDb();
      if (db) {
        // Upsert admin user
        const existing = await db.select().from(users).where(eq(users.openId, "admin-local")).limit(1);
        if (existing.length === 0) {
          await db.insert(users).values({
            openId: "admin-local",
            name: "Administrador",
            email: null,
            loginMethod: "password",
            role: "admin",
          });
        }
      }

      const token = await createSessionToken("admin-local", "Administrador");
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect("/admin");
    } catch (error) {
      console.error("[Auth] Login error:", error);
      res.redirect("/admin/login?error=1");
    }
  });

  // Logout
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, cookieOptions);
    res.redirect("/admin/login");
  });

  // Legacy OAuth callback redirect (graceful fallback)
  app.get("/api/oauth/callback", (_req, res) => {
    res.redirect("/admin/login");
  });
}
