import { createTRPCRouter } from "~/server/api/trpc";
import { teamRouter } from "./routers/team";
import { eventRouter } from "./routers/event";
import { userRouter } from "./routers/user";
import { receiptRouter } from "./routers/receipt";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  team: teamRouter,
  event: eventRouter,
  user: userRouter,
  receipt: receiptRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
