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
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("memberships procedures", () => {
  it("should create a new membership request", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as any,
      res: { clearCookie: () => {} } as any,
    });

    const result = await caller.memberships.create({
      name: "João Silva",
      email: "joao@example.com",
      phone: "67999999999",
      cpf: "12345678900",
      professionalRegistration: "AUDIT-001",
    });

    expect(result).toBeDefined();
  });

  it("should update membership status", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // First create a membership
    const createResult = await caller.memberships.create({
      name: "Maria Santos",
      email: "maria@example.com",
    });

    // Then update its status
    const updateResult = await caller.memberships.updateStatus({
      id: 1,
      status: "active",
    });

    expect(updateResult).toBeDefined();
  });

  it("should import memberships from CSV", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.memberships.importCSV({
      csvData: [
        {
          name: "João Silva",
          email: "joao@example.com",
          phone: "67999999999",
          cpf: "12345678900",
          professionalRegistration: "AUDIT-001",
        },
        {
          name: "Maria Santos",
          email: "maria@example.com",
          phone: "67988888888",
          cpf: "98765432100",
          professionalRegistration: "AUDIT-002",
        },
      ],
    });

    expect(result.totalImported).toBe(2);
    expect(result.successCount).toBeGreaterThanOrEqual(0);
  });

  it("should generate membership card with QR code", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Create a membership first
    await caller.memberships.create({
      name: "Test User",
      email: "test@example.com",
    });

    // Generate card
    const result = await caller.memberships.generateMembershipCard({
      id: 1,
    });

    expect(result.membershipCode).toBeDefined();
    expect(result.membershipCode).toMatch(/^SINDAFIS-\d{4}-\d{5}$/);
    expect(result.qrCodeUrl).toBeDefined();
    expect(result.qrCodeUrl).toContain("qrserver.com");
  });

  it("should validate membership by code", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Create and generate card
    await caller.memberships.create({
      name: "Validation Test",
      email: "validate@example.com",
    });

    const cardResult = await caller.memberships.generateMembershipCard({
      id: 1,
    });

    // Validate
    const validationResult = await caller.memberships.validate({
      code: cardResult.membershipCode,
      validatedBy: "Test Partner",
    });

    expect(validationResult.valid).toBe(true);
    expect(validationResult.name).toBeDefined();
    expect(validationResult.membershipCode).toBe(cardResult.membershipCode);
  });

  it("should reject invalid membership code", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as any,
      res: { clearCookie: () => {} } as any,
    });

    try {
      await caller.memberships.validate({
        code: "INVALID-CODE",
      });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.code).toBe("NOT_FOUND");
    }
  });
});
