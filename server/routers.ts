import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { news, partnerships, transparencyDocuments, memberships, users } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Users (multi-admin)
  users: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      const result = await db
        .select({
          id: users.id,
          openId: users.openId,
          name: users.name,
          email: users.email,
          role: users.role,
          isActive: users.isActive,
          loginMethod: users.loginMethod,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
          lastSignedIn: users.lastSignedIn,
        })
        .from(users)
        .orderBy(desc(users.createdAt));
      return result;
    }),

    create: adminProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().email(),
          password: z.string().min(8),
          role: z.enum(["admin", "user"]).default("admin"),
          isActive: z.boolean().default(true),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const existing = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);
        if (existing.length) {
          throw new TRPCError({ code: "CONFLICT", message: "Já existe um usuário com esse e-mail." });
        }

        const passwordHash = await bcrypt.hash(input.password, 10);
        const openId = `local-${nanoid(24)}`;

        await db.insert(users).values({
          openId,
          name: input.name,
          email: input.email,
          loginMethod: "password",
          passwordHash,
          role: input.role,
          isActive: input.isActive ? 1 : 0,
          lastSignedIn: new Date(),
        });

        return { success: true } as const;
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().min(1).optional(),
          email: z.string().email().optional(),
          password: z.string().min(8).optional(),
          role: z.enum(["admin", "user"]).optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        // Prevent admin from disabling themselves
        if (input.isActive === false && ctx.user?.id === input.id) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Você não pode desativar o próprio usuário." });
        }

        if (input.email) {
          // If email belongs to another user, block.
          const other = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.email, input.email))
            .limit(1);
          if (other.length && other[0].id !== input.id) {
            throw new TRPCError({ code: "CONFLICT", message: "Esse e-mail já está em uso." });
          }
        }

        const { id, password, isActive, ...rest } = input;
        const updateData: any = { ...rest };
        if (typeof isActive === "boolean") updateData.isActive = isActive ? 1 : 0;
        if (password) updateData.passwordHash = await bcrypt.hash(password, 10);

        await db.update(users).set(updateData).where(eq(users.id, id));
        return { success: true } as const;
      }),

    remove: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        if (ctx.user?.id === input.id) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Você não pode remover o próprio usuário." });
        }

        // Soft delete: disable user
        await db.update(users).set({ isActive: 0 }).where(eq(users.id, input.id));
        return { success: true } as const;
      }),
  }),

  // News procedures
  news: router({
    list: publicProcedure.query(async () => {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(news)
    .orderBy(desc(news.published), desc(news.createdAt))
    .limit(10);

  return result;
}),

    getLatest: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return null;
      const result = await db
        .select()
        .from(news)
        .orderBy(desc(news.published))
        .limit(1);
      return result[0] || null;
    }),

    getBySlug: publicProcedure.input(z.string()).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db
        .select()
        .from(news)
        .where(eq(news.slug, input));
      return result[0] || null;
    }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          slug: z.string().min(1),
          content: z.string().min(1),
          excerpt: z.string().optional(),
          coverImage: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const result = await db.insert(news).values({
          ...input,
          published: new Date(),
          createdBy: ctx.user.id,
        });
        return result;
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          slug: z.string().optional(),
          content: z.string().optional(),
          excerpt: z.string().optional(),
          coverImage: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const { id, ...data } = input;
        const result = await db.update(news).set(data).where(eq(news.id, id));
        return result;
      }),

    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const result = await db.delete(news).where(eq(news.id, input));
        return result;
      }),
  }),

  // Partnerships procedures
  partnerships: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      const result = await db
        .select()
        .from(partnerships)
        .orderBy(partnerships.order);
      return result;
    }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          description: z.string().optional(),
          logo: z.string().optional(),
          website: z.string().optional(),
          category: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const result = await db.insert(partnerships).values({
          ...input,
          active: new Date(),
        });
        return result;
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          logo: z.string().optional(),
          website: z.string().optional(),
          category: z.string().optional(),
          order: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const { id, ...data } = input;
        const result = await db
          .update(partnerships)
          .set(data)
          .where(eq(partnerships.id, id));
        return result;
      }),

    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const result = await db
          .delete(partnerships)
          .where(eq(partnerships.id, input));
        return result;
      }),
  }),

  // Transparency Documents procedures
  transparencyDocuments: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      const result = await db
        .select()
        .from(transparencyDocuments)
        .orderBy(desc(transparencyDocuments.year));
      return result;
    }),

    listByCategory: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        const result = await db
          .select()
          .from(transparencyDocuments)
          .where(eq(transparencyDocuments.category, input))
          .orderBy(desc(transparencyDocuments.year));
        return result;
      }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
          category: z.string().min(1),
          fileUrl: z.string().min(1),
          fileName: z.string().optional(),
          year: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const result = await db.insert(transparencyDocuments).values(input);
        return result;
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          description: z.string().optional(),
          category: z.string().optional(),
          fileUrl: z.string().optional(),
          fileName: z.string().optional(),
          year: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const { id, ...data } = input;
        const result = await db
          .update(transparencyDocuments)
          .set(data)
          .where(eq(transparencyDocuments.id, id));
        return result;
      }),

    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const result = await db
          .delete(transparencyDocuments)
          .where(eq(transparencyDocuments.id, input));
        return result;
      }),
  }),

  // Memberships procedures
  memberships: router({
    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().email(),
          phone: z.string().optional(),
          cpf: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const result = await db.insert(memberships).values({
          ...input,
          status: "pending",
        });
        return result;
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const db = await getDb();
      if (!db) return [];
      const result = await db.select().from(memberships);
      return result;
    }),

    updateStatus: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "approved", "rejected"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const result = await db
          .update(memberships)
          .set({ status: input.status })
          .where(eq(memberships.id, input.id));
        return result;
      }),
  }),
});

export type AppRouter = typeof appRouter;
