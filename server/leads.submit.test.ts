import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("leads.submit", () => {
  it("should validate required fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Test missing name
    await expect(
      caller.leads.submit({
        name: "",
        phone: "9876543210",
        city: "Bengaluru",
        vehicleType: "Bike",
      })
    ).rejects.toThrow();

    // Test invalid phone
    await expect(
      caller.leads.submit({
        name: "John Doe",
        phone: "123",
        city: "Bengaluru",
        vehicleType: "Bike",
      })
    ).rejects.toThrow();

    // Test missing city
    await expect(
      caller.leads.submit({
        name: "John Doe",
        phone: "9876543210",
        city: "",
        vehicleType: "Bike",
      })
    ).rejects.toThrow();

    // Test missing vehicle type
    await expect(
      caller.leads.submit({
        name: "John Doe",
        phone: "9876543210",
        city: "Bengaluru",
        vehicleType: "",
      })
    ).rejects.toThrow();
  });

  // Note: Full integration test requires DATABASE_URL to be set
  // This test validates form structure and validation only
  it("should have leads router with submit procedure", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Verify the procedure exists
    expect(caller.leads).toBeDefined();
    expect(caller.leads.submit).toBeDefined();
  });
});
