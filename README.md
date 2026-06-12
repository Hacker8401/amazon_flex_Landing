# Amazon Flex Hiring Landing Page

A React 19 + Tailwind 4 + Express 4 + tRPC 11 stack for the Amazon Flex hiring landing page.

---

## Quick Facts

- **tRPC-first:** define procedures in `server/routers.ts`, consume them with `trpc.*` hooks.
- **Superjson out of the box:** return Drizzle rows directly—`Date` stays a `Date`.
- **Gateway-ready:** all RPC traffic is under `/api/trpc`, making it easy to route at the edge.

---

## Build Loop (Four Touch Points)

1. Update schema in `drizzle/schema.ts`, then run `pnpm db:push`.
2. Add database helpers in `server/db.ts` (return raw results).
3. Add or extend procedures in `server/routers.ts`, then wire the UI with `trpc.*.useQuery/useMutation`.
4. Build frontend experience in `client/src/pages/`.
5. Run tests with `pnpm test`.

---

## Key Files

```
drizzle/schema.ts → Database tables & types
server/db.ts → Query helpers (reuse across procedures)
server/routers.ts → tRPC procedures
client/src/App.tsx → Routes wiring & layout shells
client/src/lib/trpc.ts → tRPC client binding
client/src/pages/ → Feature UI that calls trpc hooks
```

---

## Environment Variables

- `DATABASE_URL`: Database connection string
- `JWT_SECRET`: Session cookie signing secret
- `OPENAI_API_KEY`: API key for LLM integration (optional)
- `OPENAI_API_BASE`: Base URL for LLM API (optional)

---

## Getting Started

1. Install dependencies: `pnpm install`
2. Set up environment variables in a `.env` file.
3. Push database schema: `pnpm db:push`
4. Start development server: `pnpm dev`
