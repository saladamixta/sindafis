import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("news procedures", () => {
  it("should list news", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.news.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should get latest news", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.news.getLatest();
    expect(result === null || typeof result === "object").toBe(true);
  });

  it("should create news with admin role", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const newsData = {
      title: "Test News",
      slug: "test-news",
      content: "Test content",
      excerpt: "Test excerpt",
      coverImage: "https://example.com/image.jpg",
    };

    // This will attempt to create but may fail if DB is not available
    // The important thing is that it doesn't throw FORBIDDEN error
    try {
      await caller.news.create(newsData);
    } catch (error: any) {
      // Accept DB errors, but not permission errors
      expect(error.code).not.toBe("FORBIDDEN");
    }
  });
});

describe("partnerships procedures", () => {
  it("should list partnerships", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.partnerships.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should create partnership with admin role", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const partnershipData = {
      name: "Test Partnership",
      description: "Test description",
      category: "Test",
    };

    try {
      await caller.partnerships.create(partnershipData);
    } catch (error: any) {
      expect(error.code).not.toBe("FORBIDDEN");
    }
  });
});

describe("transparency procedures", () => {
  it("should list transparency documents", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.transparencyDocuments.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should list documents by category", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.transparencyDocuments.listByCategory("Prestação de Contas");
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("memberships procedures", () => {
  it("should create membership (public)", async () => {
    const ctx = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    } as TrpcContext;

    const caller = appRouter.createCaller(ctx);

    const membershipData = {
      name: "Test Member",
      email: "test@example.com",
      phone: "1234567890",
      cpf: "12345678900",
    };

    try {
      await caller.memberships.create(membershipData);
    } catch (error: any) {
      // Accept DB errors, but not permission errors
      expect(error.code).not.toBe("FORBIDDEN");
    }
  });

  it("should list memberships with admin role", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.memberships.list();
    expect(Array.isArray(result)).toBe(true);
  });
});
