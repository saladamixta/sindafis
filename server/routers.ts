import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { news, partnerships, transparencyDocuments, memberships, membershipValidations } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

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

    listFeed: publicProcedure
      .input(
        z.object({
          limit: z.number().min(1).max(24).default(6),
          offset: z.number().min(0).default(0),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) {
          return {
            items: [],
            nextOffset: null,
            hasMore: false,
          };
        }

        const rows = await db
          .select()
          .from(news)
          .orderBy(desc(news.published), desc(news.createdAt))
          .limit(input.limit + 1)
          .offset(input.offset);

        const hasMore = rows.length > input.limit;
        const items = hasMore ? rows.slice(0, input.limit) : rows;

        return {
          items,
          nextOffset: hasMore ? input.offset + input.limit : null,
          hasMore,
        };
      }),

    getLatest: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return null;
      const result = await db
        .select()
        .from(news)
        .orderBy(desc(news.published), desc(news.createdAt))
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
          createdBy: ctx.user.id,
          published: new Date(),
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
          professionalRegistration: z.string().optional(),
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
          status: z.enum(["pending", "approved", "rejected", "active", "inactive"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const updateData: any = { status: input.status };
        if (input.status === "active") {
          updateData.approvedAt = new Date();
        }

        const result = await db
          .update(memberships)
          .set(updateData)
          .where(eq(memberships.id, input.id));
        return result;
      }),

    // Gerar código único e QR Code para carteirinha
    generateMembershipCard: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        // Buscar filiado
        const member = await db
          .select()
          .from(memberships)
          .where(eq(memberships.id, input.id))
          .limit(1);

        if (!member || member.length === 0) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Filiado não encontrado" });
        }

        // Gerar código único (ex: SINDAFIS-2026-00001)
        const year = new Date().getFullYear();
        const randomId = String(input.id).padStart(5, "0");
        const membershipCode = `SINDAFIS-${year}-${randomId}`;

        // Gerar URL do QR Code usando API pública
        const qrCodeData = encodeURIComponent(
          `${process.env.VITE_FRONTEND_FORGE_API_URL || "https://sindafis.manus.space"}/validate/${membershipCode}`
        );
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrCodeData}`;

        // Atualizar filiado com código e QR Code
        const result = await db
          .update(memberships)
          .set({
            membershipCode,
            qrCodeUrl,
            status: "active",
            approvedAt: new Date(),
          })
          .where(eq(memberships.id, input.id));

        return { membershipCode, qrCodeUrl };
      }),

    // Obter carteirinha por código
    getByCode: publicProcedure
      .input(z.object({ code: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;

        const result = await db
          .select()
          .from(memberships)
          .where(eq(memberships.membershipCode, input.code))
          .limit(1);

        if (!result || result.length === 0) return null;

        const member = result[0];

        // Registrar validação
        if (member.id) {
          await db.insert(membershipValidations).values({
            membershipId: member.id,
            membershipCode: input.code,
            validatedAt: new Date(),
          });
        }

        // Retornar apenas informações públicas
        return {
          id: member.id,
          name: member.name,
          membershipCode: member.membershipCode,
          status: member.status,
          approvedAt: member.approvedAt,
          expiresAt: member.expiresAt,
          photoUrl: member.photoUrl,
        };
      }),

    // Validar carteirinha (para empresas conveniadas)
    validate: publicProcedure
      .input(
        z.object({
          code: z.string(),
          validatedBy: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const result = await db
          .select()
          .from(memberships)
          .where(eq(memberships.membershipCode, input.code))
          .limit(1);

        if (!result || result.length === 0) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Carteirinha não encontrada" });
        }

        const member = result[0];

        // Verificar se está ativa
        if (member.status !== "active") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Carteirinha inativa" });
        }

        // Verificar expiração
        if (member.expiresAt && new Date() > member.expiresAt) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Carteirinha expirada" });
        }

        // Registrar validação
        await db.insert(membershipValidations).values({
          membershipId: member.id,
          membershipCode: input.code,
          validatedBy: input.validatedBy,
          ipAddress: (ctx.req.headers["x-forwarded-for"] as string) || "",
          userAgent: (ctx.req.headers["user-agent"] as string) || "",
        });

        return {
          valid: true,
          name: member.name,
          membershipCode: member.membershipCode,
          approvedAt: member.approvedAt,
          expiresAt: member.expiresAt,
        };
      }),

    // Importar filiados via CSV
    importCSV: protectedProcedure
      .input(
        z.object({
          csvData: z.array(
            z.object({
              name: z.string(),
              email: z.string().email(),
              phone: z.string().optional(),
              cpf: z.string().optional(),
              professionalRegistration: z.string().optional(),
            })
          ),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const results = [];
        let successCount = 0;
        let errorCount = 0;

        for (const row of input.csvData) {
          try {
            const result = await db.insert(memberships).values({
              ...row,
              status: "pending",
            });
            results.push({ ...row, success: true });
            successCount++;
          } catch (error) {
            results.push({ ...row, success: false, error: String(error) });
            errorCount++;
          }
        }

        return {
          totalImported: input.csvData.length,
          successCount,
          errorCount,
          results,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
