import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
};

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: AuthenticatedUser | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  // In a standalone app, you would implement your own session check here.
  // For now, we'll return null to indicate no user is logged in.
  return {
    req: opts.req,
    res: opts.res,
    user: null,
  };
}
